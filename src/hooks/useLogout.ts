import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useAuthContext } from "./useAuthContext";
import { useState } from "react";
import { getAccessibleAuthError } from "../utils/accessibleErrorMsg";

export const useLogout = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
    } catch (err: unknown) {
      const userFriendlyErr = getAccessibleAuthError(err);
      setError(userFriendlyErr);
    } finally {
      setIsPending(false);
    }
  };

  return { logout, error, isPending };
};
