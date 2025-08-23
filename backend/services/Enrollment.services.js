const { query } = require("../database/db");
const { createSection } = require("../services/Sessions.services");

/**
 * Checks if a user is enrolled in any course.
 * @param {string} username - The username of the user.
 * @returns {boolean} - Returns true if the user is enrolled in any course, otherwise false.
 */
const checkIfUserEnrolled = async (user_id, course_id) => {
    try {
        const enrollmentQuery = `
            SELECT enroll_id 
            FROM public.enrollment 
            WHERE user_id = $1 AND course_id = $2
        `;
        const enrollmentRows = await query(enrollmentQuery, [user_id, course_id]);

        return enrollmentRows.length > 0; // true if already enrolled
    } catch (error) {
        console.error("Error checking enrollment:", error);
        throw new Error('Database error');
    }
};


const checkUserEnrollment = async (user_id, course_id) => {
    const sql = `SELECT * FROM public.enrollments WHERE user_id = $1 AND course_id = $2`;
    const result = await query(sql, [user_id, course_id]);

    return result.length > 0; // Return `true` if the user is enrolled

};

/**
 * Enrolls a user in a course session.
 * @param {number} course_id - The ID of the course to enroll in.
 * @param {string} username - The username of the user to enroll.
 * @returns {Object} - Returns the result of the enrollment operation.
 */
const enrollCourse = async (course_id, user_id) => {
    try {

        const date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current datetime

        const enrollSql = `INSERT INTO public.enrollment (user_id, course_id, date, status) VALUES ($1, $2, $3, $4)`;
        await query(enrollSql, [user_id, course_id, date, "enrolled"]);


        return { success: true, message: "Enrollment successful" };
    } catch (error) {

        throw new Error(error);
    }
};

/**
 * Deletes an enrollment record for a specific user and course.
 * @param {number} course_id - The ID of the course.
 * @param {string} username - The username of the user.
 * @returns {Object} - Returns the result of the deletion operation.
 */
const deleteEnrollment = async (course_id, username) => {
    try {
        // Retrieve user ID from username
        const userQuery = 'SELECT user_id FROM public.users WHERE username = $1';
        const [userRows] = await query(userQuery, [username]);
        const user_id = userRows[0].user_id;

        // SQL query to delete the enrollment record
        const sql = `DELETE FROM public.enrollment WHERE course_id = $1 AND user_id = $2`;

        // Execute the query with the provided parameters
        const result = await query(sql, [course_id, user_id]);

        // Return the result of the deletion operation
        return result;
    } catch (error) {
        // Throw an error if there's an issue with the database query
        throw new Error(error);
    }
};

/**
 * Retrieves enrollment records for a specific user.
 * @param {string} username - The username of the user.
 * @returns {Array} - Returns an array of enrollment records for the user.
 */
const getUserEnrollments = async (user_id) => {
    try {
        // Get all course_ids the user is enrolled in
        const querySql = `
            SELECT course_id
            FROM public.enrollment
            WHERE user_id = $1;
        `;
        const enrollments = await query(querySql, [user_id]);

        // Extract course_ids from the enrollment results
        const courseIds = enrollments.map(e => e.course_id);

        if (courseIds.length === 0) {
            return [];
        }

        // Dynamically build the SQL query with placeholders
        const placeholders = courseIds.map((_, idx) => `$${idx + 1}`).join(', ');
        const courseQuery = `SELECT * FROM public.course WHERE course_id IN (${placeholders});`;

        // Fetch all enrolled courses
        const enrolledCourses = await query(courseQuery, courseIds);
        return enrolledCourses;
    } catch (error) {
        console.error(`Error fetching enrollments: ${error.message}`);
        throw new Error(error);
    }
};



module.exports = {
    enrollCourse,
    deleteEnrollment,
    checkIfUserEnrolled,
    getUserEnrollments,
    checkUserEnrollment
};
