const { getMyCourses,deleteCourse} = require("../services/me.services");

/*-- getMyCoursesController */
/**
 * Controller function to get the courses of a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the user's courses or error message.
 */
const getMyCoursesController = async (req, res) => {
    const user_id = req.query.user_id;
    try {
        const mycourses = await getMyCourses(user_id);
        res.status(200).json({success: true, mycourses:mycourses})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
};

const deleteCourseController = async (req, res) => {
    const { user_id, course_id } = req.params;
    try {
        const result = await deleteCourse(user_id, course_id);

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting course", error: error.message });
    }
};
module.exports = {
    getMyCoursesController,
    deleteCourseController
}
