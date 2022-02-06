import React from "react";
import Header from "./Header";
import SideNav from "./SideNav";
import classes from "./Wrapper.module.css";
import { useGlobalContext } from "../context/context";
import MobileNav from "./MobileNav";
import HoolaaButtomNav from "./HoolaaButtomNav";
import { useRouter } from "next/router";
const Wrapper = ({ children }) => {
  const router = useRouter();
  const { isToggled, darkMode } = useGlobalContext();
  return (
    <div className={classes.container}>
      <SideNav />
      <MobileNav />
      <main
        style={{ overflowX: router.pathname === "/dashboard" && "hidden" }}
        className={`${classes.main} ${
          isToggled ? classes.shrinkMain : classes.showMain
        } ${darkMode ? classes.dark : classes.light}`}
      >
        <Header />
        {children}
        <div className={classes.mobileButtomNav}>
          {" "}
          <HoolaaButtomNav />
        </div>
      </main>
    </div>
  );
};

export default Wrapper;
