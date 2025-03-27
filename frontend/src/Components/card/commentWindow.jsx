import '../../styles/comments.scss'
import Comment from './comment.jsx'
import { AiOutlineArrowRight } from "react-icons/ai";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {addNewComment, fetchComments, updateCommentText} from "../../redux/reducers/commentReducer.js";
import useAuth from "../../hooks/useAuth.js";

const CommentWindow = (props) => {

    const dispatch = useDispatch();
    const comments = useSelector(state => state.comments.comments)
    const {status, error} = useSelector(state => state.comments)
    const [input, setInput] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const {userData, status: statusUser} = useAuth();
    const [commId, setCommId] = useState("");

    useEffect(() => {
        dispatch(fetchComments());
    }, [dispatch]);

    const handleCreateComment = () => {
        setInput("");

        dispatch(addNewComment({text: input, postId: props.postId}));
    }

    const handleUpdateComment = (oldText, id) => {
        setIsUpdating(true);
        setInput(oldText);
        setCommId(id)
    }

    const handleButtonUpdate = () => {
        setIsUpdating(false);
        dispatch(updateCommentText({newText: input, id: commId}));
        setInput("");
    }

    return (

        <div className="comments-window-container">
            {status === 'resolved' && comments.length > 0 ?
                comments
                    .filter(comment => comment.postId === props.postId)
                    .map(comment => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            postId={props.postId}
                            user={userData}
                            postAuthor={props.postAuthor}
                            handleUpdateComment={handleUpdateComment}
                        />
                    ))
                : "No comments"
            }

            <div className="form">
                {isUpdating ? "Update Comment...": "New Comment..."}
                <textarea value={input} onChange={event => {setInput(event.target.value)}}></textarea>
                {statusUser === 'resolved' && input.length > 0? <AiOutlineArrowRight className="arrow-right" onClick={isUpdating? handleButtonUpdate: handleCreateComment}/>: null}
            </div>
        </div>
    )
}

export default CommentWindow;
