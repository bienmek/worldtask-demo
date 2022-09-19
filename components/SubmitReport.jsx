import React, {useState} from 'react';
import styles from "../styles/submitreport.module.scss"
import AddImage from "./AddImage";
import {useForm} from "react-hook-form";

const SubmitReport = ({missionId}) => {
    const [imageCount, setImageCount] = useState(1);
    const [images, setImages] = useState([]);
    const componentList = []

    for (let i = 0; i < imageCount; i++) {
        componentList.push(
            <AddImage
                key={i}
                height={140}
                width={160}
                callback={(state, link) => {
                    if (state) {
                        setImageCount(imageCount + 1)
                        images.push(link)
                    }
                }}
            />
    )
    }

    const {register, handleSubmit, formState: {errors}} = useForm()

    const onSubmit = async (data) => {
        const description = data.description

        const result = await fetch('/api/submitReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                missionId,
                description,
                images
            })
        }).then((res) => res.json())

        if (result.status === "ok") {
            window.location.href = "/profile"
        } else {
            console.log("error")
        }
    }

    return (
        <div className={styles.main}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className={styles.element}>
                    <label htmlFor={"text"} className={styles.label}>Select images</label>
                    {imageCount < 2 ? (
                        <div className={styles.addArea} style={{overflow: "hidden"}}>
                            {componentList}
                        </div>
                    ) : (
                        <div className={styles.addArea}>
                            {componentList.reverse()}
                        </div>
                    )}
                </div>

                <div className={styles.element}>
                    <label htmlFor="text" className={styles.label}>Description</label>
                    <textarea
                        cols="40"
                        rows="10"
                        placeholder={"Enter a description"}
                        className={styles.description}
                        {...register("description")}
                    ></textarea>
                </div>

                <div className={styles.element}>
                    <button className={styles.button}>Submit</button>
                </div>

            </form>
        </div>
    );
};

export default SubmitReport;
