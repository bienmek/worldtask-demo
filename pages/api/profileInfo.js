import connectMongodb from "../../database/connection";
import Mission from "../../database/Schemas/Mission";
import jwt from "jsonwebtoken";
import User from "../../database/Schemas/User";
import mongoose from "mongoose";

export default async function profileInfo (req, res) {
    const token = req.query.token
    const user = jwt.verify(token, process.env.JWT_SECRET)
    const username = user.username
    const dbUser = await User.findOne({username}).lean()
    const missionId = dbUser.missionSelected

    connectMongodb()
        .catch((error) => console.error(error))

    try {
        if (missionId.length > 1) {
            const result = await Mission.findOne({_id: missionId}).lean()

            if (result) {
                res.status(200).json({data: {
                        id: result._id,
                        title: result.title,
                        location: result.location,
                        description: result.description,
                        images: result.images,
                        creator: result.creator,
                        chooser: result.chooser,
                        timeout : result.timeout,
                        missionReport: result.missionReport,
                        points: dbUser.points
                    }
                })
            } else {
                res.status(200).json({data: {
                        error: "Mission not found",
                        points: dbUser.points,
                        chooser: username
                    }
                })
            }
        } else {
            res.status(200).json({data: {
                    error: "No mission selected",
                    points: dbUser.points,
                    chooser: username
                }
            })
        }
    } catch (e) {
        console.error(e)
    }
}