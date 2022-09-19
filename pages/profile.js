import React, {useEffect, useState} from 'react';
import styles from '../styles/profile.module.scss'
import mission from '../styles/newmission.module.scss'
import SelectedMissionCard from "../components/SelectedMissionCard";
import Link from "next/link";
import {FaArrowRight, FaPen} from "react-icons/fa";
import {IoMdAdd} from "react-icons/io";
import SubmitReport from "../components/SubmitReport";
const profile = () => {

    const [retrieveData, setRetrieveData] = useState({});
    const [showPen, setShowPen] = useState(true);
    const [showAdd, setShowAdd] = useState(true);
    const [reload, setReload] = useState(0);
    const [handleTimeout, setHandleTimeout] = useState(null);
    const [displaySubmit, setDisplaySubmit] = useState(false);

    const getProfileInfo = async () => {
        const result =  await fetch(`/api/profileInfo?token=${localStorage.getItem('token')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
        setRetrieveData(result.data)
    }


    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    useEffect(() => {
        delay(1000).then(() => {
            getProfileInfo()
            if (typeof retrieveData.missionReport === "undefined") {
                setHandleTimeout('Loading...')
            } else if (retrieveData.timeout && (retrieveData.missionReport === null || !retrieveData.missionReport.description)) {
                setHandleTimeout(getDateDifference(retrieveData.timeout))
            } else {
                setHandleTimeout('Report submited !')
            }
            setReload(reload + 1)
        })
    }, [reload, ]);

    const getDateDifference = (date) => {
        const currentDate = new Date()
        const trueDate = new Date(date)
        const delta = trueDate - currentDate

        if (Math.round(delta/1000) < 60) {
            return `${Math.round(delta / 1000)} s`
        } else {
            return `${Math.round(((delta)/1000)/60)} min`
        }
    }

    return (
        <>
            <div className={styles.main}>
                <div className={styles.select}>
                    <span className={styles.msTitle}>Current task :</span>
                    <div className={mission.newMission}>
                        {typeof retrieveData.creator === "string" && !retrieveData.error ? (
                            <SelectedMissionCard
                                type={"newMission"}
                                id={retrieveData.id}
                                title={retrieveData.title}
                                location={retrieveData.location}
                                description={retrieveData.description}
                                images={retrieveData.images}
                                creator={retrieveData.creator}
                                timeout={handleTimeout}
                                display={(display) => setDisplaySubmit(display)}
                            />
                        ) : retrieveData.error ? (
                            <Link href={"/"}>
                                <div className={styles.noMission}>
                                    <div className={styles.nmText}>
                                        <span>No task selected,</span>
                                        <span> go get one !</span>
                                    </div>

                                    <FaArrowRight className={styles.arrow}/>
                                </div>
                            </Link>
                        ) : (
                                <div className={styles.noMission}>
                                    <div className={styles.nmText}>
                                        <span>Loading...</span>
                                    </div>
                                </div>
                        )}
                    </div>
                </div>
                <div className={styles.profile}>
                    <div className={styles.header}>
                        <div className={styles.pdp}>
                            {showAdd && (<IoMdAdd className={styles.addPdp}/>)}
                        </div>
                        <div className={styles.banner}>
                            {showPen && (<FaPen className={styles.addBanner}/>)}
                            {typeof retrieveData.chooser === "string" && (
                                <div className={styles.userInfo}>
                                    <div className={styles.username}>@ {retrieveData.chooser}</div>
                                    <div className={styles.points}>points: {retrieveData.points}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {displaySubmit && (
                <>
                    <span className={styles.dark} onClick={() => setDisplaySubmit(false)}></span>
                    <SubmitReport missionId={retrieveData.id}/>
                </>
            )}
        </>

    );
};
export default profile;
