import React, {useEffect, useState} from 'react';
import styles from '../styles/selectmissioncard.module.scss'
import {MdLocationPin} from "react-icons/md";
import {IoIosArrowForward} from "react-icons/io";
import Image from "next/image";
import SubmitReport from "./SubmitReport";

const SelectedMissionCard = ({id, title, location, description, images, creator, timeout, display}) => {
    const [cardHeight, setCardHeight] = useState({height: "220px"});
    const [descHeight, setDescHeight] = useState({height: "115px"});
    const [arrowRotation, setArrowRotation] = useState({transform: "rotate(90deg)"});
    const [cardOpen, setCardOpen] = useState(false);
    const [imageSize, setImageSize] = useState(50);
    const [imageStyle, setImageStyle] = useState({flexDirection: "row"});

    useEffect(() => {
        if (cardOpen) {
            setCardHeight({height: "550px"})
            setDescHeight({height: "445px"})
            setArrowRotation({transform: "rotate(-90deg)"})
        } else {
            setCardHeight({height: "220px"})
            setDescHeight({height: "115px"})
            setArrowRotation({transform: "rotate(90deg)"})
        }
    }, [cardOpen]);


    const cutWord = (word) => {
        if (word.length >= 12) {
            return `${word.substring(0, 9)}...`
        }
        return word
    }

    const cancelMission = async () => {
        await fetch(`/api/cancelMission?missionId=${id}&token=${localStorage.getItem('token')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    }

    useEffect(() => {
        if (timeout.split(' ')[0] <= 1 && timeout.split(' ')[1] === 's') {
            cancelMission()
        }
    }, [timeout, ]);


    return (
        <>
            <div className={styles.card} style={cardHeight}>
                <div className={styles.header}>
                    <div className={styles.leftSide}>
                        <h1 className={styles.title} title={title}>{cutWord(title)}</h1>
                        <span className={styles.username} title={creator}>by @{cutWord(creator)}</span>
                    </div>
                    <div className={styles.rightSide}>
                        <span className={styles.pin}><MdLocationPin size={20}/></span>
                        <span className={styles.location}>{location}</span>
                    </div>
                </div>
                <div className={styles.center}>
                    <div className={styles.centerLeft}>
                        <div className={styles.description} style={descHeight}>
                            <div className={styles.textarea}>
                                {description}
                            </div>
                            <div className={styles.medias} style={imageStyle}>
                                {images.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        height={imageSize}
                                        width={imageSize}
                                        className={styles.image}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <button
                                className={styles.subReport}
                                onClick={() => {
                                    if (timeout !== 'Report submited !' && timeout !== "Loading...") {
                                        display(true)
                                    } else if (timeout === 'Report submited !') {
                                        console.log('Report submited !')
                                    }
                                }}
                            >
                                {(timeout !== 'Report submited !' && timeout !== "Loading...") ? (<span>Submit report ({timeout} left)</span>) : (<span>{timeout}</span>)}
                            </button>
                            <button
                                className={styles.cancelMission}
                                onClick={() => {
                                    cancelMission().then(() => window.location.href = "/profile")
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div
                        className={styles.centerRight}
                        onClick={() => {
                            setCardOpen(!cardOpen)
                            if (!cardOpen) {
                                setImageSize(183)
                                setImageStyle({flexDirection: "column"})
                            }
                            if (cardOpen) {
                                setImageSize(50)
                                setImageStyle({flexDirection: "row"})
                            }
                        }}
                    >
                        <div>
                            <IoIosArrowForward size={50} className={styles.arrow} style={arrowRotation}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SelectedMissionCard;