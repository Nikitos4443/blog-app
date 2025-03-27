import '../../styles/modal.scss'
import CropImage from "./cropImage.jsx";

const Modal = (props) => {

    return (
        <div className="overlay">
            <div className="modal-container">
                <button onClick={props.close} style={{width: "10%"}}>Close</button>
                <div className="crop-container">
                    <CropImage circle={props.circle} close={props.close} setPhoto={props.setPhoto} />
                </div>
            </div>
        </div>
    )
}

export default Modal