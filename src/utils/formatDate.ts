import type { Timestamp } from "firebase/firestore";

export function formatDate(timestamp: Timestamp | null): string {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return date.toLocaleDateString("sv-SE");
}
