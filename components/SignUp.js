import { Button } from "@mui/material";
import React, { useState } from "react";
import classes from "./SignUp.module.css";
import {
  createUserWithEmailAndPassword,
  db,
  getAuth,
  Timestamp,
  doc,
  onSnapshot,
  setDoc,
  collection,
  where,
  query,
  getDocs,
} from "../firebase/firebase";
import { toast } from "react-toastify";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = getAuth();

  const test = () => {};
  const createAccount = async () => {
    setLoading(true);
    const allUsers = [];
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    const isExist = null;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      if (doc.exists) {
        toast.error("Username not available");
        console.log(doc.id, " => ", doc.data());
        isExist += true;
        return;
      }
    });
    console.log(isExist);
    // const querySnapshot = await getDocs(collection(db, "users"));
    !isExist &&
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (user) => {
          console.log(user, "A user");
          if (user) {
            const userRef = doc(db, "users", user.user.uid);

            setDoc(
              userRef,
              {
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                created_at: Timestamp.fromDate(new Date()), //Timestamp.fromDate(new Date("December 10, 1815")),
              },
              { merge: true }
            ).then(() => {
              setError("");
              setLoading(false);
              console.log("user Created");
              toast.success("Account Created");
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
          setLoading(false);
          toast.error(err.message.replace(/-/g, " ").slice(9));
        });
  };

  return (
    <div className={classes.container}>
      <form className={classes.form}>
        <div>Create account</div>
        <div className={classes.input_container}>
          <label>First Name</label>
          <div className={classes.input_group}>
            <span>ico</span>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        </div>
        <div className={classes.input_container}>
          <label>Last Name</label>
          <div className={classes.input_group}>
            <span>ico</span>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className={classes.input_container}>
          <label>username</label>
          <div className={classes.input_group}>
            <span>ico</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className={classes.input_container}>
          <label>Email </label>
          <div className={classes.input_group}>
            <span>ico</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className={classes.input_container}>
          <label>Password </label>
          <div className={classes.input_group}>
            <span>ico</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className={classes.input_container}>
          <label>Confirm password</label>
          <div className={classes.input_group}>
            <span>ico</span>
            <input
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
          </div>
        </div>
        <Button fullWidth={true} onClick={createAccount}>
          {" "}
          Create Account
        </Button>
        <Button onClick={test}>TEst</Button>
      </form>
    </div>
  );
};

export default SignUp;
