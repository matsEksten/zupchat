// src/hooks/useMessages.ts
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import type { ZupMessage } from "../types/message";

export const useMessages = (roomId: string | undefined) => {
  const [messages, setMessages] = useState<ZupMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const messagesRef = collection(db, "rooms", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results: ZupMessage[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            text: data.text ?? null,
            type: data.type ?? "text",
            imageUrl: data.imageUrl ?? null,
            userId: data.userId,
            userNickname: data.userNickname,
            userPhotoURL: data.userPhotoURL ?? null,
            createdAt: data.createdAt ?? null,
          };
        });

        setMessages(results);
        setError(null);
      },
      (err) => {
        console.error("useMessages error:", err);
        setError("Could not load messages");
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  return { messages, error };
};
