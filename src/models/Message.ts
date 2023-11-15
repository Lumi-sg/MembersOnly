import { DateTime } from "luxon";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	title: { type: String, required: true, minLength: 1, maxLength: 100 },
	content: { type: String, required: true, minLength: 1, maxLength: 1000 },
	timePosted: { type: Date, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("timePostedFormatted").get(function () {
	return DateTime.fromJSDate(this.timePosted).toLocaleString(DateTime.DATETIME_MED);
});

export const Message = mongoose.model("Message", MessageSchema);
