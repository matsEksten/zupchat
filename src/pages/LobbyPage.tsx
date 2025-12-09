import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { getUserProfile } from "../services/userService";
import type { ZupUser } from "../types/user";
import { useNavigate } from "react-router-dom";

export default function LobbyPage() {
  const [profile, setProfile] = useState<ZupUser | null>(null);

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

  return (
    <div className="flex flex-col items-center mt-32">
      {profile && (
        <>
          <h1 className="text-2xl font-bold">
            Welcome to the Lobby {profile.displayName}
          </h1>
          <Link
            to="/rooms/heroverse"
            className="bg-cyan-200 text-black py-2 px-6 rounded-xl mt-3"
          >
            Heroverse
          </Link>
        </>
      )}
    </div>
  );
}
