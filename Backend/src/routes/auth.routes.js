import { Router } from "express";
import { loginUser, registerUser, verifyEmail,logoutUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator,userLoginValidator } from "../validators/index.js";

const router = Router();

router.post("/register",userRegistrationValidator(),validate,registerUser)
router.get("/verify",verifyEmail);
router.post("/login",userLoginValidator(),validate,loginUser)
router.get("/logout",logoutUser)
export default router;
