import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { useAuthDispatch, useAuthState } from "../context/AuthContext";

import Head from "next/head";
import { signInWithEmailAndPassword, getAuth } from "../firebase/firebase";
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
        if (_user) {
          dispatch("LOGIN", _user);
          router.push("/dashboard");
          console.log(_user);
        }
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error.code);
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
