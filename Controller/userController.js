import { StatusCodes } from "http-status-codes";
import Bad_Request from "../errors/Bad_Request.js";
import NotFound from "../errors/NotFound.js";
import Unauthorized from "../errors/Unauthorized.js";
import User from "../Model/User.js";
import { createTokenUser } from "../utils/createTokenUser.js";
import { addCookiesToResponse } from "../utils/jwt.js";
import { checkPermissions } from "../utils/checkPermissions.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};
export const getSingleUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById({ _id: id }).select("-password");
  if (!user) {
    throw new NotFound(`User not Found with id :${id}`);
  }
  console.log(req.user);
  checkPermissions(req.user, id);
  res.status(StatusCodes.OK).json({ user });
};
export const showCurrentUser = (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};
export const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new Bad_Request("Please Provide name and email");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    {
      new: true,
      runValidators: true,
    }
  );
  const tokenUser = createTokenUser(user);
  addCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.user;
  if (!oldPassword || !newPassword) {
    throw new Bad_Request("Please Provide old and new Password");
  }
  const user = await User.findById({ _id: userId });

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    throw new Unauthorized("Invalid Old Password!");
  }

  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "User's password Modified" });
};
