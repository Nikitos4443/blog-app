import '../../styles/confirmation.scss';

const Confirmation = ({ onClose, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 style={{color: "black"}}>Are you sure?</h2>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="yes-button">Yes</button>
                    <button onClick={onClose} className="no-button">No</button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
