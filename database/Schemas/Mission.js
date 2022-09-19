import mongoose from "mongoose";

const MissionSchema = new mongoose.Schema({
    title : {type: String, required: true},
    location: {type: String, required: true},
    description: {type: String, required: true},
    difficulty: {type: Number, required: true},
    images: {type: Array, required: true},
    creator: {type: String, required: true},
    creationDate: {type: String, required: true},
    voters: {type: Array},
    votescore: {type: Number},
    isAvailable: {type: Boolean},
    chooser: {type: String},
    timeout: {type: Date},
    missionReport : {
        images: {type: Array},
        description: {type: String},
        voters: {type: Array},
        votescore: {type: Number},
        submitDate: {type: Date}
    }
}, {collection: "Mission"})

export default mongoose.models.Mission || mongoose.model("Mission", MissionSchema)