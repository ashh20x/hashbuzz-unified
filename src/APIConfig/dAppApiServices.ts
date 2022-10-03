import axios, { Method } from "axios";
import { useCookies } from "react-cookie";
import { dAppApiURL, getCookie } from "../Utilities/Constant";

interface APIProps {
  method: Method;
  url: string;
  data?: any;
}

export const useDappAPICall = () => {
  const [cookies] = useCookies(["token"]);

  const dAppAPICall = async (props: APIProps) => {
    const token = getCookie("token");
    const { method, url, data } = props;
    const request = await axios({
      method,
      url: dAppApiURL + url,
      data,
      headers: {
        Authorization: `Token ${cookies.token ?? token}`,
        "Content-type": "application/json",
      },
    });
    return request.data;
  };

  return { dAppAPICall };
};
