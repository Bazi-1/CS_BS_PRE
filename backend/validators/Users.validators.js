const { body, param } = require("express-validator");

const registerValidator = [
    body("username")
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
];

const loginValidator = [
    body("username")
        .notEmpty().withMessage("Username is required"),

    body("password")
        .notEmpty().withMessage("Password is required")
];

const updateUsernameValidator = [
    body("newUsername")
        .notEmpty().withMessage("New username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
];

const updateEmailValidator = [
    body("newEmail")
        .notEmpty().withMessage("New email is required")
        .isEmail().withMessage("Invalid email format")
];

const updatePasswordValidator = [
    body("newPassword")
        .notEmpty().withMessage("New password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
];

const deleteUserValidator = [
    param("user_id")
        .notEmpty().withMessage("User ID is required")
        .isInt().withMessage("User ID must be a number")
];

module.exports = {
    registerValidator,
    loginValidator,
    updateUsernameValidator,
    updateEmailValidator,
    updatePasswordValidator,
    deleteUserValidator
};
