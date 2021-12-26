import React, { useState } from "react";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import { useGlobalContext } from "../context/context";
import classes from "./MobileNav.module.css";
import { navLinks } from "./SideNav";
import { useRouter } from "next/router";
import { MdClose } from "react-icons/md";
import { Box } from "@mui/system";
import { BiMoon, BiSun } from "react-icons/bi";

const itemVariants = {
  closed: {
    opacity: 0,
  },
  open: { opacity: 1 },
};
const sideVariants = {
  closed: {
    transition: {
      staggerChildren: 0,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: 1,
    },
  },
};

const links = [...navLinks, { text: "Create Party", link: "/parties/new" }];
const MobileNav = () => {
  const router = useRouter();
  const { isToggleMobile, toggleMobile, toggleTheme, darkMode } =
    useGlobalContext();
  return (
    <main>
      <AnimatePresence>
        {isToggleMobile && (
          <motion.div className={classes.backgroundCont}>
            <motion.aside
              initial={{ width: 0 }}
              animate={{
                width: 300,
              }}
              exit={{
                width: 0,
                marginLeft: -40,
                transition: { delay: 0.2, duration: 0.1 },
              }}
            >
              <motion.div
                className={`${classes.container} ${
                  darkMode ? classes.darkContainer : classes.lightContainer
                }`}
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideVariants}
              >
                <Box display="flex" justifyContent="space-between">
                  {" "}
                  <div onClick={() => toggleMobile()}>
                    <MdClose />
                  </div>
                  <div onClick={() => toggleTheme()}>
                    {darkMode ? <BiSun /> : <BiMoon />}
                  </div>
                </Box>
                {links.map((nav, id) => (
                  <div
                    key={id}
                    onClick={async () => {
                      toggleMobile();
                      router.push("/dashboard" + nav.link);
                    }}
                  >
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      variants={itemVariants}
                    >
                      {nav.text}
                    </motion.a>
                  </div>
                ))}
              </motion.div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="btn-container"></div>
    </main>
  );
};

export default MobileNav;
