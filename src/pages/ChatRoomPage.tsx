import { useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { useSendMessage } from "../hooks/useSendMessage";

type RoomId = "heroverse" | "spaceverse" | "exclusiveverse";

const ROOM_CONFIG = {
  heroverse: { label: "HeroVerse", theme: "hero" },
  spaceverse: { label: "SpaceVerse", theme: "space" },
  exclusiveverse: { label: "ExclusiveVerse", theme: "exclusive" },
};

export default function ChatRoomPage() {
  const [textMsg, setTextMsg] = useState("");

  const { roomId } = useParams<{ roomId?: string }>();

  const roomConfig = roomId ? ROOM_CONFIG[roomId as RoomId] : undefined;

  const { messages, error } = useMessages(roomId);
  const { sendMessage, isPending, error: sendError } = useSendMessage(roomId);

  if (!roomId || !roomConfig) {
    return <Navigate to="/lobby" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(textMsg);
    setTextMsg("");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-6">
      <h1 className="text-2xl font-bold text-white">{roomConfig.label}</h1>

      <section>
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <ul>
          {messages.length > 0 &&
            messages.map((m) => (
              <li key={m.id}>
                <span className="bg-white text-black">{m.text}</span>
              </li>
            ))}
        </ul>
      </section>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={textMsg}
          onChange={(e) => setTextMsg(e.target.value)}
          className="bg-white text-black"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 text-sm font-semibold rounded bg-blue-600 text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>

      {sendError && <p className="text-red-400 text-xs mt-1">{sendError}</p>}
    </div>
  );
}
