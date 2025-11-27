import { useReducer, useEffect, type PropsWithChildren } from "react";
import { auth } from "../firebase/config";
import { AuthContext, authReducer } from "./AuthContext";

export const AuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
      unsub();
    });
  }, []);

  console.log("AuthContext state", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {state.authIsReady && children}
    </AuthContext.Provider>
  );
};
