import dotenv from "dotenv";
import connectMongodb from "../../database/connection";
import Mission from "../../database/Schemas/Mission";
import User from "../../database/Schemas/User";
dotenv.config()

export default async function handleVotes (req, res) {
    const missionId = req.query.missionId
    const target = req.query.target
    const dbMission = await Mission.findOne({_id: missionId}).lean()
    const creator = dbMission.creator
    const dbCreator = await User.findOne({username: creator}).lean()
    let creatorsPoints = dbCreator.points

    connectMongodb()
        .catch((error) => console.error(error))

    try {
        const dbMission = await Mission.findOne({_id: missionId}).lean()
        if (target === "mission") {
            if (dbMission.votescore > 0) {
                creatorsPoints += 10

                await Mission.updateOne(
                    {_id: missionId},
                    {$set: {isAvailable: true}}
                )

                await User.updateOne(
                    {username: creator},
                    {$set: {points: creatorsPoints}}
                )
                res.status(200).json({mission: "approved"})
            } else if (dbMission.votescore < 0) {
                creatorsPoints -= 10

                await User.updateOne(
                    {username: creator},
                    {$set: {points: creatorsPoints}}
                    )

                await Mission.deleteOne({_id: missionId})
                res.status(200).json({mission: "disapproved"})
            }
        } else {
            const chooser = dbMission.chooser
            const dbChooser = await User.findOne({username: chooser}).lean()
            let chooserPoints = dbChooser.points

            if (dbMission.missionReport.votescore > 0) {
                chooserPoints += 100

                await User.updateOne(
                    {username: chooser},
                    {$set: {points: chooserPoints}}
                    )

                await User.updateOne(
                    {username: chooser},
                    {$set: {missionSelected: ""}}
                )

                await Mission.deleteOne({_id: missionId})
                res.status(200).json({mission: "Report approve"})
            } else if (dbMission.missionReport.votescore < 0) {
                chooserPoints -= 10

                await User.updateOne(
                    {username: chooser},
                    {$set: {points: chooserPoints}}
                )

                await Mission.updateOne(
                    {_id: missionId},
                    {$set: {missionReport: null}}
                )
                res.status(200).json({mission: "disapproved"})
            } else {
                res.status(200).json({mission: "has no vote yet"})
            }
        }
    } catch (e) {
    console.error(e)
    }
}