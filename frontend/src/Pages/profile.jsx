import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, getUser} from "../redux/reducers/userReducer.js";
import {fetchPosts} from "../redux/reducers/postReducer.js";
import ProfileEdit from "../Components/profile/profileEdit.jsx";
import avatar from "../assets/avatar.png";
import Card from "../Components/share/card.jsx";
import CardEditor from "../Components/card/cardEditor.jsx";
import '../styles/profile.scss';
import Confirmation from "../Components/share/confirmation.jsx";
import {_logout} from "../redux/reducers/authReducer.js";
import useAuth from "../hooks/useAuth.js";
import UserInfo from "../Components/profile/UserInfo.jsx";

const handleLogOut = (dispatch, navigate) => {
    dispatch(_logout())
    navigate("/auth");
};

const Profile = () => {
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const { userId } = useParams();

    let isOwner = !userId;

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [updatedPost, setUpdatedPost] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {userData: user, status: statusUser} = useAuth();
    const viewedUser = useSelector(state => state.user.user);
    const posts = useSelector(state => state.posts.posts);
    const {statusPosts} = useSelector(state => state.posts);

    const toggleSettings = () => setIsSettingsVisible(prev => !prev);

    const handleProfileEditClose = () => setIsEditingProfile(false);

    const handleCardEditorClose = () => {
        setIsEditingCard(false);
        setUpdatedPost(null);
    };

    useEffect(() => {
        if (isOwner) {
            if (statusUser === 'resolved') {
                dispatch(fetchPosts({id: user.id}));
            } else if (statusUser === 'rejected') {
                navigate('/auth');
            }
        } else {
            dispatch(getUser({id: userId}))
                .then((res) => {
                    if(res.type === "user/get/rejected") {
                        navigate('/error')
                    } else{
                        dispatch(fetchPosts({id: parseInt(userId)}))
                    }
                })
        }
    }, [statusUser, userId]);


    return (
        <div className="profile-main-container">
            {(isOwner ? statusUser === 'loading' : !viewedUser)
                ? "loading..."
                : (
                <div
                    className={isEditingProfile || isEditingCard || updatedPost || isDeleting ? "profile-blurred" : ""}>
                    <UserInfo
                        user={isOwner ? user : viewedUser}
                        avatar={avatar}
                        isOwner={isOwner}
                        isSettingsVisible={isSettingsVisible}
                        toggleSettings={toggleSettings}
                        startProfileEdit={() => setIsEditingProfile(true)}
                        setIsDeleting={setIsDeleting}
                    />
                    {isOwner && (
                        <div className="create-post-container">
                            <span onClick={() => setIsEditingCard(true)}>Create a new post</span>
                        </div>
                    )}
                    <div className="profile-card-container">
                        {statusPosts === 'loading' || posts.length === 0
                            ? "No posts available"
                            : <Card posts={posts} updatedPost={setUpdatedPost} isOwner={isOwner}/>}
                    </div>
                </div>
            )}

            {isEditingProfile && (
                <ProfileEdit
                    className="edit-profile"
                    onClose={handleProfileEditClose}
                    user={isOwner ? user : viewedUser}
                />
            )}

            {(isEditingCard || updatedPost) && (
                <CardEditor
                    close={handleCardEditorClose}
                    post={updatedPost}
                />
            )}

            {isDeleting &&
                <Confirmation
                    onConfirm={() => {
                        handleLogOut(dispatch, navigate);
                        dispatch(deleteUser({userId: user.id}))
                        window.location.reload();
                    }}
                    onClose={() => {
                        setIsDeleting(false);
                    }}
                />
            }
        </div>
    );
};

export default Profile;


