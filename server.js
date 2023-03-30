import express from "express";
import dotenv from "dotenv";
import Connection from "./DB/db.js";
import "express-async-errors";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import cookieParser from "cookie-parser";
import productRoutes from "./Routes/productRoutes.js";
import fileUpload from "express-fileupload";
import reviewRoutes from "./Routes/reviewRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import cors from "cors";

const app = express();
//Env variables
dotenv.config();
const PORT = process.env.PORT || 8000;
const password = process.env.password;

//security packgs
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(ExpressMongoSanitize());

//Middlewares Built-in
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());

//Routes
app.get("/", (req, res) => res.json("Hello man"));
app.get("/api/v1", (req, res) => console.log(req.signedCookies));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);

//Middleware custom
app.use(notFound);
app.use(errorHandler);

const start = () => {
  try {
    Connection(password);
    app.listen(PORT, () => console.log(`Server is listening at Port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};
start();
