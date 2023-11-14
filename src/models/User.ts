import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstName: { type: String, required: true, minLength: 1, maxLength: 50 },
	lastName: { type: String, required: true, minLength: 1, maxLength: 50 },
	email: { type: String, required: true, minLength: 1, maxLength: 50 },
	password: { type: String, required: true, minLength: 1, maxLength: 50 },
	role: { type: String, required: true, minLength: 1, maxLength: 50 },
});

UserSchema.virtual("fullName").get(function () {
	let fullName = `${this.firstName} ${this.lastName}`;
	return fullName;
});

UserSchema.virtual("url").get(function () {
	return `/user/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);