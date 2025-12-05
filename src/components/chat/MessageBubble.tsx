import type { ZupMessage } from "../../types/message";

type MessageBubbleProps = {
  message: ZupMessage;
  isOwn: boolean;
  onDelete?: () => void;
};

export default function MessageBubble({
  message,
  isOwn,
  onDelete,
}: MessageBubbleProps) {
  const avatarUrl = message.userPhotoURL ?? "/images/avatar.png";
  return (
    <li
      className={`
    my-5
    flex
    ${isOwn ? "justify-end" : "justify-start"}
  `}
    >
      <div
        className={`
      flex flex-col
      ${isOwn ? "items-end" : "items-start"}
      max-w-[75%]
    `}
      >
        {!isOwn && (
          <span className="block text-purple-400 text-left ml-1 font-chat">
            {message.userNickname}
          </span>
        )}

        <div
          className={`
        relative
        inline-block
        ${isOwn ? "pt-6 pb-2 px-4" : "py-2 px-4"}
        rounded-2xl
        text-lg
        shadow-sm
        ${isOwn ? "bg-yellow-400 text-black" : "bg-white text-black"}
        z-10
        font-chat
        break-all
      `}
        >
          {message.text}

          {isOwn && (
            <span
              className="absolute -top-2.5 right-0 p-2 text-red-500 font-bold text-2xl cursor-pointer"
              onClick={onDelete}
            >
              ✕
            </span>
          )}

          <span
            className={`
              absolute
              -bottom-2
              ${isOwn ? "right-2 rotate-[-8deg]" : "left-2 rotate-[8deg]"}
              w-0 h-0
              border-t-10
              ${isOwn ? "border-t-yellow-400" : "border-t-white"}
              border-x-8
              border-x-transparent
              z-[-1]
            `}
          ></span>
        </div>

        <img
          src={avatarUrl}
          alt={isOwn ? "You" : message.userNickname}
          className="mt-3 h-8 w-8 rounded-full object-cover"
        />
      </div>
    </li>
  );
}
