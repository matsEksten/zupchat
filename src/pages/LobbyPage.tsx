import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { getUserProfile } from "../services/userService";
import type { ZupUser } from "../types/user";
import { AccessModal } from "../components/AccessModal";

const EXCLUSIVE_ACCESS_CODE =
  import.meta.env.VITE_EXCLUSIVE_ACCESS_CODE ?? "kanot";

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
    <div className="flex flex-col items-center mt-32">
      {profile && (
        <>
          <h1 className="text-2xl font-bold">
            Welcome to the Lobby {profile.displayName}
          </h1>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/rooms/heroverse"
              className="bg-cyan-200 text-black py-2 px-6 rounded-xl"
            >
              HeroVerse
            </Link>
            <Link
              to="/rooms/spaceverse"
              className="bg-cyan-200 text-black py-2 px-6 rounded-xl"
            >
              SpaceVerse
            </Link>
            <button
              type="button"
              onClick={() => setShowExclusiveModal(true)}
              className="bg-cyan-200 text-black py-2 px-6 rounded-xl"
            >
              ExclusiveVerse
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
