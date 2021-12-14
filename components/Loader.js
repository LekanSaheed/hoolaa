import classes from "./Loader.module.css";
const FullPageLoader = () => {
  return (
    <div className={classes.loader_container}>
      <div className={classes.loader}></div>
      <div className={classes.loaders}>
        <div className={`${classes.ball} ${classes.ball1}`}></div>
        <div className={`${classes.ball} ${classes.ball2}`}></div>
        <div className={`${classes.ball} ${classes.ball3}`}></div>
      </div>
    </div>
  );
};

export default FullPageLoader;
