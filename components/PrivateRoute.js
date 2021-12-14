import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "../context/AuthContext";
import Loader from "./Loader";

const PrivateRoute = ({ protectedRoutes, children }) => {
  const { authenticated, loading } = useAuthState();
  const router = useRouter();
  const isProtectedRoute = protectedRoutes.indexOf(router.pathname) !== -1;
  useEffect(() => {
    if (!loading && !authenticated && isProtectedRoute) {
      router.push("/login");
    }
  }, [loading, authenticated, isProtectedRoute]);
  if (loading && !authenticated) {
    return <Loader />;
  }
  if ((loading || !authenticated) && isProtectedRoute) {
    return <Loader />;
  }
  return children;
};

export default PrivateRoute;
