import {useState} from "react";
import "../../styles/profileEdit.scss";
import {useDispatch} from "react-redux";
import {updateUser} from "../../redux/reducers/userReducer.js";
import {saveAvatar} from '../../utils/FButils/saveAvatar.js';
import Modal from "../share/modal.jsx";
import {AiOutlineLoading3Quarters} from "react-icons/ai";

const ProfileEdit = ({user, onClose}) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState(null);
    const [description, setDescription] = useState(user.description);
    const [avatar, setAvatar] = useState(null);
    const [avatarSelected, setAvatarSelected] = useState(user.avatar !== 'default');
    const [isChoosingPhoto, setIsChoosingPhoto] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Name cannot be empty");
            return;
        }

        setIsLoading(true);
        try {
            let link;
            if (avatar) {
                if (avatar !== 'default') {
                    link = await saveAvatar(avatar, user.avatar);
                } else if (user.avatar !== 'default' && avatar === 'default') {
                    link = await saveAvatar(avatar, user.avatar);
                } else {
                    link = avatar;
                }
            } else {
                link = user.avatar;
            }

            dispatch(updateUser({
                user: {
                    id: user.id,
                    name,
                    description,
                    password: password || null,
                    avatar: link
                },
            }));

            onClose();
        } catch (error) {
            console.error("Error uploading photo:", error);
        } finally {
            setIsLoading(false);
            window.location.reload();
        }
    };

    return (
        <div className="edit-overlay">
            <div className={isLoading ? 'height edit-container' :'edit-container'}>
                <div className={isLoading ? 'center' : isChoosingPhoto ? "blurred" : ""}>
                    {isLoading ?
                        <div className="loading">
                            <span>Loading</span>
                            <AiOutlineLoading3Quarters className="load"/>
                        </div> :
                        <>
                            <button onClick={onClose}>Close</button>
                            <form className="profile-edit-form" onSubmit={handleSubmit}>
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value.slice(0, 25))}
                                    maxLength="25"
                                    required
                                />
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password || ''}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                                    maxLength="100"
                                />

                                <label htmlFor="avatar">Avatar</label>
                                <div className="avatar-set">
                                    <button type="button" className="open-modal"
                                            onClick={() => setIsChoosingPhoto(true)}>{avatar ? "Change photo" : "Open image Cropper"}</button>
                                    {avatarSelected && (
                                        <span
                                            className="set-no-avatar"
                                            onClick={() => {
                                                setAvatar('default');
                                                setAvatarSelected(false);
                                            }}
                                        >
                                Set no avatar
                            </span>
                                    )}
                                </div>

                                <button className="submit-button" type="submit">
                                    <span>Submit</span>
                                </button>
                            </form>
                        </>
                    }
                </div>
                {isChoosingPhoto && <Modal className="modal" circle={true} setPhoto={f => (setAvatar(f))} close={() => {
                    setIsChoosingPhoto(prev => !prev)
                }}/>}
            </div>
        </div>
    );
};

export default ProfileEdit;
