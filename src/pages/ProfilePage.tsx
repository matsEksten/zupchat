import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { upsertUserProfile, getUserProfile } from "../services/userService";
import { useAuthContext } from "../hooks/useAuthContext";
import { Spinner } from "../components/Spinner";

type ProfileMode = "loading" | "error" | "onboarding" | "update";

export const ProfilePage = () => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<ProfileMode>("loading");

  const { user } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        setMode("loading");
        const profile = await getUserProfile(user.uid);

        if (!profile) {
          setMode("onboarding");
          return;
        }

        setNickname(profile.displayName);
        setMode("update");
      } catch (err) {
        console.error("Loading error:", err);
        setMode("error");
        setError("Could not load profile.");
      }
    };

    loadProfile();
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      console.log("User must be logged in to view this page");
      return;
    }

    if (!nickname.trim()) {
      setError("Nickname is required");
      return;
    }

    try {
      setIsSaving(true);

      await upsertUserProfile(user.uid, {
        displayName: nickname.trim(),
        email: user.email ?? undefined,
        onBoarded: true,
      });
      navigate("/lobby");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {mode === "loading" && (
        <div>
          <Spinner />
        </div>
      )}
      <h1 className="text-2xl flex flex-col items-center">
        {mode === "onboarding" && "Set Profile"}
        {mode === "update" && "Update Profile"}
      </h1>
      {mode === "error" && <p className="text-red-500">{error}</p>}

      {user && <p>Logged in as {user.email}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label className="flex flex-col items-center gap-3 my-5">
          <span>
            {mode === "onboarding" && "Choose a nickname"}
            {mode === "update" && "Update Nickname"}
          </span>
          <input
            type="text"
            placeholder="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="bg-white text-black"
          />
        </label>

        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSaving}
          className="mt-2 border rounded px-3 py-1 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save & continue"}
        </button>
      </form>
      {mode === "update" && (
        <button className="mt-2 border rounded px-3 py-1 disabled:opacity-60">
          Delete account
        </button>
      )}
    </div>
  );
};
