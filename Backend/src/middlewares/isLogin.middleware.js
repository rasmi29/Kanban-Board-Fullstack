// middlewares/isLoggedIn.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";

// Middleware to check accessToken and fallback to refreshToken
export const isLoggedIn = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token;

    // 1️⃣ Check Access Token (from Authorization header)
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded; // Attach user info from token
            return next();
        } catch (err) {
            // Access token might be expired, continue to refresh
        }
    }

    // 2️⃣ Check Refresh Token (from cookies)
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized: Token missing");
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new ApiError(404, "User not found with this refresh token");
        }

        // 3️⃣ Generate new Access Token
        const newAccessToken = user.generateAccessToken();

        // Optionally: Attach new access token to response header
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.user = {
            _id: user._id,
            email: user.email,
            username: user.username,
        };
        return next();
    } catch (err) {
        throw new ApiError(403, "Invalid or expired refresh token");
    }
};
