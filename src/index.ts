import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import http from "http";
import passport from "passport";
import path from "path";

import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router/router";

const app = express();
dotenv.config();

app.use(
	cors({
		credentials: true,
	})
);

app.use(compression());
app.use(bodyParser.json());

//DB Stuff
const MONGO_URL = process.env.MONGODBURL;

mongoose.set("strictQuery", false);

if (!MONGO_URL) {
	console.error("MONGODBURL environment variable is not set.");
	process.exit(1); // Exit the application with an error code.
}
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

//Mongo connection info
mongoose.connection.on("error", (error: Error) => {
	console.log(error);
});
mongoose.connection.on("open", () => {
	console.log("Connected to MongoDB");
});

mongoose.connection.on("close", () => {
	console.log("Disconnected from MongoDB");
});

//View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "views")));

// //Middleware
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// Default route
app.use("/", router);

const server = http.createServer(app);

server.listen(8080, () => {
	console.log("Server running on http://localhost:8080");
});
