import { createBrowserHistory } from "history";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie, setCookie } from "./cookie";

export const TOKEN = "accessToken";

const DOMAIN = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const navigateHistory = createBrowserHistory();

export const http = axios.create({
  baseURL: DOMAIN,
  timeout: 15000,
});

http.interceptors.request.use((req) => {
  const token = localStorage.getItem(TOKEN);

  req.headers = {
    ...req.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return req;
});
