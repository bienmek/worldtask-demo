import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectMongodb from "../../database/connection";
import Mission from "../../database/Schemas/Mission";
dotenv.config()

export default async function createMission (req, res) {
    const {title, location, description, difficulty, images, sender} = req.body
    const user = jwt.verify(sender, process.env.JWT_SECRET)
    const date = new Date()

    connectMongodb()
        .catch((error) => console.error(error))

    try {

        const response = await Mission.create({
            title,
            location,
            description,
            difficulty,
            images,
            creator : user.username,
            creationDate: `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`,
            votescore: 0,
            isAvailable: false,
            chooser: '',
            timeout: '',
        })
        console.log(response)
        res.json({status: "ok", message: "mission added"})
    } catch (e) {
        console.error(e)
    }
}