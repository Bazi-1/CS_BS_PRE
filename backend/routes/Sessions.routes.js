const express = require('express');
const router = express.Router();
const multer = require('multer');


// Import controllers
const { 
    createSessionController, 
    updateSessionController, 
    getSessionsController,  
    deleteSessionByIdController, 
    completeSessionController
} = require("../controllers/Sessions.controller");

// Import validators
const { 
    createSessionValidator, 
    getSessionsValidator, 
    deleteSessionByIdValidator 
} = require('../validators/Sessions.validators');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the upload directory
        cb(null,'./../backend/public/uploads');
    },
    filename: function (req, file, cb) {
        // Set the file name as the original name
        cb(null, file.originalname);
    } 
});

// Initialize multer
// const upload = multer({ storage });
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // Max 100MB files

// Define routes and their respective controllers
router.post('/addSession', upload.array("videos"), createSessionController); // Route to create a session for a course 
router.put('/complete/:session_id',completeSessionController);
router.put('/:session_id', createSessionValidator, updateSessionController); // Route to update a session
router.get('/sessions', getSessionsValidator, getSessionsController); // Route to get sessions for a course
router.delete('/:session_id', deleteSessionByIdValidator, deleteSessionByIdController); // Route to delete a session by ID

module.exports = router;
