import bcrypt from "bcryptjs";
import express from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import moment from "moment";
import { MessageDocument, MessageModel } from "../models/Message";
import { UserDocument, UserModel } from "../models/User";

export const messages_get = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		const user = req.user;
		const messages = await MessageModel.find()
			.sort({ timePosted: -1 })
			.populate("author");

		res.render("messages", { user, messages });
	}
);

export const messageform_get = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		const user = req.user;
		res.render("messageform", { errors: [], user });
	}
);

export const messageform_post = [
	body("title")
		.trim()
		.isLength({ min: 2, max: 72 })
		.escape()
		.withMessage("Title must be between 2 and 72 characters."),
	body("content")
		.trim()
		.isLength({ min: 2, max: 144 })
		.escape()
		.withMessage("Message must be between 2 and 144 characters."),
	asyncHandler(async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req);

			const { title, content } = req.body;
			const user = req.user as UserDocument;
			const timePosted = moment().format("MMMM D, YYYY - h:mm A");

			if (!errors.isEmpty()) {
				res.render("messageform", {
					title,
					content,
					errors: errors.array(),
					user,
				});
				console.log(`Failed to create message ${title} by ${user.username}`);
			} else {
				const message = new MessageModel({
					title,
					content,
					timePosted: timePosted,
					author: user._id,
				});

				await message.save();
				console.log(`Message ${title} created by ${user.username}`);
				res.redirect("/messages");
			}
		} catch (err) {
			console.error("Error during message creation:", err);
			res.status(500).send("Internal Server Error");
		}
	}),
];

export const message_delete_post = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		try {
			const messageID = req.params.id;

			await MessageModel.findByIdAndDelete(messageID);

			console.log(`Message ${messageID} deleted`);
			res.redirect("/messages");
		} catch (error) {
			console.error("Error during message deletion:", error);
			res.status(500).send("Internal Server Error");
		}
	}
);
