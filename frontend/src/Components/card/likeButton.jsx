import React, {useEffect, useState} from "react";
import {FaRegHeart} from "react-icons/fa";
import {FaHeart} from "react-icons/fa";
import '../../styles/likeButton.scss'
import {useSelector, useDispatch} from 'react-redux'
import {fetchLikes, postLike, deleteLike, likeToggle} from "../../redux/reducers/likeReducer.js";

const LikeButton = (props) => {
    const dispatch = useDispatch()
    const [hearts, setHearts] = useState([]);
    const likes = useSelector(state => state.likes.likes)
    const {status, error} = useSelector(state => state.likes)
    const [isPressed, setIsPressed] = useState(false);
    const [textAfterToggle, setTextAfterToggle] = useState('');

    useEffect(() => {
        dispatch(fetchLikes());
    }, [dispatch]);

    useEffect(() => {
        if (status === 'resolved') {
            if(likes[props.postId]){
                setIsPressed(likes[props.postId].includes(props.userId));
            }else{
                setIsPressed(false);
            }
        } else if (status === 'rejected') {
            setIsPressed(false);
        }
    }, [status]);

    const handleLike = (e) => {

        setIsPressed(!isPressed);

        dispatch(likeToggle({isAdd: !isPressed, postId: props.postId}))

        sendData();

        const newHeart = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
        };
        setHearts((prev) => [...prev, newHeart]);

        setTimeout(() => {
            setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id));
        }, 1500);
    };
    const sendData = async () => {
        if (!isPressed) {
            dispatch(postLike({postId: props.postId, authorId: props.userId}));
        } else {
            dispatch(deleteLike({postId: props.postId, authorId: props.userId}));
        }
    }

    const handleNoAuth = () => {
        const text = 'You are not authorized'

        setTextAfterToggle(text);
        setTimeout(() => {
            setTextAfterToggle('');
        }, 3000)
    }

    const handleAuthorLiked = () => {
        const text = 'You can not like your own post'

        setTextAfterToggle(text);
        setTimeout(() => {
            setTextAfterToggle('');
        }, 3000)
    }

    return (
        <div className="likes">
            {textAfterToggle && <span>{textAfterToggle}</span>}
            {
                !isPressed ?
                    <FaRegHeart className="heart-icon"
                                onClick={props.userId ? props.userId === props.authorPost ? handleAuthorLiked : handleLike : handleNoAuth}/> :
                    < FaHeart className="heart-icon"
                              onClick={props.userId ? props.userId === props.authorPost ? handleAuthorLiked : handleLike : handleNoAuth}/>
            }

            <span className="like-number">
                {status === 'loading' || status === 'rejected' || status === null ? '0' : likes[props.postId] ? likes[props.postId].length : 0}
            </span>


            {isPressed ? hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="small-heart"
                    style={{transform: `translate(${heart.x}px, ${heart.y}px)`}}
                >
                    ❤️
                </div>
            )) : null
            }
        </div>
    );
};

export default LikeButton;
