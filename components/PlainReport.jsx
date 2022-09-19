import React, {useState} from 'react';
import styles from "../styles/plainreport.module.scss"
import AddImage from "./AddImage";
import {useForm} from "react-hook-form";
import Image from "next/image";

const SubmitReport = ({chooser, description, images}) => {

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <div className={styles.title}>Report by {chooser}</div>

                <div className={styles.element}>
                    <label htmlFor={"text"}>Images</label>
                    <div className={styles.images}>
                        {images.map((image, index) => (
                            <div className={styles.image}>
                                <Image
                                    key={index}
                                    src={image}
                                    height={150}
                                    width={150}
                                    className={styles.imageElement}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.element}>
                    <label htmlFor="text" className={styles.label}>Description</label>
                    <div className={styles.description}>
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitReport;
