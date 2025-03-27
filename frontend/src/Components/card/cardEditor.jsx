import '../../styles/cardEditor.scss'
import {useEffect, useState} from "react";
import {savePhoto} from "../../utils/FButils/savePhotoContent.js";
import {createPost, updatePost} from "../../redux/reducers/postReducer.js";
import {useDispatch} from "react-redux";
import Modal from "../share/modal.jsx";
import {AiOutlineLoading3Quarters} from "react-icons/ai";

const CardEditor = (props) => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(props.post ? props.post.title : "");
    const [description, setDescription] = useState(props.post ? props.post.content : "");
    const [file, setFile] = useState(null);
    const [isChoosingPhoto, setIsChoosingPhoto] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const isTitleValid = title.length >= 5 && title.length <= 30;

    const isDescriptionValid = description.length >= 10 && description.length <= 200;

    useEffect(() => {
        const isFormValid = (props.post && isTitleValid && isDescriptionValid) ||
            (!props.post && isTitleValid && isDescriptionValid && file);

        setIsButtonDisabled(!isFormValid);
    }, [isTitleValid, isDescriptionValid, file]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let link;

            if (file) {
                link = await savePhoto(file, props.post && props.post.media);
            }

            if (props.post) {
                dispatch(updatePost({
                    id: props.post.id,
                    title: title,
                    content: description,
                    media: link || props.post.media
                }))
            } else {
                dispatch(createPost({
                    title: title,
                    content: description,
                    media: link
                }));
            }

            props.close();
        } catch (error) {
            console.error("Error uploading photo:", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="main-container">
            <div className="edit-card-container">
                <div className={isChoosingPhoto ? "blurred" : ""}>
                    {isLoading ?
                        <div className="loading">
                            Loading
                            <AiOutlineLoading3Quarters className="load"/>
                        </div> :
                        <>
                            <button className="close" onClick={props.close}>Close</button>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="title">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    style={{border: isTitleValid ? '1px solid green' : '1px solid red'}}
                                />
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    style={{border: isDescriptionValid ? '1px solid green' : '1px solid red'}}
                                />

                                <button type="button" className="open-modal"
                                        onClick={() => setIsChoosingPhoto(true)}>{file || props.id ? "Change photo" : "Open image Cropper"}</button>

                                <button type="submit" className="submit" disabled={isButtonDisabled}
                                        style={{borderRadius: "10%"}}>Submit
                                </button>
                            </form>
                        </>
                    }
                </div>
                {isChoosingPhoto && <Modal className="modal" circle={false} setPhoto={f => (setFile(f))} close={() => {
                    setIsChoosingPhoto(prev => !prev)
                }}/>}
            </div>
        </div>
    )
}

export default CardEditor;