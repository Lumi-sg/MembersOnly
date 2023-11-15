import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: { type: String, required: true, minLength: 1, maxLength: 50 },
	password: { type: String, required: true, minLength: 1, maxLength: 50 },
	role: { type: String, required: true, minLength: 1, maxLength: 50 },
});

UserSchema.virtual("url").get(function () {
	return `/user/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);
