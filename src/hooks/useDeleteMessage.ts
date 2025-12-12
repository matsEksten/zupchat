import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { deleteImageByUrl } from "../services/photoUploadService";

type DeleteMessageFn = (
  messageId: string,
  messageUserId: string,
  imageUrl?: string | null
) => Promise<void>;

export const useDeleteMessage = (roomId?: string) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  const deleteMessage: DeleteMessageFn = async (
    messageId,
    messageUserId,
    imageUrl
  ) => {
    if (!roomId) return;
    if (!user) return;
    if (user.uid !== messageUserId) return;

    setIsPending(true);
    setError(null);

    try {
      const ref = doc(db, "rooms", roomId, "messages", messageId);
      await deleteDoc(ref);

      // if img delete it from storage
      if (imageUrl) {
        await deleteImageByUrl(imageUrl);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Could not delete message, Please try again");
    } finally {
      setIsPending(false);
    }
  };

  return { deleteMessage, isPending, error };
};
