import { Timestamp } from "firebase/firestore";

export interface ZupUser {
  displayName: string;
  email: string;
  photoURL?: string | null;
  onBoarded: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
