import connectMongodb from "../../database/connection";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import User from "../../database/Schemas/User";
dotenv.config()

export default async function getInfo (req, res) {
    const token = req.query.token

    connectMongodb()
        .catch((error) => console.error(error))

    if (req.method === 'GET') {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        const username = user.username

        const dbUser = await User.findOne({username}).lean()
        res.status(200).json({username: dbUser.username})
    }
}