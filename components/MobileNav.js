import React, { useState } from "react";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import { useGlobalContext } from "../context/context";
import classes from "./MobileNav.module.css";
import { navLinks } from "./SideNav";
import Link from "next/link";
import { MdClose } from "react-icons/md";
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
      staggerChildren: 0.2,
      staggerDirection: 1,
    },
  },
};
const MobileNav = () => {
  const { isToggleMobile, toggleMobile } = useGlobalContext();
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
                className={classes.container}
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideVariants}
              >
                <div onClick={() => toggleMobile()}>
                  <MdClose />
                </div>
                {navLinks.map((nav, id) => (
                  <Link key={id} href={"/dashboard" + nav.link}>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      variants={itemVariants}
                    >
                      {nav.text}
                    </motion.a>
                  </Link>
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
