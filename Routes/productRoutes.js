import express from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
  getSingleProduct,
} from "../Controller/productController.js";
import { authorizePermissions, authUser } from "../middleware/auth.js";
import { getSingleProductReviews } from "../Controller/reviewController.js";

const routes = express.Router();

routes.get("/", getAllProducts);
routes.get("/:id", getSingleProduct);
routes.post("/", authUser, authorizePermissions("admin"), createProduct);
routes.patch("/:id", authUser, authorizePermissions("admin"), updateProduct);
routes.delete("/:id", authUser, authorizePermissions("admin"), deleteProduct);
routes.post(
  "/uploadImage",
  authUser,
  authorizePermissions("admin"),
  uploadImage
);
routes.get("/:id/reviews", getSingleProductReviews);

export default routes;
