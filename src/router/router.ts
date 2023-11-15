import express from "express";

const router = express.Router();

//Default route
router.get("/", (req, res) => {
	res.redirect("signup");
});

router.get("/signup", (req, res) => {
	res.render("signup");
});

router.post("/signup", (req, res) => {
	
})

export default router;
