import connectMongodb from "../../database/connection";
import Mission from "../../database/Schemas/Mission";


export default async function missionInfo (req, res) {
    connectMongodb()
        .catch((error) => console.error(error))

    try {
        const result = await Mission.find({}).sort({})
        const format = []

        for(let i = 0; i < result.length; ++i) {
            format.push({
                id: result[i]._id,
                title: result[i].title,
                location: result[i].location,
                description: result[i].description,
                difficulty: result[i].difficulty,
                images: result[i].images,
                creator: result[i].creator,
                timestamp: result[i].creationDate,
                isAvailable: result[i].isAvailable,
                chooser: result[i].chooser,
                missionReport: result[i].missionReport
            })
        }
        res.status(200).json({data: format.reverse()})
    } catch (e) {
        console.error(e)
    }
}