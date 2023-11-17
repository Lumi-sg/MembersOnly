import express from "express";
import passport from "passport";
import * as userController from "../controllers/userController";

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
	res.render("login", { username: req.query.username || "" });
});

router.post("/login", userController.login_user_post);

export default router;
