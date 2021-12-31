import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { useAuthDispatch, useAuthState } from "../context/AuthContext";
import { toast } from "react-toastify";
import Head from "next/head";
import { Button } from "@mui/material";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  getAuth,
  onSnapshot,
  doc,
  db,
  sendEmailVerification,
} from "../firebase/firebase";
import { useRouter } from "next/router";
import { useGlobalContext } from "../context/context";
import { Box } from "@mui/system";
import HoolaLoader from "./HoolaLoader";
const Login = () => {
  const { darkMode } = useGlobalContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAuthDispatch();
  const { user, authenticated } = useAuthState();
  useEffect(() => {
    if (authenticated) {
      console.log(authenticated);
      router.push("/dashboard");
    }
    console.log(authenticated);
  }, [authenticated]);
  const login = (e) => {
    setLoading(true);
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        console.log(userCredential);
        // Signed in
        const _user = userCredential.user;
        if (_user && _user.emailVerified) {
          // dispatch("LOGIN", _user);

          onSnapshot(doc(db, "users", _user.uid), (doc_) => {
            console.log("Current data: ", doc_.data());

            dispatch("LOGIN", { user: _user, profile: doc_.data() });
            setLoading(false);
            router.push("/dashboard");
            toast.success("Logged in successfully");
            dispatch("STOP_LOADING");
          });
        } else if (_user && _user.emailVerified === false) {
          setLoading(false);
          sendEmailVerification(auth.currentUser).then(() => {
            // Email verification sent!
            // ...
            toast.info(
              "Please verify email, check mail for email verification"
            );
          });
        }
        // ...
      })
      .catch((error) => {
        setLoading(false);
        toast.error(
          error.code
            .replace(/-/g, " ")
            .replace("auth/", "")
            .slice(0, 1)
            .toUpperCase() +
            error.code
              .replace(/-/g, " ")
              .replace("auth/", "")
              .slice(1)
              .toLowerCase()
        );
        console.log(error);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };
  return (
    <div
      className={`${classes.container} ${
        darkMode ? classes.darkContainer : ""
      }`}
    >
      <Head>
        <title>Hoolaa Login</title>
        <meta name="description" content="Hoolaa login, login to hoolaa" />
      </Head>
      <form
        className={`${classes.login_form} ${darkMode ? classes.darkForm : ""}`}
      >
        <div className={classes.circle}></div>
        <Box fontWeight="600" fontSize="20px">
          Sign in
        </Box>
        <Box>
          <label className={classes.label}>Email</label>
          <div
            className={`${classes.inputContainer} ${
              darkMode ? classes.darkInput : ""
            }`}
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                backgroundColor: "transparent",
                color: darkMode ? "white" : "black",
              }}
            />
          </div>
        </Box>
        <Box>
          <label className={classes.label}>Password</label>
          <div
            className={`${classes.inputContainer} ${
              darkMode ? classes.darkInput : ""
            }`}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: "transparent",
                color: darkMode ? "white" : "black",
              }}
            />
          </div>
        </Box>
        <Box textAlign="right" color="#6117ff" fontSize="14px" fontWeight="600">
          Forgot Password?
        </Box>
        <Button
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#6117ff",
            alignSelf: "flex-start",
            padding: "7px 22px",
            textTransform: "capitalize",
            fontWeight: "600",
          }}
          size="small"
          onClick={(e) => {
            if (email === "" && password === "") {
              toast.error("Please input Email and password");
            } else if (email === "") {
              toast.error("Please input an email");
            } else if (password === "") {
              toast.error("Please your password");
            } else if (password.length <= 7) {
              toast.error("Password cannot be less than 8 characters");
            } else if (!email.includes("@")) {
              toast.error("Email not valid");
            } else {
              login(e);
            }
          }}
        >
          Sign In
        </Button>
        <Box fontSize="14px">
          Not registered yet?{" "}
          <Link
            href="/signup"
            style={{
              color: "#6117ff !important",
              fontWeight: "600 !important",
            }}
          >
            <span
              className={classes.signUp}
              style={{
                color: "#6117ff !important",
                fontWeight: "600 !important",
              }}
            >
              {" "}
              create an account.
            </span>
          </Link>
        </Box>
      </form>
      {loading && <HoolaLoader />}
    </div>
  );
};

export default Login;
