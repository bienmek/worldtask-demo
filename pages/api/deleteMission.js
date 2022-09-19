import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectMongodb from "../../database/connection";
import Mission from "../../database/Schemas/Mission";
import User from "../../database/Schemas/User";
dotenv.config()

export default async function deleteMission (req, res) {
    const token = req.query.token
    const missionId = req.query.missionId
    const user = jwt.verify(token, process.env.JWT_SECRET)
    const username = user.username

    connectMongodb()
        .catch((error) => console.error(error))

    try {
        const dbUser = await User.findOne({username}).lean()
        const dbMission = await Mission.findOne({_id: missionId})

        if (dbMission && dbUser) {
            await Mission.deleteOne( {_id: missionId})

            await User.updateOne(
                {username},
                {$set: {missionSelected: ""}}
            )

            res.status(200).json({message: "mission deleted"})
        } else {
            res.status(500).json({error: "mission or user not found"})
        }
    } catch (e) {
        console.error(e)
    }
    res.status(500).json({error: "error"})
}