import { createBrowserHistory } from "history";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie, setCookie } from "./cookie";

export const TOKEN = "accessToken";

const DOMAIN = "https://movienew.cybersoft.edu.vn";
const TOKEN_CYBERSOFT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJEZXZPcHMgMDIiLCJIZXRIYW5TdHJpbmciOiIyOC8wOS8yMDI2IiwiSGV0SGFuVGltZSI6IjE3OTA1NTM2MDAwMDAiLCJuYmYiOjE3NjkwMTQ4MDAsImV4cCI6MTc5MDcwMTIwMH0.zSBJtqDLuPvKwr_on1Oi5AZu5DlaEWUjNmyd-Rbmy7Q";

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
