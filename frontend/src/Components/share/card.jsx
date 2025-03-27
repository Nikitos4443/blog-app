import { useEffect } from "react";
import '../../styles/card.scss'
import Like from '../card/likeButton.jsx'
import CommentWindow from "../card/commentWindow.jsx";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import {deleteFile} from "../../utils/FButils/savePhotoContent.js";
import {useDispatch, useSelector} from "react-redux";
import {deletePost, fetchAllPosts} from "../../redux/reducers/postReducer.js";
import { useState } from "react";
import useAuth from "../../hooks/useAuth.js";

const Card = ({ posts: propPosts, updatedPost, isOwner}) => {
    const localPosts = useSelector(state => state.posts.posts);
    const dispatch = useDispatch();
    const [visibleCommentWindows, setVisibleCommentWindows] = useState({});
    const {userData, status: statusUser} = useAuth();
    const {status, error} = useSelector(state => state.posts)

    useEffect(() => {
        if (!propPosts) {
            const fetchData = async () => {
                try {
                    dispatch(fetchAllPosts());
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData();
        }
    }, []);

    const currentPosts = propPosts || localPosts;
    let sorted;
    if(status === 'resolved'){
        sorted = [...currentPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const toggleCommentWindow = (postId) => {
        setVisibleCommentWindows(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    }

    const handleDelete = async (post) => {
        try {
            await deleteFile(post.media);
            await dispatch(deletePost(post.id));
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    }

    return (
        <>
            {status === 'resolved' && sorted.length > 0 ? sorted.map(post => (
                <div key={post.id} className="main-card-container">
                    <img className="card-img" src={post.media ? post.media : null} alt="Post media"/>
                    <div className="title">{post.title}</div>
                    <span style={{fontSize: '1vw'}}>{post.content}</span>
                    {propPosts && isOwner &&
                        <div className="delete-update-container">
                            <BsFillTrashFill
                                style={{color: 'white', background: 'red', borderRadius: '2px', padding: '1px', cursor: 'pointer'}}
                                onClick={() => handleDelete(post)}
                            />
                            <AiFillEdit
                                style={{color: 'white', background: 'blue', borderRadius: '2px', padding: '1px', cursor: 'pointer'}}
                                onClick={() => updatedPost(post)}
                            />
                        </div>
                    }
                    <div className="footer-card">
                        <span
                            onClick={() => toggleCommentWindow(post.id)}
                            className="comments-title"
                        >
                            Comments...
                        </span>
                        { statusUser === 'resolved' || statusUser === 'rejected' ?
                        <div className="likes">
                            <Like userId={userData.id} postId={post.id} authorPost={post.authorId}/>
                        </div> : null
                        }
                    </div>
                    {visibleCommentWindows[post.id] &&
                        <CommentWindow
                            postId={post.id}
                            postAuthor={post.authorId}
                        />
                    }
                </div>
            )) :
                status === 'loading' ? <h1>Loading</h1> :
                status === 'error' ? <h1>Server error</h1> :
                <h1>No posts available</h1>}
        </>
    )
}

export default Card;