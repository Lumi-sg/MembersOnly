import { DateTime } from "luxon";
import mongoose, { Document } from "mongoose";
import { UserDocument } from "./User";

const Schema = mongoose.Schema;

export type MessageDocument = Document & {
	title: string;
	content: string;
	timePosted: string;
	author: UserDocument["_id"];
};

const MessageSchema = new Schema<MessageDocument>({
	title: { type: String, required: true, minLength: 2, maxLength: 72 },
	content: { type: String, required: true, minLength: 2, maxLength: 144 },
	timePosted: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("url").get(function () {
	return `/user/${this._id}`;
});

export const MessageModel = mongoose.model<MessageDocument>("Message", MessageSchema);
