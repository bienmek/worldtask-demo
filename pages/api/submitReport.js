import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectMongodb from "../../database/connection";
import Mission from "../../database/Schemas/Mission";
dotenv.config()

export default async function submitReport (req, res) {
    const {missionId, description, images} = req.body
    let date = new Date()

    connectMongodb()
        .catch((error) => console.error(error))

    try {
            const response = await Mission.updateOne(
                {_id: missionId},
                {$set: {missionReport: {description: description, images: images, submitDate: date, votescore: 0, voters: []}}}
                )

        res.json({status: "ok", message: "mission added"})
    } catch (e) {
        console.error(e)
    }
}