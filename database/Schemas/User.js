import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    missionSelected: {type: String},
    points: {type: Number, required: true}

}, {collection: 'User'})

export default mongoose.models.User || mongoose.model("User", UserSchema)