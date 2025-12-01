import { storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadProfilePhoto = async (
  uid: string,
  file: File
): Promise<string> => {
  const storageRef = ref(
    storage,
    `thumbnails/${uid}/${Date.now()}-${file.name}`
  );

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  return url;
};
