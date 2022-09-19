import connectMongodb from "../../database/connection";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import User from "../../database/Schemas/User";
import Mission from "../../database/Schemas/Mission";
dotenv.config()

export default async function voteInfo (req, res) {
    const missionId = req.query.missionId
    const token = req.query.token
    const target = req.query.target
    const user = jwt.verify(token, process.env.JWT_SECRET)
    const username = user.username
    let hasVote = false

    connectMongodb()
        .catch((error) => console.error(error))

    try {
        let votescore
        let voters
        const dbMission = await Mission.findOne({_id: missionId}).lean()

        console.log(target)

        if (target === "mission") {
            votescore = dbMission.votescore
            voters = dbMission.voters

            for (let i = 0; i < voters.length; ++i) {
                if (username === voters[i]) {
                    hasVote = true
                }
            }
            res.status(200).json({votescore, hasVote})
        } else if (target === "report")  {
            votescore = dbMission.missionReport.votescore
            voters = dbMission.missionReport.voters

            for (let i = 0; i < voters.length; ++i) {
                if (username === voters[i]) {
                    hasVote = true
                }
            }
            res.status(200).json({votescore, hasVote})
        }
    } catch (e) {
        console.error(e)
    }
    res.status(500).json({error: "cannot retrieve any data"})

}