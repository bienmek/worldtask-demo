import connectMongodb from "../../database/connection";
import User from "../../database/Schemas/User";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export default async function register (req, res) {
    const {username, email, password: plainTextPassword} = req.body

    connectMongodb()
        .catch((error) => console.error(error))

    if (req.method === 'POST') {
        const password = await bcrypt.hash(plainTextPassword, 10)

        try {
            const response = await User.create({
                username,
                email,
                password,
                missionSelected: '',
                points: 0
            })

            const user = await User.findOne({username}).lean()

            if(!user)
                return res.json({status: 'error', error: 'Invalid username/password'})

            const token = jwt.sign({
                id: user._id,
                username: user.username,
            }, process.env.JWT_SECRET)

            res.json({status: 'ok', token})
            console.log('User created successfully: ', response)
            console.log(token)
        } catch(error) {
            if(error.code === 11000) {
                return res.json({status: 'error', error: 'Username already in use'})
            }
            throw error
        }
    }
}