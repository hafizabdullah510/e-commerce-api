import { StatusCodes } from "http-status-codes";
import Product from "../Model/Product.js";
import NotFound from "../errors/NotFound.js";
import Review from "../Model/Review.js";
import Bad_Request from "../errors/Bad_Request.js";
import path from "path";

export const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};
export const getSingleProduct = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findOne({ _id: id }).populate("reviews");
  if (!product) {
    throw new NotFound("Product not found!");
  }
  res.status(StatusCodes.OK).json({ product });
};
export const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
export const updateProduct = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new NotFound("Product not found/Updated!");
  }
  res.status(StatusCodes.OK).json({ product, msg: "Updated Successfully" });
};
export const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFound("Product not found!");
  }
  console.log(product);
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ product, msg: "Deleted Successfully" });
};
export const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new Bad_Request("Please Upload Image file");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new Bad_Request("Please upload valid image file");
  }
  const imagePath = path.join(
    path.resolve(),
    "./public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};
