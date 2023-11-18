import { DateTime } from "luxon";
import mongoose, { Document } from "mongoose";
import { UserDocument } from "./User";

const Schema = mongoose.Schema;

export type MessageDocument = Document & {
	title: string;
	content: string;
	timePosted: Date;
	author: UserDocument["_id"];
};

const MessageSchema = new Schema<MessageDocument>({
	title: { type: String, required: true, minLength: 1, maxLength: 100 },
	content: { type: String, required: true, minLength: 1, maxLength: 250 },
	timePosted: { type: Date, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("timePostedFormatted").get(function () {
	return DateTime.fromJSDate(this.timePosted).toLocaleString(DateTime.DATETIME_MED);
});

MessageSchema.virtual("url").get(function () {
	return `/user/${this._id}`;
});

export const Message = mongoose.model<MessageDocument>("Message", MessageSchema);
