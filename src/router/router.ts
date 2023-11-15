import express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

//Default route
router.get("/", (req, res) => {
	res.redirect("signup");
});

router.get("/signup", (req, res) => {
	res.render("signup", { errors: [] });
});

router.post("/signup", userController.create_user_post);

export default router;
