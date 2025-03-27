import {getDownloadURL, ref, uploadBytes, getStorage, deleteObject} from "firebase/storage";
import app from '../../../config/firebaseConfig.js'
const storage = getStorage(app);

export const savePhoto = async (photo, oldphoto = null) => {
    if(oldphoto) {
        await deleteFile(oldphoto);
    }

    return await saving(photo, 'postPhotos');
}

export const deleteFile = async (fileUrl) => {
    if (!fileUrl) {
        console.log("No file URL provided!");
        return;
    }

    try {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
        console.log("File deleted successfully!");
    } catch (error) {
        console.error("Error deleting file:", error);
    }
};

export const saving = async (file, path) => {
    const storageRef = ref(storage, `${path}/${file.name}-${Date.now()}`);

    try {
        await uploadBytes(storageRef, file.blob);
        console.log("File uploaded successfully!");

        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}

