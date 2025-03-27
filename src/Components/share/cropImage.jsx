import {useRef, useState} from "react";
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop, {centerCrop, convertToPixelCrop, makeAspectCrop} from "react-image-crop";
import setCanvasPreview from '../../utils/setCanvasPreview.js'
import FileInput from "./fileChoose.jsx";


const CropImage = (props) => {
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState('');
    const [crop , setCrop] = useState(null);
    const [error, setError] = useState("");
    const [file, setFile] = useState("");
    const [isButtonChecked, setIsButtonChecked] = useState(false);

    const onSelectFile = (e) => {
        const file = e.target.files[0];
        setFile(file);

        if(!file) return;

        const reader = new FileReader();

        reader.addEventListener("load", () => {
            const imageUrl = reader.result?.toString() || "";
            setImgSrc(imageUrl);
        });

        reader.readAsDataURL(file);
    }

    const onImageLoad = (e) => {
        const {width, height} = e.currentTarget;

        const crop = makeAspectCrop(
            {
                unit: '%',
            }, 1,
            width,
            height
        );

        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    }

    return (
        <>
            <FileInput onSelectFile={onSelectFile} fileName={file.name}/>

            {imgSrc &&
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <ReactCrop
                        aspect={props.circle ? 1 : 932 / 482}
                        crop={crop}
                        circularCrop={props.circle}
                        onChange={
                            (px, per) => {setCrop(per); setIsButtonChecked(true) }
                        }
                    >
                        <img
                            ref={imgRef}
                            src={imgSrc}
                            alt="img"
                            onLoad={onImageLoad}
                            style={{maxHeight: "50vh", borderRadius: "none"}}
                        />
                    </ReactCrop>
                    <br />
                    {isButtonChecked &&
                        <button
                        onClick={() => {
                            setCanvasPreview(
                                imgRef.current,
                                canvasRef.current,
                                convertToPixelCrop(
                                    crop,
                                    imgRef.current.width,
                                    imgRef.current.height
                                )
                            );

                            canvasRef.current.toBlob((blob) => {
                                if (blob) {
                                    props.setPhoto({blob, name: file.name});

                                    props.close();
                                }
                            }, 'image/png');
                        }}

                    >{props.circle ? 'Set as avatar' : 'Set as post photo'}
                        </button>
                    }
                </div>
            }

            {crop &&
                <>
                    <canvas
                        ref={canvasRef}
                        style={{
                            display: "none",
                            border: '1px solid white',
                            objectFit: "contain",
                        }}
                    />
                </>
            }
        </>
    )
}

export default CropImage;