import React from "react";
import Header from "./Header";
import SideNav from "./SideNav";
import classes from "./Wrapper.module.css";
import { useGlobalContext } from "../context/context";
import MobileNav from "./MobileNav";
const Wrapper = ({ children }) => {
  const { isToggled } = useGlobalContext();
  return (
    <div className={classes.container}>
      <SideNav />
      <MobileNav />
      <main
        className={`${classes.main} ${
          isToggled ? classes.shrinkMain : classes.showMain
        }`}
      >
        <Header />
        {children}
      </main>
    </div>
  );
};

export default Wrapper;
