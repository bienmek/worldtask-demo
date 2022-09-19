import React, {useRef, useState} from 'react';
import styles from "../styles/addimages.module.scss";
import Image from "next/image";

const AddImage = ({height, width, callback}) => {
    const inputRef = useRef(null)
    const [change, setChange] = useState(false);
    const [image, setImage] = useState(String);

    const handleClick = () => {
        if (!change) {
            inputRef.current.click();
        }
    };

    const handleChange = (event) => {
        if (event.target.files) {
            let src = URL.createObjectURL(event.target.files[0])
            setImage(src)
            setChange(true)
            callback(true, src)
        } else {
            console.log("Fichier non valide")
        }
    }

    return (
        <div
            className={styles.addArea}
            onClick={() => {handleClick()}}
            style={{height: `${height.toString()}px`, width: `${width.toString()}px`}}
        >
            {change && (
                <Image src={image} className={styles.image} height={height} width={width}/>
            )}

            {!change && (
                <>
                    <span className={styles.plusVert}></span>
                    <span className={styles.plusHori}></span>
                </>
            )}
            <input
                accept={"image/*"}
                type="file"
                style={{display: "none"}}
                ref={inputRef}
                onChange={(event) => handleChange(event)}
            />
        </div>
    );
};

export default AddImage;
