"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-session");
const messageController = __importStar(require("../controllers/messageController"));
const userController = __importStar(require("../controllers/userController"));
const router = express_1.default.Router();
//Default route
router.get("/", (req, res) => {
    res.redirect("signup");
});
router.get("/signup", (req, res) => {
    res.render("signup", { errors: [], username: "" });
});
router.post("/signup", userController.create_user_post);
router.get("/login", (req, res) => {
    res.render("login", { errorMessage: "", username: req.query.username || "" });
});
router.post("/login", userController.login_user_post);
router.get("/membership", (req, res) => {
    const user = req.user;
    res.render("membership", { user });
});
router.post("/membership", userController.membership_user_post);
router.get("/admin", (req, res) => {
    const user = req.user;
    res.render("admin", { user });
});
router.post("/admin", userController.admin_user_post);
router.get("/index", (req, res) => {
    const user = req.user;
    res.render("index", { user });
});
//message routes
router.get("/messages", messageController.messages_get);
router.get("/messageform", messageController.messageform_get);
router.post("/messageform", messageController.messageform_post);
router.get("/message/:id/delete", messageController.message_delete_post);
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
});
exports.default = router;
//# sourceMappingURL=router.js.map