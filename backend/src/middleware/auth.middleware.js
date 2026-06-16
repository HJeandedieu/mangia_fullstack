import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js"
import { UnauthorizedError } from "../utils/errors.js"

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("No token provided");
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return next(error);
        }
        if (error.name === "JsonWebTokenError") {
            return next(new UnauthorizedError("Invalid token"));
        }
        if (error.name === "TokenExpiredError") {
            return next(new UnauthorizedError("Token expired"));
        }
        next(error);
    }
}