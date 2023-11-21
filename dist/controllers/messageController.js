"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.message_delete_post = exports.messageform_post = exports.messageform_get = exports.messages_get = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const moment_1 = __importDefault(require("moment"));
const Message_1 = require("../models/Message");
exports.messages_get = (0, express_async_handler_1.default)(async (req, res) => {
    const user = req.user;
    const messages = await Message_1.MessageModel.find()
        .sort({ timePosted: -1 })
        .populate("author");
    res.render("messages", { user, messages });
});
exports.messageform_get = (0, express_async_handler_1.default)(async (req, res) => {
    const user = req.user;
    res.render("messageform", { errors: [], user });
});
exports.messageform_post = [
    (0, express_validator_1.body)("title")
        .trim()
        .isLength({ min: 2, max: 72 })
        .escape()
        .withMessage("Title must be between 2 and 72 characters."),
    (0, express_validator_1.body)("content")
        .trim()
        .isLength({ min: 2, max: 144 })
        .escape()
        .withMessage("Message must be between 2 and 144 characters."),
    (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const { title, content } = req.body;
            const user = req.user;
            const timePosted = (0, moment_1.default)().format("MMMM D, YYYY - h:mm A");
            if (!errors.isEmpty()) {
                res.render("messageform", {
                    title,
                    content,
                    errors: errors.array(),
                    user,
                });
                console.log(`Failed to create message ${title} by ${user.username}`);
            }
            else {
                const message = new Message_1.MessageModel({
                    title,
                    content,
                    timePosted: timePosted,
                    author: user._id,
                });
                await message.save();
                console.log(`Message ${title} created by ${user.username}`);
                res.redirect("/messages");
            }
        }
        catch (err) {
            console.error("Error during message creation:", err);
            res.status(500).send("Internal Server Error");
        }
    }),
];
exports.message_delete_post = (0, express_async_handler_1.default)(async (req, res) => {
    const user = req.user;
    if (user.adminStatus === false) {
        console.log(`${user.username} does not have privileges for that action.`);
        res.redirect("/messages");
        return;
    }
    else {
        try {
            const messageID = req.params.id;
            await Message_1.MessageModel.findByIdAndDelete(messageID);
            console.log(`Message ${messageID} deleted`);
            res.redirect("/messages");
        }
        catch (error) {
            console.error("Error during message deletion:", error);
            res.status(500).send("Internal Server Error");
        }
    }
});
//# sourceMappingURL=messageController.js.map