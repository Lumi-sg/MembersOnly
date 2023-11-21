"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const MessageSchema = new Schema({
    title: { type: String, required: true, minLength: 2, maxLength: 72 },
    content: { type: String, required: true, minLength: 2, maxLength: 144 },
    timePosted: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
MessageSchema.virtual("url").get(function () {
    return `/user/${this._id}`;
});
exports.MessageModel = mongoose_1.default.model("Message", MessageSchema);
//# sourceMappingURL=Message.js.map