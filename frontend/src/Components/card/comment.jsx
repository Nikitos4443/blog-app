import '../../styles/comments.scss'
import avatar from "../../assets/avatar.png";
import {BsFillTrashFill} from "react-icons/bs";
import {removeComment} from "../../redux/reducers/commentReducer.js";
import {useDispatch, useSelector} from "react-redux";
import {AiFillEdit} from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {getUsers} from "../../redux/reducers/userReducer.js";

const Comment = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {users} = useSelector((state) => state.user);

    const handleAvatarClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const handleDeleteComment = (id) => {
        dispatch(removeComment({id}));
    }

    useEffect(() => {
        dispatch(getUsers({id: props.comment.authorId}))
    }, [])

    return (
        <>
            {users.length > 0 ?
                <div className="comment" key={props.comment.id}>
                    <img
                        src={users.find(u => u.id === props.comment.authorId)?.avatar === 'default' ? avatar : users.find(u => u.id === props.comment.authorId)?.avatar}
                        alt="avatar"
                        onClick={() => handleAvatarClick(props.comment.authorId)}
                        style={{cursor: 'pointer'}}
                    />
                    <span>{props.comment.text}</span>
                    {props.comment.authorId === props.user.id || props.user.id === props.postAuthor ?
                        <BsFillTrashFill className="trash" onClick={() => {
                            handleDeleteComment(props.comment.id)
                        }}/> : null}
                    {props.comment.authorId === props.user.id && <AiFillEdit className="edit-button"
                                                                             onClick={() => props.handleUpdateComment(props.comment.text, props.comment.id)}/>}
                </div>
                : null
            }
        </>
    )
}

export default Comment;