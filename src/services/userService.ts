import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import type { ZupUser } from "../types/user";

export const getUserProfile = async (id: string): Promise<ZupUser | null> => {
  const ref = doc(db, "users", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return snap.data() as ZupUser;
};

export const upsertUserProfile = async (
  id: string,
  data: Partial<ZupUser>
): Promise<void> => {
  const ref = doc(db, "users", id);
  const currentTime = serverTimestamp();

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(
      ref,
      {
        ...data,
        createdAt: currentTime,
        updatedAt: currentTime,
      },
      { merge: true }
    );
  } else {
    await setDoc(
      ref,
      {
        ...data,
        updatedAt: currentTime,
      },
      { merge: true }
    );
  }
};
