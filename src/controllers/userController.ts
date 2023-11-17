import bcrypt from "bcryptjs";
import express from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import passport from "passport";
import { UserDocument, UserModel } from "../models/User";

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
			const takenUsername = await UserModel.findOne({ username });

			if (!errors.isEmpty()) {
				res.render("signup", {
					username,
					errors: errors.array(),
				});
				console.log(`Failed to create user ${username}`);
			} else if (takenUsername) {
				res.render("signup", {
					username,
					errors: [{ msg: "Username already taken" }],
				});
				console.log(`Failed to create user ${username}! Username already taken.`);
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);

				const user = new UserModel({
					username,
					password: hashedPassword,
				});

				await user.save();
				console.log(`User ${username} created`);
				res.redirect(`/login?username=${encodeURIComponent(username)}`);
			}
		} catch (err) {
			console.error("Error during user creation:", err);
			res.status(500).send("Internal Server Error");
		}
	}),
];

export const login_user_post = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	passport.authenticate("local", (err: any, user: any, info: any) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			// Access the error message from info
			const errorMessage = info && info.message ? info.message : "Unknown error.";
			return res.render("login", { errorMessage });
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
			return res.redirect("/index");
		});
	})(req, res, next);
};

export const membership_user_post = asyncHandler(
	async (req: express.Request, res: express.Response) => {
		const memberPassword = "odinproject";
		const submittedPassword = req.body.password;
		const user = req.user as UserDocument;

		if (submittedPassword === memberPassword) {
			user.membershipStatus = true;
			await user.save();

			res.redirect("/index");
		} else {
			res.redirect("/login");
		}
	}
);
