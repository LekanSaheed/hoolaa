import React from "react";
import classes from "./Header.module.css";
import Link from "next/link";
import { BiHomeCircle } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { MdNotificationsNone } from "react-icons/md";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { Avatar } from "@mui/material";
import { useGlobalContext } from "../context/context";
const Header = () => {
  const { toggleNav } = useGlobalContext();
  return (
    <div className={classes.header}>
      <span className={classes.menu} onClick={() => toggleNav()}>
        <HiOutlineMenuAlt1 />
      </span>
      <div className={classes.header_group}>
        <div className={classes.search}>
          <input type="search" placeholder="Search" />
        </div>
        <Link href="/">
          <a className={classes.icon}>
            <BiHomeCircle />
          </a>
        </Link>
        <Link href="/dashboard/start-party">
          <a className={classes.icon}>
            <FiPlusCircle />
          </a>
        </Link>
        <Link href="/dashboard/notifications">
          <a className={classes.icon}>
            <MdNotificationsNone />
          </a>
        </Link>
        <Avatar sx={{ width: 30, height: 30 }}>L</Avatar>
      </div>
    </div>
  );
};

export default Header;
