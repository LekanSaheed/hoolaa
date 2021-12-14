import React, { useEffect } from "react";
import PopParties from "../../components/PopParties";
import Wrapper from "../../components/Wrapper";
import { useAuthState } from "../../context/AuthContext";
import { getAuth, onAuthStateChanged } from "../../firebase/firebase";

const Dashboard = () => {
  const isLoggedIn = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
        console.log("No user");
      }
    });
  };
  const { user, authenticated } = useAuthState();
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <div>
      <Wrapper>
        <PopParties />
      </Wrapper>
    </div>
  );
};

export default Dashboard;
