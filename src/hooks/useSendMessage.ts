import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export const useSendMessage = (roomId: string | undefined) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const { user } = useAuthContext();

  const sendMessage = async (text: string) => {
    setError(null);

    if (!roomId) return;

    if (!user) return;

    if (!user.displayName) {
      setError(
        "Your profile is incomplete. Please set a nickname on your profile page."
      );
      return;
    }

    const trimmedText = text.trim();
    if (!trimmedText) return;

    setIsPending(true);

    try {
      const messagesRef = collection(db, "rooms", roomId, "messages");

      console.log("sendMessage: writing to", `rooms/${roomId}/messages`);

      await addDoc(messagesRef, {
        text: trimmedText,
        type: "text",
        imageUrl: null,
        userId: user.uid,
        userNickname: user.displayName,
        userPhotoURL: user.photoURL ?? null,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("useSendMessage error: ", err);
      setError("Could not send message, please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return { sendMessage, error, isPending };
};
