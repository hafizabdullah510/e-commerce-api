import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

class Bad_Request extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default Bad_Request;
