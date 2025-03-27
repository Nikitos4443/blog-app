import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AiFillSetting} from "react-icons/ai";
import {_logout} from "../../redux/reducers/authReducer.js";

const UserInfo = ({user, avatar, isOwner, isSettingsVisible, toggleSettings, startProfileEdit, setIsDeleting}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogOut = (dispatch, navigate) => {
        dispatch(_logout())
        navigate("/auth");
    };

    const handleDeleteAccount = () => {
        setIsDeleting(true);
    }

    return (
        <div className="profile-submain-container">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2vw'}}>
                <img className="avatar" src={user.avatar === 'default' ? avatar : user.avatar} alt="avatar"/>
                <div className="container-desc">
                    <span className="name">Hello, I am {user.name}</span>
                    <span className="description">{user.description}</span>
                </div>
            </div>
            {isOwner && (
                <div className="settings-container">
                    <AiFillSetting className="settings" onClick={toggleSettings}/>
                    <div className={`settings-span-container ${isSettingsVisible ? 'visible' : ''}`}>
                        <span onClick={startProfileEdit}>Edit profile</span>
                        <span onClick={() => handleLogOut(dispatch, navigate)}>Log out</span>
                        <span onClick={handleDeleteAccount}>Delete account</span>
                    </div>
                </div>
            )}
        </div>
    )
};

export default UserInfo;