/* eslint-disable react/jsx-key */
import React, { lazy } from "react";
import AuthorizedRoute from "base-shell/lib/components/AuthorizedRoute";
import UnauthorizedRoute from "base-shell/lib/components/UnauthorizedRoute";

const SignIn = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/Signup"));
const PasswordReset = lazy(() => import("../pages/PasswordReset"));
const About = lazy(() => import("../pages/About"));
const Home = lazy(() => import("../pages/Landing"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const UserDashboard = lazy(() => import("../pages/UserDashboard"));

const routes = [
  {
    path: "/signin",
    exact: true,
    element: (
      <UnauthorizedRoute>
        <SignIn redirectTo='/home' />
      </UnauthorizedRoute>
    ),
  },
  {
    path: "/signup",
    exact: true,
    element: (
      <UnauthorizedRoute>
        <SignUp redirectTo='/home' />
      </UnauthorizedRoute>
    ),
  },
  {
    path: "/password_reset",
    exact: true,
    element: (
      <UnauthorizedRoute>
        <PasswordReset redirectTo='/home' />
      </UnauthorizedRoute>
    ),
  },
  {
    path: "/about",
    exact: true,
    element: <About />,
  },
  {
    path: "/dashboard",
    exact: true,
    element: (
      <AuthorizedRoute>
        <UserDashboard />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/home",
    exact: true,
    element: (
      <AuthorizedRoute>
        <Home />
      </AuthorizedRoute>
    ),
  },
  {
    path: "/*",
    exact: true,
    element: <PageNotFound />,
  },
];

export default routes;
