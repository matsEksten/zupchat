import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export async function addSystemMessage(roomId: string, text: string) {
  const messagesRef = collection(db, "rooms", roomId, "messages");

  await addDoc(messagesRef, {
    text,
    type: "system",
    imageUrl: null,
    userId: "system",
    userNickname: "System",
    userPhotoURL: null,
    createdAt: serverTimestamp(),
  });
}
