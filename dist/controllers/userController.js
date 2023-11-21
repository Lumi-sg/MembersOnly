"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin_user_post = exports.membership_user_post = exports.login_user_post = exports.create_user_post = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const User_1 = require("../models/User");
exports.create_user_post = [
    (0, express_validator_1.body)("username")
        .trim()
        .isLength({ min: 2, max: 25 })
        .escape()
        .withMessage("Username must be between 2 and 25 characters."),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 6, max: 25 })
        .escape()
        .withMessage("Password must be between 6 and 25 characters."),
    (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const { username, password } = req.body;
            const takenUsername = await User_1.UserModel.findOne({ username });
            if (!errors.isEmpty()) {
                res.render("signup", {
                    username,
                    errors: errors.array(),
                });
                console.log(`Failed to create user ${username}`);
            }
            else if (takenUsername) {
                res.render("signup", {
                    username,
                    errors: [{ msg: "Username already taken" }],
                });
                console.log(`Failed to create user ${username}! Username already taken.`);
            }
            else {
                const hashedPassword = await bcryptjs_1.default.hash(password, 10);
                const user = new User_1.UserModel({
                    username,
                    password: hashedPassword,
                });
                await user.save();
                console.log(`User ${username} created`);
                res.redirect(`/login?username=${encodeURIComponent(username)}`);
            }
        }
        catch (err) {
            console.error("Error during user creation:", err);
            res.status(500).send("Internal Server Error");
        }
    }),
];
const login_user_post = (req, res, next) => {
    passport_1.default.authenticate("local", (err, user, info) => {
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
exports.login_user_post = login_user_post;
exports.membership_user_post = (0, express_async_handler_1.default)(async (req, res) => {
    const memberPassword = "odinproject";
    const submittedPassword = req.body.password;
    const user = req.user;
    if (submittedPassword === memberPassword) {
        user.membershipStatus = true;
        await user.save();
        res.redirect("/index");
    }
    else {
        res.redirect("/membership");
    }
});
exports.admin_user_post = (0, express_async_handler_1.default)(async (req, res) => {
    const adminPassword = "deepseadiving";
    const submittedPassword = req.body.password;
    const user = req.user;
    if (submittedPassword === adminPassword) {
        user.adminStatus = true;
        await user.save();
        res.redirect("/index");
    }
    else {
        res.redirect("/admin");
    }
});
//# sourceMappingURL=userController.js.map