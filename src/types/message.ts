import type { Timestamp } from "firebase/firestore";

export type ZupMessage = {
  id: string;
  text: string | null;
  type: "text" | "image";
  imageUrl: string | null;
  userId: string;
  userNickname: string;
  userPhotoURL: string | null;
  createdAt: Timestamp | null;
};
