import Product from "../Model/Product.js";
import Review from "../Model/Review.js";
import NotFound from "../errors/NotFound.js";
import Bad_Request from "../errors/Bad_Request.js";
import { StatusCodes } from "http-status-codes";
import { checkPermissions } from "../utils/checkPermissions.js";

export const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const doesExist = await Product.findOne({ _id: productId });
  if (!doesExist) {
    throw new NotFound("Product does not exists");
  }
  const alreadyReviewed = await Review.findOne({
    user: req.user.userId,
    product: productId,
  });
  if (alreadyReviewed) {
    throw new Bad_Request("Already Reviewed the Product");
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
export const getAllReviews = async (req, res) => {
  const allReviews = await Review.find({}).populate({
    path: "product",
    select: "name company",
  });
  res.status(StatusCodes.OK).json({ allReviews, count: allReviews.length });
};
export const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFound("Review does not exists");
  }
  res.status(StatusCodes.OK).json({ review });
};
export const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFound("Review does not exists");
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ msg: "Review Updated Successfully" });
};
export const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFound("Review does not exists");
  }
  checkPermissions(req.user, review.user);
  await review.deleteOne({ _id: reviewId });
  res.status(StatusCodes.OK).json({ msg: "Deleted Successfully" });
};

export const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;

  const reviews = await Review.find({ product: productId });
  if (reviews.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No reviews available for the product" });
  }
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
