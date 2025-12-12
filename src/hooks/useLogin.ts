import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { getAccessibleAuthError } from "../utils/accessibleErrorMsg";

export const useLogin = () => {
  const [error, setError] = useState<null | string>(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email: string, password: string) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      dispatch({ type: "LOGIN", payload: res.user });
      return res.user;
    } catch (err: unknown) {
      const userFriendlyErr = getAccessibleAuthError(err);
      setError(userFriendlyErr);
    } finally {
      setIsPending(false);
    }
  };

  return { login, error, isPending };
};
