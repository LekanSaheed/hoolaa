import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import classes from "./SignUp.module.css";
import { LinearProgress } from "@mui/material";
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
  const [isExist, setIsExist] = useState(true);
  const [usnStat, setUsnStat] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (username.length > 0) {
      checkUsernameAvailability();
    } else {
      setUsnStat("");
    }
  }, [username, usnStat, setUsnStat]);
  const auth = getAuth();

  const checkUsernameAvailability = async () => {
    setLoading(true);
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q).then((doc) => {
      if (doc.empty) {
        setIsExist(false);
        setLoading(false);
        setUsnStat("Username Available");
      } else {
        setIsExist(true);
        setLoading(false);
        setUsnStat("Username not available");
      }
    });

    querySnapshot;
    // forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.exists());
    //   return doc.exists();
    //   // if (!doc.exists()) {
    //   //   setIsExist(false);
    //   //   setUsnStat("Username is available");
    //   //   console.log("Availa");
    //   //   return;
    //   // }
    //   // toast.error("Username not available");
    //   // console.log(doc.id, " => ", doc);
    //   // setIsExist(true);
    //   // setUsnStat("Username is not available");
    // });
  };

  const createAccount = async () => {
    setLoading(true);
    console.log(isExist, "");
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
                username: username.toLowerCase().trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                created_at: Timestamp.fromDate(new Date()), //Timestamp.fromDate(new Date("December 10, 1815")),
              },
              { merge: true }
            ).then(() => {
              setError("");
              setLoading(false);
              console.log("user Created");
              toast.success(
                "Account Created, Check mail for email verification"
              );
              setFirstName("");
              setLastName("");
              setEmail("");
              setUsername("");
              setPassword("");
              setConfirmPwd("");
              setIsExist(false);
              
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
        {loading && <LinearProgress />}
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
          <div className={classes.lab_}>
            <label>Username</label>
            <span className={isExist ? classes.exist : classes.notExist}>
              {usnStat}
            </span>
          </div>
          <div className={classes.input_group}>
            <span>ico</span>
            <input
              value={username}
              onChange={async (e) => {
                await setUsername(e.target.value);
              }}
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
        <Button
          disabled={
            isExist ||
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPwd ||
            !username ||
            password !== confirmPwd
          }
          fullWidth={true}
          onClick={createAccount}
        >
          {" "}
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
