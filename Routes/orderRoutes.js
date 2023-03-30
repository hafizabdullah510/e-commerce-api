import express from "express";
import { getAllOrders } from "../Controller/orderController.js";
import {
  createOrder,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} from "../Controller/orderController.js";
import { authorizePermissions, authUser } from "../middleware/auth.js";
const routes = express.Router();

routes.get("/", authUser, authorizePermissions("admin"), getAllOrders);
routes.post("/", authUser, authorizePermissions("user"), createOrder);
routes.patch("/:id", authUser, authorizePermissions("user"), updateOrder);
routes.get("/:id", authUser, authorizePermissions("user"), getSingleOrder);
routes.get(
  "/currentUser/showAllMyOrders",
  authUser,
  authorizePermissions("user"),
  getCurrentUserOrders
);
export default routes;
