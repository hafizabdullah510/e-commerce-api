import { StatusCodes } from "http-status-codes";

const notFound = (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ msg: "Route Does not exist" });
};
export default notFound;
