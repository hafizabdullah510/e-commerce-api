import express from "express";

import {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
} from "../Controller/reviewController.js";
import { authorizePermissions, authUser } from "../middleware/auth.js";

const routes = express.Router();

routes.get("/", getAllReviews);
routes.get("/:id", getSingleReview);
routes.post("/", authUser, authorizePermissions("user"), createReview);

routes.delete("/:id", authUser, authorizePermissions("user"), deleteReview);

routes.patch("/:id", authUser, authorizePermissions("user"), updateReview);

export default routes;
