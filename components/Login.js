import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { useAuthDispatch, useAuthState } from "../context/AuthContext";
import { toast } from "react-toastify";
import Head from "next/head";
import {
  signInWithEmailAndPassword,
  getAuth,
  onSnapshot,
  doc,
  db,
  sendEmailVerification,
} from "../firebase/firebase";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        // Signed in
        const _user = userCredential.user;
        if (_user && _user.emailVerified) {
          // dispatch("LOGIN", _user);

          onSnapshot(doc(db, "users", _user.uid), (doc_) => {
            console.log("Current data: ", doc_.data());

            dispatch("LOGIN", { user: _user, profile: doc_.data() });
            router.push("/dashboard");
            dispatch("STOP_LOADING");
          });
        } else if (_user && _user.emailVerified === false) {
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
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
      });
  };
  return (
    <div className={classes.container}>
      <Head>
        <title>Hoolaa Login</title>
        <meta name="description" content="Hoolaa login, login to hoolaa" />
      </Head>
      <form className={classes.login_form}>
        I am a login
        <div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={login}>Login</button>
      </form>
    </div>
  );
};

export default Login;
