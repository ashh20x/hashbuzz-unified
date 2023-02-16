import axios, { AxiosResponse } from "axios";
import { AuthCred, CurrentUser, LogoutResponse } from "../types";
import {  forceLogout } from "../Utilities/Constant";

export const getCookie = (cname:string) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

const instance = axios.create({
  baseURL: process.env.REACT_APP_DAPP_API,
  timeout: 15000,
  headers: {
    Authorization: `Token ${getCookie("token")}`,
    "Content-type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // whatever you want to do with the error
    if (error.response.status === 401) forceLogout();
    throw error;
  }
);

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
  put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
};

// export const Post = {
// 	getPosts: (): Promise<PostType[]> => requests.get('posts'),
// 	getAPost: (id: number): Promise<PostType> => requests.get(`posts/${id}`),
// 	createPost: (post: PostType): Promise<PostType> =>
// 		requests.post('posts', post),
// 	updatePost: (post: PostType, id: number): Promise<PostType> =>
// 		requests.put(`posts/${id}`, post),
// 	deletePost: (id: number): Promise<void> => requests.delete(`posts/${id}`),
// };

export const User = {
  getCurrentUser: (): Promise<CurrentUser> => requests.get("/api/users/current"),
};

export const Auth = {
  refreshToken: (refreshToken: string): Promise<AuthCred> => requests.post("/auth/refreshToken", { refreshToken }),
  doLogout: (refreshToken: string): Promise<LogoutResponse> => requests.post("/auth/logout", { refreshToken }),
};
