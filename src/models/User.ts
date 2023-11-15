import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: { type: String, required: true, minLength: 2, maxLength: 25 },
	password: { type: String, required: true, minLength: 6 },
	membershipStatus: { type: Boolean, required: true, default: false },
});

UserSchema.virtual("url").get(function () {
	return `/user/${this._id}`;
});

export const User = mongoose.model("User", UserSchema);
