import React from "react";
import classes from "./SideNav.module.css";
import { Avatar } from "@mui/material";
import { FiPlusCircle } from "react-icons/fi";
import { AiOutlineAppstore } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { BsCupStraw } from "react-icons/bs";
import { useGlobalContext } from "../context/context";
import Link from "next/link";
import { useAuthState } from "../context/AuthContext";
const navLinks = [
  { icon: <AiOutlineAppstore />, text: "All Parties", link: "/all-parties" },
  {
    icon: <BsCupStraw />,
    text: "Reserved Parties",
    link: "/reserved-parties",
  },
  { icon: <AiOutlineSetting />, text: "Settings", link: "/settings" },
  { icon: <AiOutlineLogout />, text: "Logout", link: "/logout" },
];

const SideNav = () => {
  const { user } = useAuthState();
  const { isToggled } = useGlobalContext();
  return (
    <div
      className={`${classes.sideNav} ${
        isToggled ? classes.shrinkNav : classes.showNav
      }`}
    >
      <span> Hoolaa</span>
      <div
        className={`${classes.avatar} ${
          isToggled ? classes.clear_avatar_margin : ""
        }`}
      >
        {!isToggled ? (
          <Avatar sx={{ width: 70, height: 70 }}>L</Avatar>
        ) : (
          <Avatar sx={{ width: 40, height: 40 }}>L</Avatar>
        )}
      </div>
      {!isToggled && (
        <div className={classes.side_group}>
          <span>
            {user.profile !== undefined ? user.profile.firstName : "loading"}
          </span>
          <span>Username</span>
          <span>Party Buddies</span>
        </div>
      )}
      <div>
        <button className={classes.btn_start}>
          <FiPlusCircle />
          {!isToggled && " Start a Party"}
        </button>
      </div>
      <div
        className={`${classes.nav_container} ${
          isToggled ? classes.clear_background : ""
        }`}
      >
        {navLinks.map((nav, id) => {
          return (
            <Link key={id} href={"/dashboard" + nav.link}>
              <a
                className={`${classes.link} ${
                  isToggled ? classes.center_icons : ""
                }`}
              >
                <span className={classes.icon}> {nav.icon}</span>
                {!isToggled && nav.text}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideNav;
