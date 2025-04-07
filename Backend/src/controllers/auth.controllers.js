import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import User from "../models/User.models.js";
import crypto from "crypto";
import { sendMail, emailVerificationMailGenContent } from "../utils/mail.js";
import { log } from "console";
import { threadId } from "worker_threads";
import bcrypt from "bcryptjs";

const registerUser = asyncHandler(async (req, res) => {
    //fetch data
    const { email, username, password, role } = req.body;
    //check if user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(404, "User already exist.");
    }
    //if not exist then register
    const user = await User.create({ email, username, password, role });

    //check user craeted or not
    if (!user) {
        throw new ApiError(404, "error in user creation");
    }
    //create a verification token
    const token = crypto.randomBytes(32).toString("hex");
    //check token generate or not
    if (!token) {
        throw new ApiError(400, "error during verification token generation");
    }
    //save token in database
    user.emailVerificationToken = token;
    user.emailVerificationExpiry = Date.now() + 10 * 60 * 1000;

    //send email for verification
    const verificationUrl = `http://localhost:8000/api/v1/user/verify?token=${token}`;
    //create mail body
    const mailOption = emailVerificationMailGenContent(
        username,
        verificationUrl,
    );
    //send mail
    await sendMail({
        email: email,
        subject: "Verify your Task Manager account",
        mailGenContent: mailOption,
    });

    //save user in database
    await user.save();
    return res
        .status(201)
        .json(new ApiResponse(201, { message: "user created successfully" }));
});

const verifyEmail = asyncHandler(async (req, res) => {
    //fetch token
    const token = req.query.token;
    //validate token
    if (!token) {
        throw new ApiError(400, "token not available");
    }
    //fetch user by token
    const user = await User.findOne({ emailVerificationToken: token });
    //check user found or not
    if (!user) {
        throw new ApiError(400, "user not found during email verification");
    }
    //if user found then check expiry time
    if (Date.now() > user.emailVerificationExpiry) {
        throw new ApiError(
            404,
            "verification token expired , please resend again",
        );
    }
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    user.isEmailVerified = true;

    //save user
    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, {
                message: "user email verified successfully",
            }),
        );
});

const loginUser = asyncHandler(async (req, res) => {
    //fetch data
    const { email, password } = req.body;

    //check user exist or not
    const user = await User.findOne({ email });
    //if user not found
    if (!user) {
        throw new ApiError(404, "user not found,register first");
    }
    //check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError(404, "password does not match");
    }
    //generate referesh token
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    //validate refresh token
    if (!refreshToken || !accessToken) {
        throw new ApiError(404, "error in token generation");
    }
    //store refreshtoken in cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    });

    //store accesstoken in header
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    //store refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
            },
        }),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    //fetch refresh token to check user logged in or not
    const { refreshToken } = req.cookies;
    validate;
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        throw new ApiError(401, "Refresh token not found");
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const newAccessToken = user.generateAccessToken();
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        return res.status(200).json(
            new ApiResponse(200, {
                message: "Access token refreshed",
            }),
        );
    } catch (err) {
        throw new ApiError(403, "Invalid or expired refresh token");
    }
});

const resendEmailVerification = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});
const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

export {
    changeCurrentPassword,
    forgotPasswordRequest,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendEmailVerification,
    resetForgottenPassword,
    verifyEmail,
};
