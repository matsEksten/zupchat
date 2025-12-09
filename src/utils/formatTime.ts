import type { Timestamp } from "firebase/firestore";

export function formatTime(time: Timestamp | null): string {
  if (!time) return "";

  const date = time.toDate();

  return date.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
