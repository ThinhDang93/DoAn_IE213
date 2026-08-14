import React from "react";
import { Navigate } from "react-router-dom";
import { TOKEN } from "./interceptor";

const getCurrentUser = () => {
  const raw = localStorage.getItem("user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ roles, children }) => {
  const token = localStorage.getItem(TOKEN);
  const user = getCurrentUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.maLoaiNguoiDung)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
