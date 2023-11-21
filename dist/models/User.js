"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    username: { type: String, required: true, minLength: 2, maxLength: 25 },
    password: { type: String, required: true, minLength: 6 },
    membershipStatus: { type: Boolean, required: true, default: false },
    adminStatus: { type: Boolean, required: true, default: false },
});
UserSchema.virtual("url").get(function () {
    return `/user/${this._id}`;
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.js.map