import styles from '../styles/newmission.module.scss'
import MissionCard from "../components/MissionCard";
import React, {useEffect, useState} from "react";
import SubmitReport from "../components/SubmitReport";
import PlainReport from "../components/PlainReport";

export default function Home() {
    const [missionType, setMissionType] = useState("newMission");
    const [translate, setTranslate] = useState({transform: "translate3d(0, 0, 0)"});
    const [retrieveData, setRetrieveData] = useState([]);
    const [reload, setReload] = useState(0);
    const [displayReport, setDisplayReport] = useState(false);
    const [missionReport, setMissionReport] = useState(null);


    const getMissionData = async () => {
        const result = await fetch(`/api/missionInfo`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
        setRetrieveData(result.data)
    }

    const getDateDifference = (date) => {
        const currentDate = new Date()
        const hours = date.split('-')[0]
        const minutes = date.split('-')[1]
        const seconds = date.split('-')[2]

        return `${currentDate.getHours()-hours}-${currentDate.getMinutes() - minutes}-${currentDate.getSeconds() - seconds}`
    }

    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    useEffect(() => {
        getMissionData()
        delay(1000).then(() => {
            setReload(reload + 1)
        })
    }, [reload, ]);

    return (
      <div className={styles.main}>
          <div className={styles.selector}>
              <span
                  className={styles.element}
                  onClick={() => {
                      setMissionType("newMission")
                      setTranslate({transform: "translate3d(1px, 0, 0)"})
                  }}
              >
                  New tasks
              </span>
              <span
                  className={styles.element}
                  onClick={() => {
                      setMissionType("available")
                      setTranslate({transform: "translate3d(150px, 0, 0)"})
                  }}
              >
                  Available tasks
              </span>

              <span
                  className={styles.element}
                  onClick={() => {
                      setMissionType("missionReport")
                      setTranslate({transform: "translate3d(308px, 0, 0)"})
                  }}
              >
                  Tasks report
              </span>
              <div className={styles.bar} style={translate}></div>
          </div>
          <div className={styles.missions}>
              {retrieveData.map((mission, index) => (!mission.isAvailable && missionType === "newMission" && mission.chooser.length < 1) ? (
                  <div className={styles.missionElement}>
                      <MissionCard
                          type={"newMission"}
                          id={mission.id}
                          title={mission.title}
                          location={mission.location}
                          description={mission.description}
                          difficulty={mission.difficulty}
                          images={mission.images}
                          creator={mission.creator}
                          timestamp={getDateDifference(mission.timestamp)}
                          key={index}
                      />
                  </div>
              ) : (missionType === "available" && mission.isAvailable && mission.chooser.length < 1) ? (
                  <div className={styles.missionElement}>
                      <MissionCard
                          type={"available"}
                          id={mission.id}
                          title={mission.title}
                          location={mission.location}
                          description={mission.description}
                          difficulty={mission.difficulty}
                          images={mission.images}
                          creator={mission.creator}
                          timestamp={getDateDifference(mission.timestamp)}
                          chooser={mission.chooser}
                          key={index}
                      />
                  </div>
              ) : (typeof mission.missionReport === "undefined") ? (
                      <div>
                          Loading...
                      </div>
                  ) : (missionType === "missionReport" && mission.missionReport !== null && mission.missionReport.description) && (
                  <div className={styles.missionElement}>
                      <MissionCard
                          type={"missionReport"}
                          id={mission.id}
                          title={mission.title}
                          location={mission.location}
                          description={mission.description}
                          difficulty={mission.difficulty}
                          images={mission.images}
                          creator={mission.creator}
                          timestamp={getDateDifference(mission.timestamp)}
                          chooser={mission.chooser}
                          missionReport={mission.missionReport}
                          displayReport={(display, report) => {
                              if (display) {
                                  setMissionReport(report)
                                  window.scrollTo(0, 0);
                                  setDisplayReport(display)
                              }
                          }}
                          key={index}
                      />
                      {displayReport && (
                          <>
                              <span className={styles.dark} onClick={() => setDisplayReport(false)}></span>
                              <PlainReport
                                  missionId={missionReport.id}
                                  chooser={missionReport.chooser}
                                  description={missionReport.description}
                                  images={missionReport.images}
                              />
                          </>
                      )}
                  </div>
              ))}
          </div>
      </div>
  )
}
