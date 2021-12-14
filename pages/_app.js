import "../styles/globals.css";
import { AppContext } from "../context/context";
import { defaultState } from "../context/defaultState";
import { useReducer, useEffect } from "react";
import { reducer } from "../context/reducer";
import PrivateRoute from "../components/PrivateRoute";
import { useRouter } from "next/router";
import { AuthProvider } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function MyApp({ Component, pageProps }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const toggleNav = () => {
    dispatch({ type: "TOGGLE_NAV" });
  };
  const protectedRoutes = [
    "/dashboard",
    "/dashboard/parties",
    "/dashboard/all-employee",
    "/dashboard/profile",
    "/payroll/transaction-history",
    "/payroll/pay-run",
    "/payroll/pay-run/add-new",
    "/payroll/topup",
  ];
  return (
    <AppContext.Provider value={{ ...state, toggleNav }}>
      <AuthProvider>
        <PrivateRoute protectedRoutes={protectedRoutes}>
          <ToastContainer autoClose={3000} />
          <Component {...pageProps} />
        </PrivateRoute>
      </AuthProvider>
    </AppContext.Provider>
  );
}

export default MyApp;
