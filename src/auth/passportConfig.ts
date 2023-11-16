// src/auth/passport-config.ts
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/User";

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await UserModel.findOne({ username });

			if (!user) {
				return done(null, false, { message: "Incorrect username." });
			}

			const match = await bcrypt.compare(password, user.password);

			if (!match) {
				return done(null, false, { message: "Incorrect password." });
			}

			return done(null, user);
		} catch (error) {
			return done(error);
		}
	})
);

passport.serializeUser((user: any, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
	try {
		const user = await UserModel.findById(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});
