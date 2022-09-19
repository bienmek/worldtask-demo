import React, {useEffect, useState} from 'react';
import styles from '../styles/missioncard.module.scss'
import {MdLocationPin} from "react-icons/md";
import {IoIosArrowForward} from "react-icons/io";
import {BiDownvote, BiUpvote} from "react-icons/bi";
import {BsFlag} from "react-icons/bs";
import Image from "next/image";

const MissionCard = ({type, id, title, location, description, difficulty, images, creator, timestamp, chooser}) => {
    const [voteCount, setVoteCount] = useState(0);
    const [lockVote, setLockVote] = useState(false);
    const [upvoteColor, setUpvoteColor] = useState({color: "black"});
    const [downvoteColor, setDownvoteColor] = useState({color: "black"});
    const [cardHeight, setCardHeight] = useState({height: "220px"});
    const [descHeight, setDescHeight] = useState({height: "115px"});
    const [arrowRotation, setArrowRotation] = useState({transform: "rotate(90deg)"});
    const [cardOpen, setCardOpen] = useState(false);
    const [display, setDisplay] = useState(false);
    const [imageSize, setImageSize] = useState(50);
    const [imageStyle, setImageStyle] = useState({flexDirection: "row"});
    const [reload, setReload] = useState(0);

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

    const formatDate = (date) => {
        const hours = date.split('-')[0]
        const minutes = date.split('-')[1]
        const seconds = date.split('-')[2]

        if (Number(hours) === 0) {
            if (Number(minutes) === 0) {
                return `${Number(seconds)} s`
            } else {
                return `${Number(minutes)} min`
            }
        } else {
            return `${Number(hours)} h`
        }
    }

    const handleVote = async (vote) => {
        return await fetch(`/api/sendVote?missionId=${id}&voter=${localStorage.getItem('token')}&vote=${vote}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    }

    const getVoteInfo = async () => {
        return await fetch(`/api/voteInfo?missionId=${id}&token=${localStorage.getItem('token')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    }


    const verifyMission = async () => {
        await fetch(`/api/missionVoteInfo?missionId=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    }

    const chooseMission = async () => {
        await fetch(`/api/chooseMission?missionId=${id}&token=${localStorage.getItem('token')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    }

    useEffect(() => {
        getVoteInfo().then((res) => {
            setVoteCount(res.votescore)
            setLockVote(res.hasVote)

            if (lockVote) {
                setUpvoteColor({color: "grey"})
                setDownvoteColor({color: "grey"})
            }
        })
    }, [reload, ]);

    useEffect(() => {
        if (Number(timestamp.split('-')[1]) >= 1) {
            verifyMission()
        }
    }, [reload, ])


    return (
        <div className={styles.card} style={cardHeight}>
            <div className={styles.header}>
                <div className={styles.leftSide}>
                    <h1 className={styles.title}>{title}</h1>
                    <span className={styles.username}>@{creator} -</span>
                    <span className={styles.timestamp}>{formatDate(timestamp)}</span>
                    {type === "available" && (
                        <span>
                            {chooser.length > 1 ? (
                                <span style={{display: "flex", color: "lime", transform: "translate3d(10px, 4px, 0)", fontSize: "12px"}}>
                                    (Chosen by {chooser})
                                </span>
                            ) : (
                                <span style={{display: "flex", color: "red", transform: "translate3d(10px, 4px, 0)", fontSize: "12px"}}>
                                    (Haven't been choose)
                                </span>
                            )}
                        </span>

                    )}
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

                    {type === "newMission" && (
                        <div className={styles.footer}>
                            <div className={styles.votes}>
                            <span
                                onClick={() => {
                                    if (!lockVote) {
                                        setLockVote(true)
                                        setUpvoteColor({color: "#24985a", top: "-1px"})
                                        setDownvoteColor({color: "black", bottom: "-1px"})
                                        handleVote("up").then(() => setReload(reload + 1))
                                    }
                                }}
                            >
                                <BiUpvote size={20} className={styles.upvote} style={upvoteColor}/>
                            </span>

                                <span
                                    onClick={() => {
                                        if (!lockVote) {
                                            setLockVote(true)
                                            setUpvoteColor({color: "black", top: "-1px"})
                                            setDownvoteColor({color: "red", bottom: "-1px"})
                                            handleVote("down").then(() => setReload(reload + 1))
                                        }
                                    }}
                                >
                                <BiDownvote size={20} className={styles.downvote} style={downvoteColor}/>
                            </span>
                            </div>
                            <span className={styles.votesCount}>{voteCount}</span>
                            <span
                                onClick={() => setDisplay(!display)}
                            >
                            <BsFlag className={styles.flag} title={"Report mission"}/>
                        </span>
                            {display && (
                                <span>
                            <div className={styles.reportFrame}>
                                <span className={styles.element}>Out of context</span>
                                <span className={styles.element2}>Inappropriate content</span>

                                <span className={styles.other}>Other:</span>
                                <input type="text" placeholder={"Enter reason"} className={styles.input}/>
                                <button className={styles.button} onClick={() => setDisplay(false)}>Report</button>
                            </div>
                        </span>
                            )}
                            <span className={styles.difficulty}>{difficulty}/5</span>
                        </div>
                    )}

                    {type === "available" && (
                        <div className={styles.selectMission}>
                            <button
                                className={styles.btnSelect}
                                onClick={() => chooseMission().then(() => setReload(reload + 1))}
                            >
                                Select mission
                            </button>
                        </div>
                    )}
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
    );
};

export default MissionCard;
