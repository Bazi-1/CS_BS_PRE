const express = require('express');
const router = express.Router();

// Import controllers
const { 
   getMyCoursesController,
   deleteCourseController
} = require("../controllers/me.controller");

// Define routes and their respective controllers
router.get('/myCourse',getMyCoursesController);  // Route to get user courses
router.delete("/delete/:user_id/:course_id", deleteCourseController);

module.exports = router;
