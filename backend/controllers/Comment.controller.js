const { validationResult } = require('express-validator');
const { addComment, deleteComment, getComments } = require("../services/Comment.services");
const { checkIfCourseExistsById } = require('../services/Course.services');

/*-- addCommentController */
/**
 * Controller function to add a comment to a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const addCommentController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { course_id, comment } = req.body;

    const username = req.query.username;

    try {
        // Check if the course exists
        const courseExists = await checkIfCourseExistsById(course_id);
        if (!courseExists) {
            return res.status(400).json({ message: "Comment cannot be added to unavailable course!" });
        }

        // Add the comment if the course exists
        const result = await addComment(username, course_id, comment);

        res.status(200).json( { message:"Comment added successfuly!"});

    } catch (error) {
        // If an unexpected error occurred, send internal server error response
        res.status(500).json({ message: "You need to login!" });
    }
};

/*-- getCommentsController */
/**
 * Controller function to get comments for a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing comments or message indicating no comments found.
 */
const getCommentsController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const  {course_id}=  req.query;

    try { 
        const comments = await getComments(course_id);
        if (!comments || comments.length === 0) {
            return res.status(200).json({ message: "No comments found" });
        }

        res.status(200).json({comments})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

/*-- deleteCommentController */
/**
 * Controller function to delete a comment.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const deleteCommentController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { comment_id } = req.body;
    const { course_id } = req.body;
    const username = req.query.username
    try {
        const result = await deleteComment(comment_id, username, course_id);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: `No comment with this id` })
        }

        res.status(200).json({message:'Comment deleted successfully!'});

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addCommentController,
    getCommentsController,
    deleteCommentController,
}
