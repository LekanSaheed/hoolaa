import React from "react";
import classes from "./SideNav.module.css";
import { Avatar, Skeleton } from "@mui/material";
import { FiPlusCircle } from "react-icons/fi";
import { AiOutlineAppstore } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { BsCupStraw, BsUiRadiosGrid } from "react-icons/bs";
import { useGlobalContext } from "../context/context";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState, useAuthDispatch } from "../context/AuthContext";
import { MdCategory, MdOutlineCategory } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { RiFolderUserLine } from "react-icons/ri";
export const navLinks = [
  { icon: BsUiRadiosGrid, text: "Dashboard", link: "" },
  { icon: MdOutlineCategory, text: "All Parties", link: "/parties" },
  { icon: RiFolderUserLine, text: "My Parties", link: "/my-parties" },
  { icon: BiUser, text: "Profile", link: "/profile" },
  {
    icon: BsCupStraw,
    text: "Reserved Parties",
    link: "/reserved-parties",
  },
  { icon: AiOutlineSetting, text: "Settings", link: "/settings" },
  { icon: AiOutlineLogout, text: "Logout", link: "/logout" },
];

const SideNav = () => {
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();
  const { isToggled, darkMode } = useGlobalContext();
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };
  return (
    <motion.nav
      variants={variants}
      animate={isToggled && "open"}
      className={`${classes.sideNav} ${
        isToggled ? classes.shrinkNav : classes.showNav
      }
      ${darkMode ? classes.darkNav : ""}`}
    >
      <span> Hoolaa</span>
      <div
        className={`${classes.avatar} ${
          isToggled ? classes.clear_avatar_margin : ""
        }`}
      >
        {!isToggled ? (
          user && user.profile !== undefined ? (
            <Avatar
              src={
                user.profile !== undefined &&
                user.profile.displayPics !== undefined
                  ? user.profile.displayPics
                  : ""
              }
              sx={{ width: 70, height: 70 }}
            >
              {!user.profile.displayPics &&
                user.profile.username.slice(0, 1).toUpperCase()}
            </Avatar>
          ) : (
            <Skeleton variant="circular" width={70} height={70} />
          )
        ) : user && user.profile !== undefined ? (
          <Avatar
            src={
              user &&
              user.profile !== undefined &&
              user.profile.displayPics !== undefined
                ? user.profile.displayPics
                : ""
            }
            sx={{ width: 40, height: 40 }}
          >
            {user &&
              !user.profile.displayPics &&
              user.profile.username.slice(0, 1).toUpperCase()}
          </Avatar>
        ) : (
          <Skeleton variant="circular" width={40} height={40} />
        )}
      </div>
      {!isToggled && (
        <div className={classes.side_group}>
          <span>
            {user && user.profile !== undefined ? (
              user.profile.firstName
            ) : (
              <Skeleton width={Math.floor(Math.random() * 70) + 50} />
            )}
          </span>
          <span style={{ color: "#bababa" }}>
            {user && user.profile !== undefined ? (
              "@" + user.profile.username
            ) : (
              <Skeleton width={Math.floor(Math.random() * 70) + 50} />
            )}
          </span>
          <span>Party Buddies</span>
        </div>
      )}
      <div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className={classes.btn_start}
          onClick={() => router.push("/dashboard/parties/new")}
        >
          <FiPlusCircle />
          {!isToggled && " Start a Party"}
        </motion.button>
      </div>
      <div
        className={`${classes.nav_container} ${
          isToggled ? classes.clear_background : ""
        }`}
      >
        {navLinks.map((nav, id) => {
          return (
            <Link
              onClick={() => {
                if (nav.link === "/logout") {
                  dispatch("LOGOUT");
                  router.push("/login");
                } else {
                  return;
                }
              }}
              key={id}
              href={"/dashboard" + nav.link}
            >
              <a
                className={`${classes.link} ${
                  isToggled ? classes.center_icons : ""
                } ${
                  router.pathname === "/dashboard" + nav.link
                    ? classes.active
                    : router.pathname === "/dashboard" && nav.link === ""
                    ? classes.active
                    : ""
                } `}
              >
                <span className={classes.icon}>
                  <nav.icon />
                </span>
                {!isToggled && nav.text}
              </a>
            </Link>
          );
        })}
      </div>
      <div onClick={() => {}}>Logout</div>
    </motion.nav>
  );
};

export default SideNav;
