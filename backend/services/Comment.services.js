const { query } = require("../database/db");

/**
 * Inserts a new comment into the comment table if it doesn't already exist.
 * @param {string} username - The username of the user adding the comment.
 * @param {number} course_id - The ID of the course for which the comment is added.
 * @param {string} comment - The text of the comment.
 * @returns {Object} - Result of the insertion operation.
 */
const addComment = async (username, course_id, comment) => {
    try {
        const userQuery = 'SELECT user_id FROM public.users WHERE username = $1';
        const userRows = await query(userQuery, [username]);

        if (!userRows || !userRows.length) {
            throw new Error('User not found');
        }

        const user_id = userRows[0].user_id;

        const commentSql = 'INSERT INTO public.comment (user_id, course_id, comment,updated_at = NOW()) VALUES ($1, $2, $3)';
        const values = [user_id, course_id, comment];

        const commentResult = await query(commentSql, values);
        return commentResult;

    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Checks if a comment exists for a given user and course ID.
 * @param {number} user_id - The ID of the user.
 * @param {number} course_id - The ID of the course.
 * @returns {boolean} - Returns true if a comment exists for the user and course, otherwise false.
 */
const checkCommentIfExistsById = async (user_id, course_id) => {
    try {
        const sql = 'SELECT * FROM public.comment WHERE user_id = $1 AND course_id = $2';
        const values = [user_id, course_id];

        const result = await query(sql, values);
        return result.length > 0;

    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Retrieves comments for a specific course.
 * @param {number} course_id - The ID of the course to retrieve comments for.
 * @returns {Array} - An array containing the comments for the specified course.
 */
const getComments = async (course_id) => {
    try {
        const commentsSql = 'SELECT * FROM public.comment WHERE course_id = $1';
        const comments = await query(commentsSql, [course_id]);

        return comments;

    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Deletes a comment with the specified ID.
 * @param {number} comment_id - The ID of the comment to delete.
 * @param {number} user_id - The ID of the user who posted the comment.
 * @param {number} course_id - The ID of the course associated with the comment.
 * @returns {boolean} - Returns true if the comment was successfully deleted, otherwise false.
 */
const deleteComment = async (comment_id, username, course_id) => {
    try {
        const userQuery = 'SELECT user_id FROM public.users WHERE username = $1';
        const userRows = await query(userQuery, [username]);

        if (!userRows || !userRows.length) {
            throw new Error('User not found');
        }

        const user_id = userRows[0].user_id;
        const commentExists = await checkCommentIfExistsById(user_id, course_id);

        if (!commentExists) {
            return false;
        }

        const deleteSql = 'DELETE FROM public.comment WHERE comment_id = $1';
        const comment = await query(deleteSql, [comment_id]);

        return comment.rowCount > 0;

    } catch (error) {
        throw new Error(error);
    }

}

module.exports = {
    addComment,
    getComments,
    deleteComment,
    checkCommentIfExistsById
}
