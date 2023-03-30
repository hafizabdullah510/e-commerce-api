import Unauthorized from "../errors/Unauthorized.js";
import Forbidden from "../errors/Forbidden.js";
import { verifyJWT } from "../utils/jwt.js";

export const authUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new Unauthorized("Unauthenticated user");
  }

  try {
    const { name, userId, role } = verifyJWT({ token });
    req.user = { name, userId, role };
    next();
  } catch (err) {
    throw new Unauthorized("Unauthenticated user");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Forbidden("Not Authorized to access the Route");
    }
    next();
  };
};
