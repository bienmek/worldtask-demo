import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../database/Schemas/User";
import dotenv from "dotenv"
dotenv.config()


export default async function login (req, res) {
    if (req.method === 'POST') {
        const {username, password} = req.body
        const user = await User.findOne({username}).lean()

        if(!user)
            return res.json({status: 'error', error: 'Invalid username/password'})

        if(await bcrypt.compare(password, user.password)) {

            const token = jwt.sign({
                id: user._id,
                username: user.username
            }, process.env.JWT_SECRET)

            return res.json({status: 'ok', token})
        }
    }
}