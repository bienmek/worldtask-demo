import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectMongodb from "../../database/connection";
import Mission from "../../database/Schemas/Mission";
import User from "../../database/Schemas/User";
dotenv.config()

export default async function handleVotes (req, res) {
    const token = req.query.voter
    const vote = req.query.vote
    const target = req.query.target
    const missionId = req.query.missionId
    const user = jwt.verify(token, process.env.JWT_SECRET)
    const username = user.username
    const dbUser = await User.findOne({username}).lean()
    let points = dbUser.points

     console.log("SEND VOTE")

    connectMongodb()
        .catch((error) => console.error(error))

    try {
        console.log(`before ${target} in sendvote`)

        if (target === "mission") {
            const dbMission = await Mission.findOne({_id: missionId}).lean()
            const voters = dbMission.voters

            for (let i = 0; i < voters.length; ++i) {
                if (username === voters[i]) {
                    res.json({error: `${username} has already vote`})
                    return
                }
            }

            points += 1

            await Mission.updateOne(
                {_id: missionId}, {$push: {voters: username}}
            )

            if (vote === "up") {
                const votescore = dbMission.votescore + 1
                await Mission.updateOne(
                    {_id: missionId},
                    {$set: {votescore}}
                )

                await User.updateOne(
                    {username},
                    {$set: {points}}
                )
            } else if (vote === "down") {
                const votescore = dbMission.votescore - 1
                await Mission.updateOne(
                    {_id: missionId},
                    {$set: {votescore}}
                )

                await User.updateOne(
                    {username},
                    {$set: {points}}
                )
            }
            res.status(200).json({message: `${user.username} vote an ${vote} at ${target} #${dbMission._id}`})
        } else if (target === "report") {
            const dbReport = await Mission.findOne({_id: missionId}).lean()
            const voters = dbReport.missionReport.voters
            console.log(`Send vote in ${target} with ${voters} 2`)

            if (voters) {
                for (let i = 0; i < voters.length; ++i) {
                    if (username === voters[i]) {
                        res.json({error: `${username} has already vote`})
                        return
                    }
                }
            }

            points += 1

            await Mission.updateOne(
                {_id: missionId},
                {$push: {"missionReport.voters": username}}
            )

            if (vote === "up") {
                const votescore = dbReport.missionReport.votescore + 1
                await Mission.updateOne(
                    {_id: missionId},
                    {$set: {"missionReport.votescore": votescore}}
                )
                await User.updateOne(
                    {username},
                    {$set: {points}}
                )

            } else if (vote === "down") {
                const votescore = dbReport.missionReport.votescore - 1
                await Mission.updateOne(
                    {_id: missionId},
                    {$set: {"missionReport.votescore": votescore}}
                )

                await User.updateOne(
                    {username},
                    {$set: {points}}
                )
            }
            res.status(200).json({message: `${user.username} vote an ${vote} at ${target} #${dbReport._id}`})
        }
    } catch (e) {
        console.error(e)
    }
    res.status(500).json({error: "cannot retrieve any data"})
}