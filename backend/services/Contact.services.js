const { query } = require("../database/db");
const { getUserImageByUsername } = require("./User.services");

/**
 * Adds a new course to the course table.
 * @param {string} name - The name of the course.
 * @param {string} description - The description of the course.
 * @param {string} instructor - The instructor of the course.
 * @param {string} image - The image URL of the course.
 *  @param {string} username - The username of the user.
 * @returns {Object} - The newly added course object.
*/

const addCourse = async (name, description, image, user_id, sections) => {
    try {
        if (!sections || !Array.isArray(sections)) {
            throw new Error("Invalid sections data received");
        }

        const result1 = await query('SELECT username FROM public.users WHERE user_id = $1', [user_id]);
        const username = result1[0]?.username || null;
        if (!username) {
            throw new Error('You need to login!')
        }

        const courseSql = `
            INSERT INTO public.course (name, description, instructor, image, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING course_id
        `;
        const result = await query(courseSql, [name, description, username, image, user_id]);

        if (!result || result.length === 0) {
            throw new Error('No data returned from the query');
        }
        const courseId = result[0]?.course_id;
        for (const sec of sections) {
            const parsedSection = typeof sec === "string" ? JSON.parse(sec) : sec;
            if (!parsedSection.title) continue;

            const sectionSql = `
                INSERT INTO public.sections (title, course_id, user_id)
                VALUES ($1, $2, $3)
                RETURNING section_id
            `;
            const sectionResult = await query(sectionSql, [parsedSection.title, courseId, user_id]);
            const sectionId = sectionResult[0]?.section_id;

            for (const session of parsedSection.sessions) {
                const sessionSql = `
                    INSERT INTO public.session (title, user_id, course_id, section_id)
                    VALUES ($1, $2, $3, $4)
                    RETURNING session_id
                `;
                const sessionResult = await query(sessionSql, [session.name, user_id, courseId, sectionId]);
                const sessionId = sessionResult[0]?.session_id;
                const videoFile = session.video_url;

                if (videoFile) {
                    const videoSql = 'INSERT INTO public.video (video_url, session_id) VALUES ($1, $2) RETURNING video_id';
                    await query(videoSql, [videoFile, sessionId]);
                } else {
                    console.warn(`No video found for session: ${session.name}`);
                }

            }
        }

        const addedCourse = await query('SELECT * FROM public.course WHERE course_id = $1', [courseId]);
        return addedCourse;

    } catch (error) {
        console.error(`Error in addCourse: ${error.message}`);
        throw new Error(`Error in addCourse: ${error.message}`);
    }
};


/**
 * Checks if a course exists in the course table by its ID.
 * @param {number} course_id - The ID of the course to check.
 * @returns {boolean} - True if the course exists, false otherwise.
 */
const checkIfCourseExistsById = async (course_id) => {
    try {
        const result = await query('SELECT COUNT(*) AS count FROM public.course WHERE course_id = $1', [course_id]);
        if (!result.rows || result.rows.length === 0) {
            return false;
        }
        return parseInt(result.rows[0].count, 10) > 0;
    } catch (error) {
        throw new Error('Database error');
    }
};


/**
 * Updates a course in the course table with the provided information.
 * @param {number} course_id - The ID of the course to update.
 * @param {string} name - The new name of the course.
 * @param {string} description - The new description of the course.
 * @param {string} instructor - The new instructor of the course.
 * @param {string} image - The new image URL of the course.
 * @returns {object} - The result of the database update operation.
 */
// Update the return statement of updateCourse
const updateCourse = async (course_id, name, description, image) => {
    try {
        const updateCourse = `UPDATE course SET name = $1, description = $2, image = $3 WHERE course_id = $4`;
        await query(updateCourse, [name, description, image, course_id]);
        return { success: true, message: "Course updated successfully" };
    } catch (error) {
        throw new Error("Database error: Unable to update course");
    }
};

/**
 * Retrieves a course from the course table based on the provided course ID.
 * @param {number} course_id - The ID of the course to retrieve.
 * @returns {object} - The course retrieved from the database.
 */
const getCourseById = async (course_id) => {
    try {
        const course = await query('SELECT * FROM public.course WHERE course_id = $1', [course_id]);

        return course[0];
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Retrieves the name and description of a course by its ID.
 * @param {number} course_id - The ID of the course.
 * @returns {Promise<Array>} - A promise that resolves to an array containing the course name and description.
 * @throws {Error} - If there's an issue with the database query.
 */
const getCourseNameById = async (course_id) => {
    try {
        const course = await query('SELECT name, description FROM public.course WHERE course_id = $1', [course_id]);

        // if (!course || !course.rows || course.rows.length === 0) {
        //     console.warn(`No course found with ID ${course_id}`);
        //     return null; // Return null instead of accessing undefined [0]
        // }

        return course[0]; // Return the first course found
    } catch (error) {
        console.error("Error in getCourseNameById:", error.message);
        throw new Error("Failed to fetch course details");
    }
};


/**
 * Deletes a course from the course table based on the provided course ID.
 * @param {number} course_id - The ID of the course to delete.
 * @returns {object} - The result of the deletion operation.
 */
const deleteCourse = async (course_id) => {
    try {
        // Delete sessions related to sections associated with the course
        // await query(`
        //     DELETE FROM public.session 
        //     WHERE session_id IN (
        //         SELECT video_id 
        //         FROM public.sections 
        //         WHERE course_id = $1
        //     )
        // `, [course_id]);

        // Delete sections associated with the course
        await query('DELETE FROM public.sections WHERE course_id = $1', [course_id]);

        // Delete comments related to the course
        await query('DELETE FROM public.comment WHERE course_id = $1', [course_id]);

        // Finally, delete the course itself
        await query('DELETE FROM public.course WHERE course_id = $1', [course_id]);

        return { message: 'Course deleted successfully' };
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Withdraws a user from a course by deleting their enrollment records.
 * @param {string} username - The username of the user withdrawing from the course.
 * @param {number} course_id - The ID of the course from which the user is withdrawing.
 * @returns {number} - The number of enrollment records deleted if successful, otherwise false.
 */
const withdrawCourse = async (user_id, course_id) => {
    try {
        // Input validation
        if (!user_id || !course_id) {
            throw new Error('Invalid user_id or course_id.');
        }

        // Check if the enrollment exists
        const checkEnrollment = await query(
            'SELECT * FROM public.enrollment WHERE user_id = $1 AND course_id = $2',
            [user_id, course_id]
        );

        if (checkEnrollment.length === 0) {
            throw new Error('User is not enrolled in the specified course.');
        }

        // Proceed with deletion
        const deleteEnrollment = await query(
            'DELETE FROM public.enrollment WHERE course_id = $1 AND user_id = $2',
            [course_id, user_id]
        );

        return deleteEnrollment;
    } catch (error) {
        console.error(`Error occurred during withdrawal: ${error.message}`);
        throw new Error(error.message);
    }
};




/**
 * Retrieves all courses from the database.
 * @returns {Array} - An array of course objects.
 */
const getAllCourses = async () => {
    try {
        const courses = await query('SELECT * FROM public.course');
        return courses;
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Searches for courses by name.
 * @param {string} name - The name of the course to search for.
 * @returns {Array} - An array of course objects matching the search criteria.
 */
const searchCourseByName = async (name) => {
    try {
        const courses = await query('SELECT * FROM public.course WHERE name ILIKE $1', [`%${name}%`]);
        return courses.rows;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    addCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    withdrawCourse,
    checkIfCourseExistsById,
    searchCourseByName,
    getAllCourses,
    getCourseNameById
}
