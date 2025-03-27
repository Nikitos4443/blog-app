import {saving, deleteFile} from "./savePhotoContent.js";

export const saveAvatar = async (newAvatar, oldAvatar) => {
    console.log(newAvatar, oldAvatar);
   if(newAvatar !== 'default' && oldAvatar !== 'default') {
        await deleteFile(oldAvatar);
        return await saving(newAvatar, 'avatars');
    } else if(newAvatar === 'default' && oldAvatar !== 'default') {
       await deleteFile(oldAvatar);
       return 'default';
   } else if (newAvatar !== 'default' && oldAvatar === 'default') {
       return await saving(newAvatar, 'avatars');
   }
}

