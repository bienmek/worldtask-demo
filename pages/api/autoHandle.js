import connectMongodb from "../../database/connection";
import Mission from "../../database/Schemas/Mission";
import jwt from "jsonwebtoken";
import User from "../../database/Schemas/User";

export default async function autoHandle (req, res) {
    const token = req.query.token
    const user = jwt.verify(token, process.env.JWT_SECRET)
    const username = user.username
    const dbUser = await User.findOne({username}).lean()
    const missionId = dbUser.missionSelected

    connectMongodb()
        .catch((error) => console.error(error))

    try {

    } catch (e) {
        console.error(e)
    }
}