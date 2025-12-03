import { useState } from "react";
import { deleteUser } from "firebase/auth";
import { db, storage } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";
import { getUserProfile } from "../services/userService";
import { useAuthContext } from "./useAuthContext";
import { ref, deleteObject } from "firebase/storage";
import { FirebaseError } from "firebase/app";

export const useDeleteAccount = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dispatch, user } = useAuthContext();

  const deleteAccount = async () => {
    setError(null);
    setIsDeleting(true);

    if (!user) {
      setIsDeleting(false);
      return false;
    }

    try {
      await deleteUser(user);

      try {
        const profile = await getUserProfile(user.uid);

        if (profile?.photoURL) {
          try {
            const photoRef = ref(storage, profile.photoURL);
            await deleteObject(photoRef);
          } catch (err) {
            console.error("Could not delete profile photo", err);
          }
        }
      } catch (err) {
        console.error("Could not read profile during cleanup", err);
      }

      try {
        await deleteDoc(doc(db, "users", user.uid));
      } catch (err) {
        console.error("Could not delete user document", err);
      }

      dispatch({ type: "LOGOUT" });

      return true;
    } catch (err: unknown) {
      if (
        err instanceof FirebaseError &&
        err?.code === "auth/requires-recent-login"
      ) {
        setError(
          "For security reasons you need to log out and log in again before deleting your account."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }

      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteAccount, isDeleting, error };
};
