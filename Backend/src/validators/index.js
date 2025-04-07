import { body } from "express-validator";

const userRegistrationValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .withMessage("Valid email required"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("username is required")
            .isLength({ min: 3 })
            .withMessage("username min-length should be 3")
            .isLength({ max: 13 })
            .withMessage("username max-length should be 3"),

        body("password")
            .trim()
            .isLength({ min: 6 })
            .withMessage("password length shold be min of 6")
            .notEmpty()
            .withMessage("password can not be empty"),
    ];
};

const userLoginValidator = () => {
    return [
        body("email").notEmpty().isEmail().withMessage("email is required"),
        body("password").notEmpty().withMessage("password can not be empty"),
    ];
};

export { userRegistrationValidator, userLoginValidator };
