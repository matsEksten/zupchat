import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { getUserProfile } from "../services/userService";
import type { ZupUser } from "../types/user";

export default function LobbyPage() {
  const [profile, setProfile] = useState<ZupUser | null>(null);

  const { user } = useAuthContext();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const data = await getUserProfile(user.uid);
      setProfile(data);
    };
    loadProfile();
  }, [user]);

  return (
    <div className="flex flex-col items-center mt-32">
      {profile && (
        <>
          <h1 className="text-2xl font-bold">
            Welcome to the Lobby {profile.displayName}
          </h1>
          <button className="bg-cyan-200 text-black py-2 px-6 rounded-xl mt-3">
            Heroverse
          </button>
        </>
      )}
    </div>
  );
}
