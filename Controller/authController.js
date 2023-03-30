import { StatusCodes } from "http-status-codes";
import User from "../Model/User.js";
import Bad_Request from "../errors/Bad_Request.js";
import Unauthorized from "../errors/Unauthorized.js";
import { createJWT, addCookiesToResponse } from "../utils/jwt.js";
import { createTokenUser } from "../utils/createTokenUser.js";

export const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new Bad_Request("Email Already Exists");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser(user);
  addCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Bad_Request("Please Provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("Invalid Email");
  }
  const isMatch = await user.comparePassword(password);
  console.log(isMatch);
  if (!isMatch) {
    throw new Unauthorized("Invalid Password");
  }
  const tokenUser = createTokenUser(user);
  addCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};
export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  // just for dev purpose other wise no response req for logout
  res.status(StatusCodes.OK).json({ msg: "User Logged out" });
};
