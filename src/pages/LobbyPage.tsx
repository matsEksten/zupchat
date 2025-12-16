import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { getUserProfile } from "../services/userService";
import type { ZupUser } from "../types/user";
import { AccessModal } from "../components/AccessModal";

const EXCLUSIVE_ACCESS_CODE =
  import.meta.env.VITE_EXCLUSIVE_ACCESS_CODE ?? "kanot";

const BG = {
  hero: "/backgrounds/heroverse/bg-night.webp",
  space: "/backgrounds/spaceverse/spaceverse-bg-3.webp",
  exclusive: "/backgrounds/exclusiveverse/exclusive-bg-night.webp",
};

const LOGOS = {
  hero: "/images/heroverse-logo.png",
  space: "/images/spaceverse-logo.png",
  exclusive: "/images/exclusiveverse-logo.png",
};

export default function LobbyPage() {
  const [profile, setProfile] = useState<ZupUser | null>(null);
  const [showExclusiveModal, setShowExclusiveModal] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState<string | null>(null);

  const { user } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const data = await getUserProfile(user.uid);

      if (!data) {
        navigate("/profile", { replace: true });
        return;
      }

      setProfile(data);
    };

    loadProfile();
  }, [user, navigate]);

  if (!profile) {
    return null;
  }

  const handleAccessSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = accessCode.trim();

    if (!trimmed) {
      setAccessError("Please enter the access code.");
      return;
    }

    if (trimmed === EXCLUSIVE_ACCESS_CODE) {
      setShowExclusiveModal(false);
      setAccessCode("");
      setAccessError(null);
      navigate("/rooms/exclusiveverse", {
        state: { exclusiveAccess: true },
      });
    } else {
      setAccessError("Wrong code. Try again.");
    }
  };

  const handleCloseModal = () => {
    setShowExclusiveModal(false);
    setAccessCode("");
    setAccessError(null);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
      {profile && (
        <>
          <h1 className="text-2xl font-bold">
            Welcome to the Lobby {profile.displayName}
          </h1>
          <div className="mt-6 flex w-full max-w-3xl flex-col gap-5 px-4">
            <Link
              to="/rooms/heroverse"
              className="relative block w-full h-28 overflow-hidden border border-white/15 verse-hover"
            >
              <img
                src={BG.hero}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-85 hover:opacity-100 transition"
              />
              <div className="absolute inset-0 bg-black/50 pointer-events-none" />
              <img
                src={LOGOS.hero}
                alt="HeroVerse"
                className="absolute left-1/2 top-1/2 w-36 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              />
            </Link>
            <Link
              to="/rooms/spaceverse"
              className="relative block w-full h-28 overflow-hidden border border-white/15 verse-hover"
            >
              <img
                src={BG.space}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-85 hover:opacity-100 transition"
              />
              <div className="absolute inset-0 bg-black/50 pointer-events-none" />
              <img
                src={LOGOS.space}
                alt="HeroVerse"
                className="absolute left-1/2 top-1/2 w-25 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              />
            </Link>

            <button
              type="button"
              onClick={() => setShowExclusiveModal(true)}
              className="relative block w-full h-28 overflow-hidden border border-white/15 verse-hover"
            >
              <img
                src={BG.exclusive}
                alt="Exclusiveverse background"
                className="absolute inset-0 h-full w-full object-cover opacity-85 hover:opacity-100 transition"
              />

              <div className="absolute inset-0 bg-black/50 pointer-events-none" />

              <img
                src={LOGOS.exclusive}
                alt="ExclusiveVerse"
                className="absolute left-1/2 top-1/2 w-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              />
            </button>
          </div>
        </>
      )}

      {showExclusiveModal && (
        <AccessModal
          accessCode={accessCode}
          accessError={accessError}
          onChangeCode={(value: string) => {
            setAccessCode(value);
            if (accessError) setAccessError(null);
          }}
          onSubmit={handleAccessSubmit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
