const { query } = require("../database/db");

/**
 * Retrieves courses records for a specific user.
 * @param {string} username - The username of the user.
 * @returns {Array} - Returns an array of courses records for the user.
 */
const getMyCourses = async (user_id) => {
  try {
    console.log(`user id from getMyCourses: ${user_id}`);

    const courseQuery = `SELECT * FROM public.course WHERE user_id = $1`;
    const courseRows = await query(courseQuery, [user_id]);

    return courseRows;
  } catch (error) {
    console.error("Database error:", error); // log the real error
    throw error; // just rethrow the original error
  }
};


/**
 * Deletes a course and all related data created by the user.
 *
 * This includes:
 * - All videos linked to sessions in the course
 * - All notes linked to those sessions (if applicable)
 * - All sessions under the course
 * - All enrollments associated with the course
 * - All sections under the course
 * - All comments on the course
 * - The course itself (if it belongs to the user)
 *
 * @param {*} user_id - The ID of the user who owns the course.
 * @param {*} course_id - The ID of the course to delete.
 * @returns {Promise<{status: number, message: string}>} A status and message indicating the result.
 */
const deleteCourse = async (user_id, course_id) => {
  try {
    // Step 1: Get all session IDs linked to this course
    const sessionSql = `SELECT session_id FROM public.session WHERE course_id = $1`;
    const sessionResults = await query(sessionSql, [course_id]);

    if (sessionResults.length > 0) {
      const sessionIds = sessionResults.map((session) => session.session_id);

      // Step 2: Delete all videos linked to these sessions
      const deleteVideosSql = `DELETE FROM public.video WHERE session_id = ANY($1) RETURNING *`;
      await query(deleteVideosSql, [sessionIds]);

      // Step 3: Delete all notes linked to these sessions (if applicable)
      const deleteNotesSql = `DELETE FROM public.notes WHERE session_id = ANY($1) RETURNING *`;
      await query(deleteNotesSql, [sessionIds]);

      // Step 4: Delete all sessions
      const deleteSessionsSql = `DELETE FROM public.session WHERE course_id = $1 RETURNING *`;
      await query(deleteSessionsSql, [course_id]);
    }

    // Step 5: Delete all enrollments linked to this course
    const deleteEnrollmentsSql = `DELETE FROM public.enrollment WHERE course_id = $1 RETURNING *`;
    await query(deleteEnrollmentsSql, [course_id]);

    // Step 6: Delete all sections linked to this course
    const deleteSectionsSql = `DELETE FROM public.sections WHERE course_id = $1 RETURNING *`;
    await query(deleteSectionsSql, [course_id]);

    // Step 7: Delete all comments linked to this course
    const deleteCommentsSql = `DELETE FROM public.comment WHERE course_id = $1 RETURNING *`;
    await query(deleteCommentsSql, [course_id]);

    // Step 8: Delete the course itself
    const deleteCourseSql = `DELETE FROM public.course WHERE course_id = $1 AND user_id = $2 RETURNING *`;
    const courseResult = await query(deleteCourseSql, [course_id, user_id]);

    if (courseResult.length === 0) {
      return { status: 404, message: "Course not found or unauthorized" };
    }

    return {
      status: 200,
      message: "Course and all related data deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting course and related data:", error);
    return { status: 500, message: "Server error, try again later" };
  }
};

module.exports = {
  getMyCourses,
  deleteCourse,
};
