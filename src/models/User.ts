import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export type UserDocument = Document & {
	username: string;
	password: string;
	membershipStatus: boolean;
	adminStatus: boolean;
};

const UserSchema = new Schema<UserDocument>({
	username: { type: String, required: true, minLength: 2, maxLength: 25 },
	password: { type: String, required: true, minLength: 6 },
	membershipStatus: { type: Boolean, required: true, default: false },
	adminStatus: { type: Boolean, required: true, default: false },
});

UserSchema.virtual("url").get(function () {
	return `/user/${this._id}`;
});

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
