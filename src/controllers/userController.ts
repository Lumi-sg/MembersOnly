import bcrypt from "bcryptjs";
import express from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import passport from "passport";
import { UserModel } from "../models/User";

export const create_user_post = [
	body("username")
		.trim()
		.isLength({ min: 2, max: 25 })
		.escape()
		.withMessage("Username must be between 2 and 25 characters."),
	body("password")
		.trim()
		.isLength({ min: 6, max: 25 })
		.escape()
		.withMessage("Password must be between 6 and 25 characters."),

	asyncHandler(async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req);

			const { username, password } = req.body;

			if (!errors.isEmpty()) {
				res.render("signup", {
					username,
					errors: errors.array(),
				});
				console.table(`Failed to create user ${username}`);
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);

				const user = new UserModel({
					username,
					password: hashedPassword,
				});

				await user.save();
				console.log(`User ${username} created`);
				console.log("redirecting to login page");
				res.redirect(`/login?username=${encodeURIComponent(username)}`);
			}
		} catch (err) {
			console.error("Error during user creation:", err);
			res.status(500).send("Internal Server Error");
		}
	}),
];

export const login_user_post = passport.authenticate("local", {
	successRedirect: "/index",
	failureRedirect: "/login",
});
