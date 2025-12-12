import { useState } from "react";
import { deleteUser } from "firebase/auth";
import { db } from "../firebase/config";
import { deleteImageByUrl } from "../services/photoUploadService";
import { doc, deleteDoc } from "firebase/firestore";
import { getUserProfile } from "../services/userService";
import { useAuthContext } from "./useAuthContext";
import { getAccessibleAuthError } from "../utils/accessibleErrorMsg";

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

    const uid = user.uid;

    let profilePhotoUrl: string | null = null;
    try {
      const profile = await getUserProfile(uid);
      profilePhotoUrl = profile?.photoURL ?? null;
    } catch (err) {
      console.error("Could not read profile before delete:", err);
    }

    try {
      await deleteUser(user);

      if (profilePhotoUrl) {
        try {
          await deleteImageByUrl(profilePhotoUrl);
        } catch (err) {
          console.error("Could not delete profile photo", err);
        }
      }

      try {
        await deleteDoc(doc(db, "users", uid));
      } catch (err) {
        console.error("Could not delete user document", err);
      }

      dispatch({ type: "LOGOUT" });

      return true;
    } catch (err: unknown) {
      const userFriendlyErr = getAccessibleAuthError(err);
      setError(userFriendlyErr);

      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteAccount, isDeleting, error };
};
