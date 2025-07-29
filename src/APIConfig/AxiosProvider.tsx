import axios, { AxiosInstance } from "axios";
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useStore } from "../Store/StoreProvider";
import { getCookieByName, getErrorMessage } from "../Utilities/helpers";

const generateUniqueId = () => {
  return "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

function getOrCreateUniqueID() {
  let userId = localStorage.getItem("device_id");
  if (!userId) {
    userId = generateUniqueId();
    localStorage.setItem("device_id", userId);
  }
  return userId;
}

const refreshTokenInterval = 2 * 60 * 1000; // Refresh token every 12 minutes
const useRefreshToken = false; // Flag to enable/disable token refresh

export const AxiosContext = createContext<AxiosInstance | null>(null);

const AxiosProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["aSToken", "refreshToken", "XSRF-TOKEN"]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(getOrCreateUniqueID());
  const [astToken, setAstToken] = useState<string | null>(cookies.aSToken ?? getCookieByName("aSToken"));
  const { auth, dispatch } = useStore();

  const axiosInstance = useRef<AxiosInstance>(
    axios.create({
      baseURL: import.meta.env.VITE_DAPP_API,
      timeout: 15000,
      headers: {
        "Content-type": "application/json",
        "csrf-token": getCookieByName("XSRF-TOKEN") || "",
      },
      withCredentials: true, // Ensure cookies are sent
    })
  );

  const refreshAccessToken = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const response = await axiosInstance.current.post<{ ast: string; message: string }>("/auth/refresh-token", {
        refreshToken: cookies.refreshToken,
      });
      const newToken = response.data.ast;
      setCookie("aSToken", newToken, { path: "/" });
      setAstToken(newToken);
      toast.success("Token refreshed successfully.");
    } catch (error) {
      toast.error("Failed to refresh token. Please log in again.");
      // handleLogout(); // Uncomment and define this function if you need to handle logout
    } finally {
      setIsRefreshing(false);
    }
  }, [cookies.refreshToken, isRefreshing, setCookie]);

  const inValidateAuthentication = useCallback(() => {
    console.log("Unauthorized::Invalidating authentication and clearing cookies");

    // Remove authentication cookies
    removeCookie("aSToken");
    removeCookie("refreshToken");

    // Remove CSRF token
    removeCookie("XSRF-TOKEN");

    // Reset application state
    dispatch({ type: "RESET_STATE" });
  }, [dispatch, removeCookie]);

  useEffect(() => {
    if (useRefreshToken) {
      const intervalId = setInterval(refreshAccessToken, refreshTokenInterval);
      return () => clearInterval(intervalId);
    }
  }, [refreshAccessToken]);

  useEffect(() => {
    if (!deviceId) {
      setDeviceId(getOrCreateUniqueID());
    }
  }, [deviceId]);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_DAPP_API}/auth/csrf-token`, {
          withCredentials: true, // Ensure cookies are sent
        });

        if (response.data.csrfToken) {
          setCookie("XSRF-TOKEN", response.data.csrfToken, { path: "/" });
          console.log("Fetched new CSRF Token:", response.data.csrfToken);
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    if (!cookies["XSRF-TOKEN"]) {
      fetchCsrfToken();
    }
  }, []);

  useEffect(() => {
    setAstToken(cookies.aSToken ?? (auth?.ast ? getCookieByName("aSToken") : undefined));
  }, [cookies.aSToken, auth]);

  useEffect(() => {
    const instance = axiosInstance.current;

    const requestInterceptor = instance.interceptors.request.use(
      (config) => {
        if (config.headers && deviceId) {
          config.headers["X-Device-ID"] = deviceId;
        }
        if (astToken && config.headers) {
          config.headers["Authorization"] = `Bearer ${astToken}`;
        }

        // Ensure CSRF token is included in all requests
        const csrfToken = cookies["XSRF-TOKEN"] ?? getCookieByName("XSRF-TOKEN");
        if (csrfToken && config.headers) {
          config.headers["X-XSRF-TOKEN"] = csrfToken;
          console.log("Adding CSRF Token:", csrfToken);
        } else {
          console.warn("CSRF Token missing from cookies!");
        }

        // Add CSRF token to request body if it exists and the request has a body
        if (csrfToken && config.data && typeof config.data === "object") {
          config.data._csrf = csrfToken;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log("error from instance", error);
        if (!error.response) {
          console.error("Network error or server is offline:", error.message);
          toast.error("Unable to connect to the server. Please check your network connection or try again later.");
        } else {
          const status = error.response.status;
          switch (status) {
            case 401:
              inValidateAuthentication();
              toast.error("Unauthorized access OR Session expired. Authentication required.");
              break;
            case 500:
              toast.error("An internal server error occurred. Please try again later.");
              break;
            case 429:
              toast.warn(
                <div>
                  <strong>Too many requests!</strong>
                  <p>Too many requests. Please try again later.</p>
                </div>
              );
              break;
            case 403: // CSRF Token Mismatch
              console.error("CSRF token mismatch. Resetting session.");

              // Clear cookies
              removeCookie("aSToken", { path: "/" });
              removeCookie("refreshToken", { path: "/" });
              removeCookie("XSRF-TOKEN", { path: "/" });

              toast.error("Session expired due to security reasons. Refreshing...");

              // Restart the application after a short delay
              setTimeout(() => {
                window.location.reload(); // Hard refresh to reinitialize CSRF flow
              }, 1000);

              break;
            default:
              toast.error(getErrorMessage(error));
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [astToken, deviceId, inValidateAuthentication, cookies]);

  return <AxiosContext.Provider value={axiosInstance.current}>{children}</AxiosContext.Provider>;
};

export const useAxios = () => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};

export default AxiosProvider;
