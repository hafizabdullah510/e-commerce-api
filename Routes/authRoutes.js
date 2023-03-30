import { login, logout, register } from "../Controller/authController.js";
import express from "express";
const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.get("/logout", logout);

export default routes;
