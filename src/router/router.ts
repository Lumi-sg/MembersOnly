import express from "express";
import "express-session";
import passport from "passport";
import * as messageController from "../controllers/messageController";
import * as userController from "../controllers/userController";
declare module "express-session" {
	export interface SessionData {
		username: { [key: string]: any };
	}
}

const router = express.Router();

//Default route
router.get("/", (req: express.Request, res: express.Response) => {
	res.redirect("signup");
});

router.get("/signup", (req: express.Request, res: express.Response) => {
	res.render("signup", { errors: [], username: "" });
});

router.post("/signup", userController.create_user_post);

router.get("/login", (req: express.Request, res: express.Response) => {
	res.render("login", { errorMessage: "", username: req.query.username || "" });
});

router.post("/login", userController.login_user_post);

router.get("/membership", (req: express.Request, res: express.Response) => {
	const user = req.user;

	res.render("membership", { user });
});

router.post("/membership", userController.membership_user_post);

router.get("/admin", (req: express.Request, res: express.Response) => {
	const user = req.user;

	res.render("admin", { user });
});

router.post("/admin", userController.admin_user_post);

router.get("/index", (req: express.Request, res: express.Response) => {
	const user = req.user;
	res.render("index", { user });
});

//message routes

router.get("/messages", messageController.messages_get);

router.get("/messageform", messageController.messageform_get);

router.post("/messageform", messageController.messageform_post);

router.get("/message/:id/delete", messageController.message_delete_post);

router.get(
	"/logout",
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
		req.logout((err) => {
			if (err) {
				return next(err);
			}
			res.redirect("/login");
		});
	}
);

export default router;
