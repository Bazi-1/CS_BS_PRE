const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import controllers and validators
const { 
    addCourseController, 
    searchCourseByNameController, 
    getAllCoursesController, 
    updateCourseController, 
    deleteCourseController, 
    withdrawCourseController, 
    getCourseByIdController
} = require("../controllers/Course.controller");

const {  
    withdrawCourseValidator, 
    searchCourseByNameValidator 
} = require('../validators/Course.validators');

// Set up multer storage
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
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 * 1024 } }); // Max 100MB files
// Define routes and their respective controllers and validators
// router.post('/addCourse',  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 10 }]), addCourseController);
router.post('/addCourse',  upload.fields([{ name: "image", maxCount: 1 }, { name: "video_url", maxCount: 1000 }]), addCourseController);

router.get('/course', getAllCoursesController); // Route to get all courses
router.put("/update/:course_id", upload.single("image"), updateCourseController);
router.get('/getCourse',getCourseByIdController);
router.delete('/delete', withdrawCourseValidator, deleteCourseController); // Route to delete a course by ID
router.post('/withdraw', withdrawCourseValidator, withdrawCourseController); // Route to withdraw from a course
router.get('/search', searchCourseByNameController); // Route to search courses by name

module.exports = router;
