import { storage } from "../firebase/config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const uploadProfilePhoto = async (
  uid: string,
  file: File
): Promise<string> => {
  const safeName = file.name.replaceAll(" ", "-");

  const storageRef = ref(
    storage,
    `thumbnails/${uid}/${Date.now()}-${safeName}`
  );

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  return url;
};

export const uploadChatImage = async (
  roomId: string,
  userId: string,
  file: File
): Promise<string> => {
  const safeName = file.name.replaceAll(" ", "-");

  const storageRef = ref(
    storage,
    `chat-images/${roomId}/${userId}/${Date.now()}-${safeName}`
  );

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const deleteImageByUrl = async (url?: string | null) => {
  if (!url) return;

  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (err) {
    console.error("Failed to delete image from storage:", err);
  }
};
