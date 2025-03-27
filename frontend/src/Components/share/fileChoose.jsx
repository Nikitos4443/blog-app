import '../../styles/fileInput.scss';

const FileInput = (props) => {

    return (
        <div className="custom-file">

            <input
                type="file"
                id="file"
                className="file-input"
                onChange={props.onSelectFile}
            />
            <label htmlFor="file" className="file-label">
                Choose a photo
            </label>
            <span className="file-name">{props.fileName ? props.fileName : "No file chosen"}</span>
        </div>
    );
};

export default FileInput;
