const express = require('express');
const multer = require('multer');
const router = express.Router();

// Import controllers
const {
    registerUserController,
    loginUserController,
    deleteUserByIdController,
    updateUsernameController,
    updateEmailController,
    updatePasswordController,
    uploadProfilePicController
} = require('../controllers/User.controller');

// Import validators

const {
    registerValidator,
    loginValidator,
    updateUsernameValidator,
    updateEmailValidator,
    updatePasswordValidator,
    deleteUserValidator
} = require("../validators/Users.validators");

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/Profiles_Pic') // Uploads will be stored in the 'uploads/' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // File will be named with current timestamp + original filename
    }
});

// Initialize multer
const upload = multer({ storage });

// Define routes and their respective controllers
router.post('/register', upload.single('profilepic'), registerValidator, registerUserController); // Route to register a user
router.post('/login', loginValidator,loginValidator, loginUserController); // Route to login a user
router.delete('/:user_id', deleteUserValidator, deleteUserByIdController); // Route to delete user by ID
router.put('/username',updateUsernameController);// Route to update username
router.put('/email',updateEmailValidator ,updateEmailController); // Route to update email
router.post('/upload-profile-pic',upload.single('newProfilePic'),uploadProfilePicController); // Route to update profile picture
router.put('/password',updatePasswordValidator, updatePasswordController); // Route to update password

module.exports = router;
