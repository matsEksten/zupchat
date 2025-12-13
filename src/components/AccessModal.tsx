import type React from "react";

type AccessModalProps = {
  accessCode: string;
  accessError: string | null;
  onChangeCode: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
};

export const AccessModal: React.FC<AccessModalProps> = ({
  accessCode,
  accessError,
  onChangeCode,
  onSubmit,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-black/40 border border-white/15 backdrop-blur-xs px-6 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 border text-black font-bold hover:bg-white/80 flex items-center justify-center transition"
        >
          X
        </button>

        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">
          ExclusiveVerse
        </h2>

        <p className="text-white/80 mb-6 text-sm">
          Enter the access code to unlock this room
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="flex flex-col text-sm text-white/80">
            <span className="mb-1">Access code</span>
            <input
              type="password"
              placeholder="Type secret access code"
              className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none"
              value={accessCode}
              onChange={(e) => onChangeCode(e.target.value)}
            />
          </label>

          <p
            className={`text-sm text-white bg-red-500/60 rounded-lg px-3 py-2 transition ${
              accessError ? "visible" : "invisible"
            }`}
          >
            {accessError ?? "placeholder"}
          </p>

          <button
            type="submit"
            className="w-full py-3 rounded-xl border border-white/40 bg-white/20 backdrop-blur-xs font-semibold text-sm text-white/90 hover:bg-white/25 transition"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};
