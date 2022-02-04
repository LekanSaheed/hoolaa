import React from "react";
import classes from "./ActiveNotifier.module.css";
const ActiveNotifier = () => {
  return (
    <div className={classes.cont}>
      {" "}
      <div className={`${classes.ball} ${classes.ball1}`}></div>
      <div className={`${classes.ball} ${classes.ball2}`}></div>
      <div className={`${classes.ball} ${classes.ball3}`}></div>
    </div>
  );
};

export default ActiveNotifier;
