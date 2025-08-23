const { checkIfCourseExistsById } = require("../services/Course.services");
const { enrollCourse, getUserEnrollments, checkIfUserEnrolled } = require("../services/Enrollment.services");

/**-- enrollCourseController */
/**
 * Controller function to enroll a user in a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const enrollCourseController = async (req, res) => {
    const { course_id, user_id } = req.body;
    try {

        if (!user_id) {
            return res.status(401).send({ success: false, message: 'You need to login!' });
        }
        // Check if the course exists
        const courseNotExist = await checkIfCourseExistsById(course_id);
        if (courseNotExist) {
            return res.status(404).send({ success: false, message: `Course not found with ID: ${course_id}` });
        }

        const isEnrolled = await checkIfUserEnrolled(user_id, course_id);
        if (isEnrolled) {
            return res.status(400).send({ success: false, message: "You're already enrolled" });
        }

        // Enroll the user in the course
        const enrollmentResult = await enrollCourse(course_id, user_id);
        if (!enrollmentResult) {
            return res.status(500).send({ success: false, message: "Failed to enroll user in the course" });
        }

        // Successful enrollment
        res.send({ success: true, message: "You're enrolled successfully" });
    } catch (error) {
        console.error('Error enrolling user:', error);
        res.status(500).send({error,message: 'Internal server Error' });
    }
};

/*-- getUserEnrollmentsController */
/**
 * Controller function to get enrollments of a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the user's enrollments or error message.
 */
const getUserEnrollmentsController = async (req, res) => {
    const user_id = req.query.user_id;
    try {
        const enrollments = await getUserEnrollments(user_id);
        res.status(200).json({ success: true, enrollments: enrollments })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
};

module.exports = {
    enrollCourseController,
    getUserEnrollmentsController,
}
