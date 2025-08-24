const { validationResult } = require('express-validator');
const path = require('path');
const fs = require("fs");

const { addCourse, updateCourse, getCourseById, deleteCourse,
    withdrawCourse, searchCourseByName, getUserCourses,
    getAllCourses,
    checkIfCourseExistsById } = require("../services/Course.services");

/*-- addCourseController */
/**
 * Controller function to add a new course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const addCourseController = async (req, res) => {
    try {
        let { name, description, user_id, sections } = req.body;
        const image = req.files?.image ? req.files.image[0].filename : null;

        if (!name || !description) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({ success: false, message: 'You need to login!' });
        }

        if (typeof sections === "string") {
            try {
                sections = JSON.parse(sections);
            } catch (error) {
                console.error("Error parsing sections:", error);
                return res.status(400).json({ message: "Invalid sections format" });
            }
        }

        if (!Array.isArray(sections)) {
            return res.status(400).json({ message: "Sections must be an array" });
        }

        const newCourse = await addCourse(name, description, image, user_id, sections);

        res.status(201).json({ message: "Course added successfully", success: true, course: newCourse });
    } catch (error) {
        console.error("Error in addCourseController:", error);
        res.status(500).json({ message: error.message });
    }
};

/*-- getAllCoursesController */
/**
 * Controller function to get all courses.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing all courses or error message.
 */
const getAllCoursesController = async (req, res) => {
    try {

        const {user_id} = req.query;
        console.log(1)
        const courses = await getAllCourses(user_id);
        console.log(`${JSON.stringify(courses)}`)
        res.status(200).json({ courses: courses });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/*-- updateCourseController */
/**
 * Controller function to update a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const updateCourseController = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { name, description } = req.body;
        let newImage = req.file ? req.file.originalname : null; // Get new image filename

        if (!name || !description) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Fetch existing course details to get the old image filename
        const existingCourse = await getCourseById(course_id);
        if (!existingCourse) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const oldImage = existingCourse.image; 

        // Define the correct path to the old image
        if (newImage && oldImage) {
            const oldImagePath = path.join(__dirname, "../public/uploads", oldImage);

            // Check if file exists before deleting
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${err.message}`);
                    } else {
                        console.log(`Deleted old image: ${oldImage}`);
                    }
                });
            } else {
                console.log(`Old image not found at path: ${oldImagePath}`);
            }
        }

        // Update course with the new image
        const result = await updateCourse(course_id, name, description, newImage || oldImage);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/*-- getCourseByIdController */
/**
 * Controller function to get a course by its ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the course or error message.
 */
const getCourseByIdController = async (req, res) => {

    const { course_id } = req.query;

    try {
        const course = await getCourseById(course_id);
        if (!course || course.length === 0) {
            return res.status(200).json({ message: "course not found" });
        }

        res.status(200).json({ course });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
};

/*-- getCourseNameByIdController */
/**
 * Controller function to retrieve the name of a course by its ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the course name or error message.
 */
const getCourseNameByIdController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { course_id } = req.body;

    try {
        const courseName = await getCourseNameById(course_id);
        if (!courseName || courseName.length === 0) {
            return res.status(200).json({ message: "course not found" });
        }

        res.status(200).json({ courseName });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

/*-- deleteCourseController */
/**
 * Controller function to delete a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const deleteCourseController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { course_id } = req.query;


    try {

        const result = await deleteCourse(course_id);

        res.status(200).json({ success: true, message: result.message });
        // res.redirect('/courses/course')
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/*-- withdrawCourseController */
/**
 * Controller function to withdraw a user from a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const withdrawCourseController = async (req, res) => {

    const { course_id } = req.body
    const user_id = req.query.user_id
    try {

        const result = await withdrawCourse(user_id, course_id);
        if (result !== false) {
            return res.status(200).json({ message: 'User withdrawn from course successfully' });
        } else {
            return res.status(404).json({ message: 'User or course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*-- getUserCoursesController */
/**
 * Controller function to get all courses enrolled by a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the courses or error message.
 */
const getUserCoursesController = async (req, res) => {
    const username = req.cookies.username;
    try {
        const courses = await getUserCourses(username);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*-- searchCourseByNameController  */
/**
 * Controller function to search for courses by name.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the courses or error message.
 */
const searchCourseByNameController = async (req, res) => {
    const name = req.query.name;
    const user_id = req.query.user_id;

    if (!name || !user_id) {
        return res.status(400).json({ message: "Missing search term or user ID" });
    }

    try {
        const courses = await searchCourseByName(name, user_id);

        res.status(200).json({courses: courses});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    addCourseController,
    updateCourseController,
    getCourseByIdController,
    deleteCourseController,
    withdrawCourseController,
    getUserCoursesController,
    searchCourseByNameController,
    getAllCoursesController,
    getCourseNameByIdController
}
