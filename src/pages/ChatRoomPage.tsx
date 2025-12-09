import { useParams, Navigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useMessages } from "../hooks/useMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import MessageBubble from "../components/chat/MessageBubble";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDeleteMessage } from "../hooks/useDeleteMessage";
// import { VerseBackground } from "../components/VerseBackground";
import { addSystemMessage } from "../services/chatService";
import { formatTime } from "../utils/formatTime";

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

  const { deleteMessage, error: deleteError } = useDeleteMessage(roomId);

  const { messages, error } = useMessages(roomId);
  const { sendMessage, isPending, error: sendError } = useSendMessage(roomId);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuthContext();

  useEffect(() => {
    if (!bottomRef.current) return;

    bottomRef.current.scrollIntoView();
  }, [messages.length]);

  useEffect(() => {
    if (!user || !roomId) return;
    if (!user.displayName) return;

    addSystemMessage(roomId, `${user.displayName} joined the room`);

    return () => {
      addSystemMessage(roomId, `${user.displayName} left the room`);
    };
  }, [user, roomId]);

  if (!roomId || !roomConfig) {
    return <Navigate to="/lobby" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.displayName) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = textMsg.trim();
    if (!trimmed) return;
    await sendMessage(trimmed);
    setTextMsg("");
  };

  return (
    <div className="relative min-h-screen">
      {/* roomId === "heroverse" && <VerseBackground verse="heroverse" /> */}
      <div className="relative z-10 min-h-[calc(100vh-4rem)] px-4 py-6 flex flex-col">
        <h1 className="text-2xl font-bold text-white">{roomConfig.label}</h1>

        <section className="flex-1 overflow-y-auto mb-2">
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          {deleteError && (
            <p className="text-red-400 text-xs mt-1">{deleteError}</p>
          )}
          <ul>
            {messages.length > 0 &&
              messages.map((message) => {
                if (message.type === "system") {
                  return (
                    <li
                      key={message.id}
                      className="text-center text-xs text-white/60 my-2"
                    >
                      <span className="text-[10px] text-white/40 mr-2">
                        {formatTime(message.createdAt)}
                      </span>
                      <span>{message.text}</span>
                    </li>
                  );
                }

                if (message.type === "text") {
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.userId === user.uid}
                      onDelete={() => deleteMessage(message.id, message.userId)}
                    />
                  );
                }

                return null;
              })}
          </ul>
        </section>

        <form onSubmit={handleSubmit} className="flex items-center">
          <button
            type="button"
            className="flex items-center justify-center bg-amber-400 h-9 w-9 rounded-full pb-1 text-3xl cursor-pointer hover:bg-amber-300 transition"
          >
            +
          </button>

          <input
            type="text"
            value={textMsg}
            onChange={(e) => setTextMsg(e.target.value)}
            className="flex-1 bg-white text-black mx-2 h-9 rounded-2xl px-3 focus:outline-none opacity-80 font-chat"
          />

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center h-9 w-9 bg-amber-400 disabled:opacity-50 rounded-full cursor-pointer hover:bg-amber-300 transition"
          >
            ➤
          </button>
        </form>

        {sendError && <p className="text-red-400 text-xs mt-1">{sendError}</p>}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
