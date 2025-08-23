const { validationResult } = require('express-validator');
const { registerUser, loginUser, deleteUserById, checkIfUserExistsByUsername, checkIfUserExistsByEmail,
    updatePassword, updateUsername, updateEmail, updateProfilePic } = require('../services/User.services');
var jwt = require("jsonwebtoken");
require("dotenv").config();
/*-- registerUserController */
/**
 * Controller function to register a new user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const registerUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => err.msg);
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: extractedErrors
        });
    }

    const { username, email, password } = req.body;
    const profilepic = req.file ? req.file.filename : null;

    try {
        const userExists = await checkIfUserExistsByUsername(username);
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "That username is already taken. Please choose a different one."
            });
        }

        const emailExists = await checkIfUserExistsByEmail(email);
        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: "That email is already in use. Try logging in or use another email."
            });
        }

        const newUser = await registerUser(username, email, password, profilepic);

        if (!newUser) {
            return res.status(500).json({
                success: false,
                message: "Oops! Something went wrong while creating your account."
            });
        }

        const token = jwt.sign(
            { userId: newUser.user_id },
            process.env.SECRET_KEY,
            { expiresIn: "50m" }
        );

        return res.status(201).json({
            success: true,
            message: "Welcome to LetsScale! Your account has been created successfully.",
            user: newUser,
            profilePicPath: profilepic,
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
};

/* loginUserController */
/**
 * Controller function to authenticate a user and log them in.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const loginUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const loginResult = await loginUser(username, password);

        if (loginResult.status === 200) {
            if (!process.env.SECRET_KEY) {
                console.error("SECRET_KEY is missing in environment variables.");
                return res.status(500).json({ success: false, message: 'Server configuration error' });
            }

            const token = jwt.sign(
                { userId: loginResult.user.user_id },
                process.env.SECRET_KEY,
                { expiresIn: "50m" }
            );

            return res.json({
                success: true,
                message: "Welcome to LetsScale",
                user: loginResult.user,
                profilepic: loginResult.profilepic,
                token
            });
        } else {
            return res.status(loginResult.status).json({ success: false, message: loginResult.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


/*-- updateUsernameController */
/**
 * Controller function to update a user's username.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating the status of the username update or an error message.
 */
const updateUsernameController = async (req, res) => {


    const { username } = req.body;
    const { user_id } = req.query;

    if (!username) {
        return res.status(400).json({ message: "New username is required" });
    }

    try {
        const result = await updateUsername(username, user_id);

        if (!result) {
            return res.status(401).json({ message: "Username cannot be updated" });
        }

        res.status(200).json({ message: "Username updated successfully" });
    } catch (error) {
        console.error('Internal server error:', error); // Debugging: Log the error
        res.status(500).json({ message: "Internal server error" });
    }
};

/*-- updateEmailController */
/**
 * Controller function to update a user's email.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating the status of the email update or an error message.
 */
const updateEmailController = async (req, res) => {
    const { email } = req.body;
    const { user_id } = req.query;

    try {

        if (!email) {
            return res.status(400).json({ message: "New email is required" });
        }
        const result = await updateEmail(email, user_id);
        if (!result) {
            return res.status(401).json({ message: "Email cannot be updated" });
        }

        res.status(200).json({ message: "Email updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

/*-- uploadProfilePicController */
/**
 * Controller function to upload a new profile picture for a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const uploadProfilePicController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() });
    }

    try {
        const username = req.cookies.username;
        const newProfilePic = req.file.filename;
        const success = await updateProfilePic(newProfilePic, username);

        if (success) {
            // Update the cookie with the new profile picture filename
            res.cookie('profilepic', newProfilePic);

            //res.status(200).json({ success: true, message: 'Profile picture updated successfully.', profilepic: newProfilePic });
            const userProfile = await getUserProfile(username);

            res.render('profile', { userProfile: userProfile })
            //res.redirect('profile',{userProfile: userProfile})
        } else {
            return res.status(400).json({ success: false, message: 'Failed to update profile picture.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

/*-- updatePasswordController */
/**
 * Controller function to update a user's password.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const updatePasswordController = async (req, res) => {
    const { user_id } = req.query;
    const { password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({ message: "New password is required" });
        }

        const result = await updatePassword(password, user_id);

        if (!result) {
            return res.status(401).json({ message: "Password cannot be updated" });
        }

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

/*-- deleteUserByIdController */
/**
 * Controller function to delete a user by their ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const deleteUserByIdController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { user_id } = req.params;
    try {
        const deleteResult = await deleteUserById(user_id);

        res.status(200).json({ message: deleteResult.message });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    registerUserController,
    loginUserController,
    updateUsernameController,
    updatePasswordController,
    uploadProfilePicController,
    updateEmailController,
    deleteUserByIdController
};
