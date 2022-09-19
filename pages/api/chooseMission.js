import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectMongodb from "../../database/connection";
import Mission from "../../database/Schemas/Mission";
import User from "../../database/Schemas/User";
dotenv.config()

export default async function chooseMission (req, res) {
    const token = req.query.token
    const missionId = req.query.missionId
    const user = jwt.verify(token, process.env.JWT_SECRET)
    const username = user.username
    const date = new Date()
    date.setMinutes(date.getMinutes() + 59)

    connectMongodb()
        .catch((error) => console.error(error))

    try {
        const dbUser = await User.findOne({username}).lean()
        const dbMission = await Mission.findOne({_id: missionId})

        if (dbUser.missionSelected.length > 1) {
            res.json({status: "error", message: "Finish your current task"})
        } else if (dbMission.chooser.length < 1) {
            await User.updateOne(
                {username},
                {$set: {missionSelected: missionId}}
            )

            await Mission.updateOne(
                {_id: missionId},
                {$set: {chooser: username}}
            )

            await Mission.updateOne(
                {_id: missionId},
                {$set: {isAvailable: false}}
            )

            await Mission.updateOne(
                {_id: missionId},
                {$set: {timeout: date}}
            )

            res.json({status: "ok", message: "mission chosen !"})
        } else {
            res.json({status: "error", message: "Mission already chosen"})
        }

    } catch (e) {
        console.error(e)
    }
}