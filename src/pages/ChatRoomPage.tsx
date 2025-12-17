import { useParams, Navigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, Fragment } from "react";
import { useMessages } from "../hooks/useMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import MessageBubble from "../components/chat/MessageBubble";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDeleteMessage } from "../hooks/useDeleteMessage";
import { addSystemMessage } from "../services/chatService";
import { formatTime } from "../utils/formatTime";
import { formatDate } from "../utils/formatDate";
import { uploadChatImage } from "../services/photoUploadService";
import { HeroVerseBackground } from "../components/backgrounds/HeroVerseBackground";
import { SpaceVerseBackground } from "../components/backgrounds/SpaceVerseBackground";
import { ExclusiveVerseBackground } from "../components/backgrounds/ExclusiveVerseBackground";
import { Plus, Send } from "lucide-react";

type RoomId = "heroverse" | "spaceverse" | "exclusiveverse";

const ROOM_CONFIG = {
  heroverse: { label: "HeroVerse", theme: "hero" },
  spaceverse: { label: "SpaceVerse", theme: "space" },
  exclusiveverse: { label: "ExclusiveVerse", theme: "exclusive" },
};

export default function ChatRoomPage() {
  const [textMsg, setTextMsg] = useState("");
  const [pendingImg, setPendingImg] = useState<{
    file: File;
    previewUrl: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { roomId } = useParams<{ roomId?: string }>();

  const theme =
    roomId === "heroverse"
      ? "hero"
      : roomId === "spaceverse"
      ? "space"
      : "exclusive";

  const themeColor =
    theme === "hero"
      ? "bg-[rgb(253,190,87)]"
      : theme === "space"
      ? "bg-[rgb(131,254,254)]"
      : "bg-[rgb(254,196,230)]";

  const themeRgb =
    theme === "hero"
      ? "253,190,87"
      : theme === "space"
      ? "131,254,254"
      : "254,196,230";

  const location = useLocation() as {
    state?: {
      exclusiveAccess?: boolean;
    };
  };

  const roomConfig = roomId ? ROOM_CONFIG[roomId as RoomId] : undefined;

  const { deleteMessage, error: deleteError } = useDeleteMessage(roomId);

  const { messages, error } = useMessages(roomId);
  const { sendMessage, isPending, error: sendError } = useSendMessage(roomId);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthContext();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
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

  if (roomId === "exclusiveverse") {
    const hasExclusiveAccess = location.state?.exclusiveAccess === true;

    if (!hasExclusiveAccess) {
      return <Navigate to="/lobby" replace />;
    }
  }

  const handleImageButtonClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleImageSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!roomId || !user) return;

    if (!file.type.startsWith("image/")) {
      console.error("Selected file must be an image");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error("Image file is larger than 5 MB");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPendingImg({ file, previewUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isPending) return;

    const trimmed = textMsg.trim();

    if (!pendingImg && !trimmed) return;

    if (!roomId || !user) return;

    setIsSubmitting(true);

    if (pendingImg) {
      try {
        const imageUrl = await uploadChatImage(
          roomId,
          user.uid,
          pendingImg.file
        );

        await sendMessage(trimmed || undefined, imageUrl);

        URL.revokeObjectURL(pendingImg.previewUrl);
        setPendingImg(null);
        setTextMsg("");
      } catch (err) {
        console.error("Failed to send image message:", err);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    try {
      await sendMessage(trimmed);
      setTextMsg("");
    } catch (err) {
      console.error("Failed to send text message:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-full overflow-hidden">
      {roomId === "heroverse" && <HeroVerseBackground />}
      {roomId === "spaceverse" && <SpaceVerseBackground />}
      {roomId === "exclusiveverse" && <ExclusiveVerseBackground />}

      <div className="relative z-10 h-full flex justify-center">
        <div
          className="
          w-full
          lg:w-[70vw] lg:max-w-5xl
          lg:bg-black/15 lg:backdrop-blur-xs
          lg:border-x lg:border-white/10
          "
        >
          <div className="relative z-10 h-full px-4 pb-4 md:pb-6 flex flex-col overflow-hidden">
            <section
              className="flex-1 overflow-y-auto mb-2 pb-4 [scrollbar-width:none] [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden"
            >
              {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
              {deleteError && (
                <p className="text-red-400 text-xs mt-1">{deleteError}</p>
              )}
              <ul>
                {messages.length > 0 &&
                  messages.map((message, index) => {
                    const currentDate = formatDate(message.createdAt);
                    const prevDate =
                      index > 0
                        ? formatDate(messages[index - 1].createdAt)
                        : null;
                    const showDateSeparator =
                      currentDate && currentDate !== prevDate;

                    if (message.type === "system") {
                      return (
                        <Fragment key={message.id}>
                          {showDateSeparator && (
                            <li className="my-4 flex items-center gap-3 text-[11px] uppercase text-white/55">
                              <span className="flex-1 h-px bg-white/15" />
                              <span className="px-2 py-0.5 rounded-full bg-black/30 border border-white/10">
                                {currentDate}
                              </span>
                              <span className="flex-1 h-px bg-white/15" />
                            </li>
                          )}

                          <li className="text-center text-xs text-white/60 my-2">
                            <span className="text-[10px] text-white/40 mr-2">
                              {formatTime(message.createdAt)}
                            </span>
                            <span>{message.text}</span>
                          </li>
                        </Fragment>
                      );
                    }

                    if (message.type === "text" || message.type === "image") {
                      return (
                        <Fragment key={message.id}>
                          {showDateSeparator && (
                            <li className="my-4 flex items-center gap-3 text-[11px] text-white/60">
                              <span className="flex-1 h-px bg-white/20" />
                              <span className="px-2">{currentDate}</span>
                              <span className="flex-1 h-px bg-white/20" />
                            </li>
                          )}
                          <MessageBubble
                            message={message}
                            isOwn={message.userId === user.uid}
                            themeColor={themeColor}
                            themeRgb={themeRgb}
                            onDelete={() =>
                              deleteMessage(
                                message.id,
                                message.userId,
                                message.imageUrl
                              )
                            }
                          />
                        </Fragment>
                      );
                    }

                    return null;
                  })}
              </ul>
              <div ref={bottomRef} />
            </section>

            <form onSubmit={handleSubmit} className="flex items-center">
              {!pendingImg && (
                <button
                  type="button"
                  onClick={handleImageButtonClick}
                  className="shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-black/40 border border-white/15 backdrop-blur-sm text-white/90 hover:bg-black/20 hover:border-white/25"
                >
                  <Plus className="h-6 w-6" />
                </button>
              )}

              <input
                type="text"
                value={textMsg}
                onChange={(e) => setTextMsg(e.target.value)}
                className="min-w-0 mx-2 flex-1 h-9 rounded-2xl bg-white px-3 text-black opacity-60 focus:outline-none font-chat"
              />

              <button
                type="submit"
                disabled={isPending || isSubmitting}
                className={`shrink-0 h-10 w-10 rounded-full text-black transition disabled:opacity-60 ${themeColor}`}
              >
                <Send className="mx-auto h-6 w-6" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelected}
                className="hidden"
              />
            </form>

            {pendingImg && (
              <div className="fixed inset-x-0 top-16 bottom-16 bg-black/80 z-30 flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(pendingImg.previewUrl);
                    setPendingImg(null);
                  }}
                  className="p-4 text-white text-2xl text-left"
                >
                  ✕
                </button>

                <div className="flex-1 flex items-center justify-center px-4">
                  <img
                    src={pendingImg.previewUrl}
                    alt="Image preview"
                    className="max-h-[70vh] max-w-full rounded-xl object-contain"
                  />
                </div>
              </div>
            )}

            {sendError && (
              <p className="text-red-400 text-xs mt-1">{sendError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
