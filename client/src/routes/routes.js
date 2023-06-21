import React from "react";


const notFound = React.lazy(() => import("../pages/NotFound"));
const chat = React.lazy(() => import("../pages/chat/MainChat"));
const Login = React.lazy(() => import("../pages/Login/Login"));
const Register = React.lazy(() => import("../pages/Register/Register"));

export const publicRoutes = [
  { path: "/notfound", component: notFound },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/", component: chat },
];

export const PrivateRouter = [
];
