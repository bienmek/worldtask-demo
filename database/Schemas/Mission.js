import mongoose from "mongoose";

const CreateSchema = new mongoose.Schema({
    title : {type: String, required: true},
    location: {type: String, required: true},
    description: {type: String, required: true},
    difficulty: {type: Number, required: true},
    images: {type: Array, required: true},
    creator: {type: String, required: true},
    timestamp: {type: String, required: true},
    votescore: {type: Number},
    reports: {type: Array}
})

export default mongoose.models.Create || mongoose.model("Create", CreateSchema)