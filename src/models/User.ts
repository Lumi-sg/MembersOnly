import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

export interface UserDocument extends Document {
	username: string;
	password: string;
	membershipStatus: boolean;
	isValidPassword: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>({
	username: { type: String, required: true, minLength: 2, maxLength: 25 },
	password: { type: String, required: true, minLength: 6 },
	membershipStatus: { type: Boolean, required: true, default: false },
});

UserSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
	return bcrypt.compare(password, this.password);
};

UserSchema.virtual("url").get(function () {
	return `/user/${this._id}`;
});

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
