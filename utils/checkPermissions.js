import Unauthorized from "../errors/Unauthorized.js";

export const checkPermissions = (requestUser, paramsId) => {
  console.log(requestUser.userId, paramsId);
  if (typeof paramsId === "object") {
    if (requestUser.userId === paramsId.toString()) return;
  } else {
    if (requestUser.userId === paramsId) return;
  }
  if (requestUser.role === "admin") return;

  throw new Unauthorized("Access to User is Forbidden!");
};
