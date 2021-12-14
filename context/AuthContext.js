import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useReducer } from "react";
import {
  getAuth,
  onAuthStateChanged,
  onSnapshot,
  db,
  doc,
} from "../firebase/firebase";
const StateContext = createContext({
  authenticated: false,
  user: null,
  loading: true,
});
const DispatchContext = createContext(null);

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "LOGIN":
      localStorage.setItem("uid", payload.user.uid);
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "LOGOUT":
      localStorage.removeItem("uid");
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case "POPULATE":
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
      };
    case "LOADING":
      return {
        ...state,
        loading: true,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error("Unknown action type");
  }
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });
  const dispatch = (type, payload) => defaultDispatch({ type, payload });

  useEffect(() => {
    const fetchUser = async () => {
      dispatch("LOADING");

      const auth = getAuth();
      const uid = localStorage.getItem("uid");
      await onAuthStateChanged(auth, (user) => {
        if (user || uid) {
          onSnapshot(doc(db, "users", user.uid), (doc_) => {
            console.log("Current data: ", doc_.data());

            dispatch("LOGIN", { user, profile: doc_.data() });

            dispatch("STOP_LOADING");
          });

          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User

          // ...
        } else {
          // User is signed out
          // ...
          localStorage.removeItem("uid");
          dispatch("STOP_LOADING");
          console.log("No user");
        }
      });
    };
    fetchUser();
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
