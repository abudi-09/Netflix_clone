import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-netflix"];
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "unauthorized token " });
    }
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized-invaild token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user is not found " });
    }
    req.user = user;
    next();
  } catch (error) {}
};
