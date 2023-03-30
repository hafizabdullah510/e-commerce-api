import jwt from "jsonwebtoken";

export const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

export const verifyJWT = ({ token }) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
};

export const addCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const OneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + OneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};
