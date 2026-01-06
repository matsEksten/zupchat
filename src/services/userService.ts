import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import type { ZupUser } from "../types/user";

export const validateNickname = (input: string): string | null => {
  const trimmed = input.trim();

  if (!trimmed) return "Nickname is required.";
  if (trimmed.length < 3) return "Nickname must be at least 3 characters.";
  if (trimmed.length > 12) return "Nickname can be max 12 characters.";

  return null;
};

export const isNicknameTaken = async (nickname: string): Promise<boolean> => {
  const key = nickname.trim().toLowerCase();

  if (!key) return false;

  const ref = doc(db, "usernames", key);
  const snap = await getDoc(ref);

  return snap.exists();
};

export const getUserProfile = async (id: string): Promise<ZupUser | null> => {
  const ref = doc(db, "users", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

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
      { ...data, createdAt: currentTime, updatedAt: currentTime },
      { merge: true }
    );
  } else {
    await setDoc(ref, { ...data, updatedAt: currentTime }, { merge: true });
  }
};
