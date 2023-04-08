import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async function verifyJWTToken(req, res, next) {
  try {
    //access authorize header to validate request
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    //put decoded token into req object with property user, and pass it to next function
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
}
