import React, {useState} from 'react';
import styles from '../styles/createmission.module.scss'
import AddImage from "../components/AddImage";
import {useForm} from "react-hook-form";

export default function createMission () {
    const [imageCount, setImageCount] = useState(1);
    const [images, setImages] = useState([]);
    const [buttonMessage, setButtonMessage] = useState('Create mission');
    const [count, setCount] = useState(0);
    const componentList = []

    for (let i = 0; i < imageCount; i++) {
        componentList.push(
            <AddImage
                key={i}
                height={175}
                width={200}
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
        const title = data.title
        const location = data.location
        const description = data.description
        const difficulty = data.difficulty
        const sender = localStorage.getItem('token')

        setButtonMessage("Sending...")
        const result = await fetch('/api/createMission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                location,
                description,
                difficulty,
                images,
                sender
            })
        }).then((res) => res.json())

        if (result.status === "ok") {
            window.location.href = "/"
        } else {
            console.log("error")
        }
        setButtonMessage("Create mission")
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <h1 className={styles.title}>Create Mission</h1>
            <div className={styles.center}>
                <div className={styles.centerLeft}>

                    <div className={styles.element}>
                        <label htmlFor="text">Title</label>
                        <input type="text" placeholder={"Enter a title"} className={styles.input} {...register("title")}/>
                    </div>

                    <div className={styles.element}>
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
                        <label htmlFor="text">Location</label>
                        <input type="text" placeholder={"Enter location"} className={styles.input} {...register("location")}/>
                    </div>
                </div>

                <div className={styles.centerRight}>
                    <div className={styles.element}>
                        <label htmlFor="text">Description</label>
                        <textarea
                            cols="40"
                            rows="10"
                            placeholder={"Enter a description"}
                            className={styles.description}
                            {...register("description")}
                            onChange={(e) => setCount(e.target.value.length)}
                        ></textarea>
                        {count <= 600 ? (
                            <div style={{fontSize: "10px", color: "#24985a"}}>{count}/600</div>
                        ) : (
                            <div style={{fontSize: "10px", color: "red"}}>{count}/600</div>

                        )}
                    </div>

                    <div className={styles.element}>
                        <label htmlFor="text">Difficulty</label>
                        <input type="number" placeholder={"Enter a difficulty"} className={styles.input} {...register("difficulty")}/>
                    </div>
                </div>
            </div>
                <button className={styles.button}>{buttonMessage}</button>
        </form>
    );
}

