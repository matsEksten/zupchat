import { useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import MessageBubble from "../components/chat/MessageBubble";
import { useAuthContext } from "../hooks/useAuthContext";

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

  const { user } = useAuthContext();

  if (!roomId || !roomConfig) {
    return <Navigate to="/lobby" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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
            messages.map((message) => (
              <MessageBubble
                message={message}
                isOwn={message.userId === user.uid}
                key={message.id}
              />
            ))}
        </ul>
      </section>

      <form onSubmit={handleSubmit} className="flex items-center">
        <button className="flex items-center justify-center bg-yellow-400 h-9 w-9 rounded-full pb-1 text-3xl cursor-pointer hover:bg-amber-300 transition">
          +
        </button>
        <input
          type="text"
          value={textMsg}
          onChange={(e) => setTextMsg(e.target.value)}
          className="flex-1 bg-white text-black mx-2 h-9 rounded-2xl px-3 focus:outline-none opacity-70 font-chat"
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center h-9 w-9 bg-yellow-400 disabled:opacity-50 rounded-full cursor-pointer hover:bg-amber-300 transition"
        >
          ➤
        </button>
      </form>

      {sendError && <p className="text-red-400 text-xs mt-1">{sendError}</p>}
    </div>
  );
}
