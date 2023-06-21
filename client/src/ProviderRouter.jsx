import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProviderRouter = () => {
  const token = JSON.parse(localStorage.getItem("tokens"));
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProviderRouter;
