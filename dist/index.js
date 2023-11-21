"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
require("./auth/passportConfig");
const User_1 = require("./models/User");
const router_1 = __importDefault(require("./router/router"));
const app = (0, express_1.default)();
app.use(
	(0, cors_1.default)({
		credentials: true,
	})
);
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
//DB Stuff
const MONGO_URL = process.env.MONGODBURL;
mongoose_1.default.set("strictQuery", false);
if (!MONGO_URL) {
	console.error("MONGODBURL environment variable is not set.");
	process.exit(1); // Exit the application with an error code.
}
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(MONGO_URL);
//Mongo connection info
mongoose_1.default.connection.on("error", (error) => {
	console.log(error);
});
mongoose_1.default.connection.on("open", () => {
	console.log("Connected to MongoDB");
});
mongoose_1.default.connection.on("close", () => {
	console.log("Disconnected from MongoDB");
});
// //Middleware
app.use(
	(0, express_session_1.default)({
		secret: "cats",
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser((user, done) => {
	done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
	try {
		const user = await User_1.UserModel.findById(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});
//View Engine
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "views")));
// Default route
app.use("/", router_1.default);
const server = http_1.default.createServer(app);
const port = 3000;
server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map
