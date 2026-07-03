import { createBrowserHistory } from "history";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie, setCookie } from "./cookie";

export const TOKEN = "accessToken";


const token = localStorage.getItem(TOKEN);

export const navigateHistory = createBrowserHistory();

export const http = axios.create({
  baseURL: DOMAIN,
  timeout: 3000,
});

http.interceptors.request.use((req) => {
  req.headers = {
    //giữ lại các api phần chung và các api có header riêng
    ...req.headers,
    Authorization: `Bearer ${token}`,
    tokenCybersoft: TOKEN_CYBERSOFT,
  };
  return req;
});
