import {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} from "../Controller/userController.js";
import { authUser } from "../middleware/auth.js";
import { authorizePermissions } from "../middleware/auth.js";
import express from "express";
const routes = express.Router();

routes.get("/", authUser, authorizePermissions("admin"), getAllUsers);
routes.get("/:id", authUser, getSingleUser);
routes.get("/show/current", authUser, showCurrentUser);
routes.patch("/updateUser", authUser, updateUser);
routes.patch("/updateUserPassword", authUser, updateUserPassword);

export default routes;
