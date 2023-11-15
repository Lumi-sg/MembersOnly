import * as bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { User } from "../models/User";

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

	asyncHandler(async (req, res, next) => {
		try {
			const errors = validationResult(req);

			const user = new User({
				username: req.body.username,
				password: req.body.password,
			});
			user.password = await bcrypt.hash(user.password, 10);

			if (!errors.isEmpty()) {
				res.render("signup", {
					username: req.body.username,
					errors: errors.array(),
				});
				console.log("error during signup");
			} else {
				await user.save();
				console.log("user created");
				res.redirect("/login");
			}
		} catch (err) {
			console.error("Error during user creation:", err);
			res.status(500).send("Internal Server Error");
		}
	}),
];
