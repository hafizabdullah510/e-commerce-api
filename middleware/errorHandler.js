import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something is wrong Try again Later!",
  };

  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, Please choose another one`;
  }

  if (err.name === "CastError") {
    customError.message = `Nothing with id : ${err.value._id}`;
    customError.statusCode = 404;
  }

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  return res.status(customError.statusCode).json({ msg: customError.message });
};

export default errorHandler;
