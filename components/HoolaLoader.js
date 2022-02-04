import React from "react";
import classes from "./HoolaaLoader.module.css";
const HoolaLoader = () => {
  return (
    <div className={classes.container}>
      <div className={classes.loader}>
        <div className={`${classes.ball} ${classes.ball1}`}></div>
        <div className={`${classes.ball} ${classes.ball2}`}></div>
        <div className={`${classes.ball} ${classes.ball3}`}></div>
        <div className={`${classes.ball} ${classes.ball4}`}></div>
        <div className={`${classes.ball} ${classes.ball5}`}></div>
      </div>
    </div>
  );
};

export default HoolaLoader;
