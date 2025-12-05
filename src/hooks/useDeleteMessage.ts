import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

type DeleteMessageFn = (
  messageId: string,
  messageUserId: string
) => Promise<void>;

export const useDeleteMessage = (roomId?: string) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  const deleteMessage: DeleteMessageFn = async (messageId, messageUserId) => {
    if (!roomId) return;
    if (!user) return;
    if (user.uid !== messageUserId) return;

    setIsPending(true);
    setError(null);

    try {
      const ref = doc(db, "rooms", roomId, "messages", messageId);
      await deleteDoc(ref);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Could not delete message, Please try again");
    } finally {
      setIsPending(false);
    }
  };

  return { deleteMessage, isPending, error };
};
