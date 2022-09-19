import React, {useEffect, useState} from 'react';
import styles from '../styles/missioncard.module.scss'
import {MdLocationPin} from "react-icons/md";
import {IoIosArrowForward} from "react-icons/io";
import {BiDownvote, BiUpvote} from "react-icons/bi";
import {BsFlag} from "react-icons/bs";
import Image from "next/image";

const MissionCard = ({type, id, title, location, description, difficulty, images, creator, timestamp, chooser, displayReport, missionReport}) => {
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
    const [imageStyle, setImageStyle] = useState({flexDirection: "row", overflowX: "hidden", transform: "translate3d(0, 10px, 0)"})
    const [reload, setReload] = useState(0);
    const [btnName, setBtnName] = useState("Select mission");
    const [reportVote, setReportVote] = useState(0);
    const [reportLockVote, setReportLockVote] = useState(false);
    const [reportUpVoteColor, setReportUpVoteColor] = useState({color: "black"});
    const [reportDownVoteColor, setReportDownVoteColor] = useState({color: "black"});

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

    const getDateDifference = (date) => {
        const currentDate = new Date
        const displayDate = new Date(date)
        return new Date(currentDate - displayDate)
    }

    const displayDate = (date) => {
        const currentDate = new Date
        const displayDate = new Date(date)
        const delta = new Date(currentDate - displayDate)

        if (Math.round(delta/1000) < 60) {
            return `${Math.round(delta / 1000)} s`
        } else {
            return `${Math.round(((delta)/1000)/60)} min`
        }
    }

    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const handleVote = async (vote, target) => {
        return await fetch(`/api/sendVote?missionId=${id}&voter=${localStorage.getItem('token')}&vote=${vote}&target=${target}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    }

    const getVoteInfo = async (target) => {
        return await fetch(`/api/voteInfo?missionId=${id}&token=${localStorage.getItem('token')}&target=${target}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    }

    const verifyMission = async (target) => {
        await fetch(`/api/missionVoteInfo?missionId=${id}&target=${target}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    }

    const chooseMission = async () => {
        return await fetch(`/api/chooseMission?missionId=${id}&token=${localStorage.getItem('token')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    }

    useEffect(() => {
        getVoteInfo("mission").then((res) => {
            setVoteCount(res.votescore)
            setLockVote(res.hasVote)

            if (lockVote) {
                setUpvoteColor({color: "grey"})
                setDownvoteColor({color: "grey"})
            }
        })

        getVoteInfo("report").then((res) => {
            setReportVote(res.votescore)
            setReportLockVote(res.hasVote)
            console.log(res)

            if (reportLockVote) {
                setReportUpVoteColor({color: "grey"})
                setReportDownVoteColor({color: "grey"})
            }
        })

        if (Number(timestamp.split('-')[1]) >= 1) {
            verifyMission("mission")
        }
        if (typeof missionReport !== "undefined" && missionReport !== null) {
            if (getDateDifference(missionReport.submitDate).getMinutes() >= 1) {
                verifyMission("report")
            }
        }
    }, [reload, ]);

    return (
        <div className={styles.card} style={cardHeight}>
            <div className={styles.header}>
                <div className={styles.leftSide}>
                    <h1 className={styles.title}>{title}</h1>
                    <span className={styles.username}>@{creator} -</span>
                    <span className={styles.timestamp}>
                        {(type === "missionReport" && typeof missionReport !== "undefined" && missionReport !== null) ? (
                            <>
                                {displayDate(missionReport.submitDate)}
                            </>
                        ) : (
                            <>
                                {formatDate(timestamp)}
                            </>
                        )}
                    </span>
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
                                            handleVote("up", "mission").then((res) => {
                                                console.log(res)
                                                setReload(reload + 1)
                                            })
                                        }
                                    }}
                                >
                                    <BiUpvote size={20} className={styles.upvote} style={reportUpVoteColor}/>
                                </span>

                                <span
                                    onClick={() => {
                                        if (!lockVote) {
                                            setLockVote(true)
                                            setUpvoteColor({color: "black", top: "-1px"})
                                            setDownvoteColor({color: "red", bottom: "-1px"})
                                            handleVote("down", "mission").then(() => setReload(reload + 1))
                                        }
                                    }}
                                >
                                <BiDownvote size={20} className={styles.downvote} style={reportDownVoteColor}/>
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
                                onClick={() => {
                                    setBtnName("Selecting...")
                                    chooseMission()
                                        .then((res) => {
                                            console.log(res)
                                            if (typeof res.status === "string") {
                                                if (res.status === "ok") {
                                                    setBtnName("Loading...")
                                                    setReload(reload + 1)
                                                    window.location.href = "/profile"
                                                } else {
                                                    setBtnName(res.message)
                                                    delay(1000).then(() => setBtnName("Select mission"))
                                                }
                                            }
                                        })
                                        .catch((error) => console.error(error))
                                }}
                            >
                                {btnName}
                            </button>
                        </div>
                    )}
                    {type === "missionReport" && (
                        <div className={styles.missionReport}>
                            <div className={styles.reportVotes}>
                                <div className={styles.upDownVote}>
                                    <span
                                        onClick={() => {
                                            console.log("up")
                                            if (!reportLockVote) {
                                                setReportLockVote(true)
                                                setReportUpVoteColor({color: "#24985a", top: "-1px"})
                                                setReportDownVoteColor({color: "black", bottom: "-1px"})
                                                handleVote("up", "report").then((res) => {
                                                    console.log(res)
                                                    setReload(reload + 1)
                                                })
                                            }
                                        }}
                                    >
                                        <BiUpvote size={20} className={styles.upvote} style={reportUpVoteColor}/>
                                    </span>

                                    <span
                                        onClick={() => {
                                            console.log("down")
                                            if (!reportLockVote) {
                                                setReportLockVote(true)
                                                setReportDownVoteColor({color: "#24985a", top: "-1px"})
                                                setReportUpVoteColor({color: "black", bottom: "-1px"})
                                                handleVote("down", "report").then((res) => {
                                                    console.log(res)
                                                    setReload(reload + 1)
                                                })
                                            }
                                        }}
                                    >
                                        <BiDownvote size={20} className={styles.downvote} style={reportDownVoteColor}/>
                                    </span>
                                </div>
                                <span className={styles.reportVoteCount}>{reportVote}</span>
                            </div>
                            <button
                                className={styles.seeReport}
                                onClick={() => displayReport(true, {
                                    id,
                                    chooser,
                                    description: missionReport.description,
                                    images: missionReport.images
                                })}
                            >
                                See report
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
                            setImageStyle({flexDirection: "column", overflowX: "scroll"})
                        }
                        if (cardOpen) {
                            setImageSize(50)
                            setImageStyle({flexDirection: "row", overflowX: "hidden", transform: "translate3d(0, 10px, 0)"})
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