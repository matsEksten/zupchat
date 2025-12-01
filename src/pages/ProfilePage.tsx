import { useState, type FormEvent, type ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { upsertUserProfile, getUserProfile } from "../services/userService";
import { useAuthContext } from "../hooks/useAuthContext";
import { Spinner } from "../components/Spinner";
import { uploadProfilePhoto } from "../services/photoUploadService";

type ProfileMode = "loading" | "error" | "onboarding" | "update";

export const ProfilePage = () => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<ProfileMode>("loading");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);

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
        setPhotoUrl(profile.photoURL ?? null);
        setPhotoPreview(null);
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

      if (photoFile) {
        const uploadedUrl = await uploadProfilePhoto(user.uid, photoFile);

        setPhotoUrl(uploadedUrl);

        await upsertUserProfile(user.uid, {
          displayName: nickname.trim(),
          email: user.email ?? "",
          onBoarded: true,
          photoURL: uploadedUrl,
        });
      } else {
        await upsertUserProfile(user.uid, {
          displayName: nickname.trim(),
          email: user.email ?? "",
          onBoarded: true,
        });
      }

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

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setThumbnailError(null);
    setPhotoFile(null);
    setPhotoPreview(null);

    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setThumbnailError("Please select a file");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setThumbnailError("Image file size must be less than 5 MB");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const currentImage = photoPreview ?? photoUrl;

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

      <div className="mt-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
          {currentImage ? (
            <img
              src={currentImage}
              alt="Profile photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/images/avatar.png"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <label className="flex flex-col items-center text-sm cursor-pointer">
          <span className="my-2 bg-blue-500 py-2 px-4 rounded-lg">
            {mode === "onboarding"
              ? "Upload profile picture"
              : "Change profile picture"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="text-xs bg-white text-black"
          />
        </label>
        {thumbnailError && (
          <p className="text-red-500 text-xs">{thumbnailError}</p>
        )}
      </div>

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
