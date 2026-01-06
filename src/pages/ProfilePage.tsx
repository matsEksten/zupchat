import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useState, type FormEvent, type ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  upsertUserProfile,
  getUserProfile,
  validateNickname,
  isNicknameTaken,
} from "../services/userService";
import { useAuthContext } from "../hooks/useAuthContext";
import { Spinner } from "../components/Spinner";
import {
  uploadProfilePhoto,
  deleteImageByUrl,
} from "../services/photoUploadService";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { updateProfile } from "firebase/auth";

type ProfileMode = "loading" | "error" | "onboarding" | "update";

export const ProfilePage = () => {
  const [nickname, setNickname] = useState("");
  const [originalNicknameLower, setOriginalNicknameLower] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<ProfileMode>("loading");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { user } = useAuthContext();

  const { deleteAccount, isDeleting, error: deleteError } = useDeleteAccount();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        setMode("loading");
        const profile = await getUserProfile(user.uid);

        if (!profile) {
          setMode("onboarding");
          setOriginalNicknameLower(null);
          return;
        }

        setNickname(profile.displayName);
        setOriginalNicknameLower(profile.displayName.trim().toLowerCase());
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

    if (!user) return;

    const trimmedNickname = nickname.trim();

    const validationMsg = validateNickname(trimmedNickname);
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    const previousPhotoUrl = photoUrl;

    try {
      setIsSaving(true);

      let uploadedUrl: string | null = photoUrl ?? null;

      if (photoFile) {
        uploadedUrl = await uploadProfilePhoto(user.uid, photoFile);
      }

      const newKey = trimmedNickname.toLowerCase();
      const unchanged = mode === "update" && newKey === originalNicknameLower;

      if (!unchanged) {
        const taken = await isNicknameTaken(trimmedNickname);
        if (taken) {
          setError("Nickname is already taken.");
          return;
        }

        await setDoc(doc(db, "usernames", newKey), {
          uid: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      await upsertUserProfile(user.uid, {
        displayName: trimmedNickname,
        email: user.email ?? "",
        onBoarded: true,
        ...(uploadedUrl !== null ? { photoURL: uploadedUrl } : {}),
      });

      const updateData: { displayName: string; photoURL?: string | null } = {
        displayName: trimmedNickname,
      };

      if (uploadedUrl !== null) {
        updateData.photoURL = uploadedUrl;
      }

      await updateProfile(user, updateData);

      setPhotoUrl(uploadedUrl);

      if (photoFile && previousPhotoUrl && previousPhotoUrl !== uploadedUrl) {
        await deleteImageByUrl(previousPhotoUrl);
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

  const handleDeleteClick = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    const success = await deleteAccount();

    if (success) {
      navigate("/");
    }
  };

  const removePhoto = async () => {
    if (photoPreview && !photoUrl) {
      setPhotoPreview(null);
      setPhotoFile(null);
      return;
    }

    if (photoUrl && user) {
      try {
        await deleteImageByUrl(photoUrl);

        await upsertUserProfile(user.uid, {
          photoURL: null,
        });

        await updateProfile(user, {
          photoURL: null,
        });

        setPhotoUrl(null);
        setPhotoPreview(null);
        setPhotoFile(null);
      } catch (err) {
        console.error("Failed to delete profile photo:", err);
      }
    }
  };

  return (
    <div className="h-dvh overflow-y-auto flex flex-col items-center justify-start text-center px-4 pt-20 pb-4">
      <div className="w-full max-w-md rounded-2xl bg-white/5 border border-white/15 backdrop-blur-xs px-6 py-8 shadow-xl">
        <p className="mb-4 h-8 w-full max-w-md">
          {(error || thumbnailError || deleteError) && (
            <span className="inline-block w-full rounded-xl bg-red-500/70 text-white px-4 py-2 text-sm">
              {error || thumbnailError || deleteError}
            </span>
          )}
        </p>
        {mode === "loading" && (
          <div>
            <Spinner />
          </div>
        )}
        <h1 className="text-3xl font-semibold mb-2">
          {mode === "onboarding" && "Set Profile"}
          {mode === "update" && "Update Profile"}
        </h1>
        <p className="text-white/80 mb-6 text-sm">
          {mode === "onboarding"
            ? "Choose a nickname and optionally upload a photo"
            : "Update your nickname and/or profile photo"}
        </p>

        <div className="mt-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-white/15 flex items-center justify-center">
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
          {photoUrl && (
            <button
              onClick={removePhoto}
              className="mt-2 text-white text-sm underline cursor-pointer"
            >
              Remove profile photo
            </button>
          )}
          <label className="flex flex-col items-center text-sm cursor-pointer">
            <span className="my-3 inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/15 transition">
              {mode === "onboarding"
                ? "Upload profile picture"
                : "Change profile picture"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
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
              className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-2 w-full max-w-xs py-3 rounded-xl border border-amber-300/60 bg-amber-400/30 font-semibold text-sm cursor-pointer hover:bg-amber-400/35 disabled:opacity-60 "
          >
            {isSaving
              ? "Saving..."
              : mode === "onboarding"
              ? "Save & continue"
              : "Save changes"}
          </button>
        </form>
        {mode === "update" && (
          <>
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className={`mt-4 w-full max-w-xs py-3 rounded-xl border font-semibold text-sm transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                confirmDelete
                  ? "border-red-500/40 bg-red-500/30 text-white hover:bg-red-500/40"
                  : "border-red-500/25 bg-red-500/10 text-white/85 hover:bg-red-500/15"
              }`}
            >
              {isDeleting
                ? "Deleting account..."
                : confirmDelete
                ? "Confirm delete account"
                : "Delete account"}{" "}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
