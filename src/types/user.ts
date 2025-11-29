import { Timestamp } from "firebase/firestore";

export interface ZupUser {
  displayName: string;
  email: string;
  photoURL?: string;
  onBoarded: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
