const { check } = require('express-validator');
/*-- createSectionValidator */
// Validates the request body for creating a new section.
const createSectionValidator = [
    check('title').notEmpty().withMessage('Title is required'),
    check('course_id').notEmpty().withMessage('Course ID is required'),
    check('course_id').isInt().withMessage('Invalid course ID'),
    check('user_id').optional().isInt().withMessage('Invalid user ID'), // Optional field
];
/*-- getSectionsValidator */
// Validates the request parameters for retrieving sections of a course.
const getSectionsValidator = [
    check('course_id').notEmpty().withMessage('Course ID is required'),
    check('course_id').isInt().withMessage('Invalid course ID'),
];
/*-- deleteSectionByIdValidator */
// Validates the request parameters for deleting a section by its ID.
const deleteSectionByIdValidator = [
    check('section_id').notEmpty().withMessage('Section ID is required'),
    check('section_id').isInt().withMessage('Invalid section ID'),
];
/*-- updateSectionValidator */
// Validates the request parameters for updating a section.
const updateSectionValidator = [
    check('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
    check('course_id').optional().isInt().withMessage('Invalid course ID'),  // Optional field
    check('user_id').optional().isInt().withMessage('Invalid user ID'), // Optional field
];
module.exports = {
    createSectionValidator,
    getSectionsValidator,
    deleteSectionByIdValidator,
    updateSectionValidator,
};
