import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import { BiFolder, BiLocationPlus } from "react-icons/bi";
import { MdFavorite, MdRestore } from "react-icons/md";
import { makeStyles } from "@material-ui/core";
import { useAuthState } from "../context/AuthContext";
import { useGlobalContext } from "../context/context";
import { useRouter } from "next/router";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { IoMdAddCircle, IoMdAddCircleOutline } from "react-icons/io";
import { Avatar } from "@mui/material";
import { user } from "firebase-functions/v1/auth";

export default function LabelBottomNavigation() {
  const router = useRouter();
  const [value, setValue] = React.useState(router.pathname);
  const { darkMode } = useGlobalContext();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(newValue);
  };

  const useStyles = makeStyles({
    root: {
      width: "100%",
      backgroundColor: darkMode ? "#373737ff !important" : "#fff",
      "& .css-1bped5o-MuiBottomNavigation-root": {},
      "& .css-b6y1q4-MuiButtonBase-root-MuiBottomNavigationAction-root": {
        fontSize: "30px",
        color: darkMode ? "#fff !important" : "grey",
      },
      "& .css-1ee5err-MuiButtonBase-root-MuiBottomNavigationAction-root.Mui-selected":
        {
          fontSize: "50px",
          color: "#8800ff",
        },
    },
  });
  const _class = useStyles();
  const { user } = useAuthState();
  return (
    <BottomNavigation
      className={_class.root}
      sx={{ width: 500 }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        // label="Recents"
        value="/dashboard"
        icon={value === "/dashboard" ? <AiFillHome /> : <AiOutlineHome />}
      />
      <BottomNavigationAction
        // label="Favorites"
        value="/dashboard/settings"
        icon={<MdFavorite />}
      />
      <BottomNavigationAction
        // label="Nearby"
        value="/dashboard/parties/new"
        icon={
          value === "/dashboard/parties/new" ? (
            <IoMdAddCircle />
          ) : (
            <IoMdAddCircleOutline />
          )
        }
      />
      <BottomNavigationAction
        // label="Folder"
        value="/dashboard/notifications"
        icon={<BiFolder />}
      />
      <BottomNavigationAction
        // label="Folder"
        value="/dashboard/profile"
        icon={
          <Avatar
            sx={{
              height: value === "/dashboard/profile" ? 40 : 30,
              width: value === "/dashboard/profile" ? 40 : 30,
            }}
            src={
              user.profile &&
              user.profile.displayPics &&
              user.profile.displayPics
            }
          >
            {user.profile &&
              !user.profile.displayPics &&
              user.profile.firstName.slice(0, 1).toUpperCase()}
          </Avatar>
        }
      />
    </BottomNavigation>
  );
}
