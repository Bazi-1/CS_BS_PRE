const { validationResult } = require('express-validator');
const {
    createSection,
    updateSection,
    deleteSectionById,
    getSectionsByCourse,
    checkIfSectionExistsById,
} = require("../services/Sections.services.js");

const { checkIfCourseExistsById } = require("../services/Course.services.js");

const createSectionController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }
    const { title, course_id, user_id } = req.body;

    try {
        const sectionId = await createSection(title, course_id, user_id);
        res.status(201).json({ message: 'Section created successfully', section_id: sectionId });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


/*-- updateSectionController */
const updateSectionController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }
    const { section_id } = req.params;
    const { title, course_id, user_id } = req.body;
    try {
        const sectionExists = await checkIfSectionExistsById(section_id);
        if (!sectionExists) {
            return res.status(404).json(`{ message: No section found with id: ${section_id} }`);
        }
        if (course_id) {
            const courseExists = await checkIfCourseExistsById(course_id);
            if (!courseExists) {
                return res.status(400).json(`{ message: No course found with id: ${course_id} }`);
            }
        }
        const result = await updateSection(section_id, title, course_id, user_id);
        if (result > 0) {
            res.status(200).json({ message: 'Section updated successfully' });
        } else {
            res.status(404).json({ message: 'Section not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
/*-- getSectionsController */
const getSectionsController = async (req, res) => {

    const { course_id } = req.query;  // ✅ Read correctly

    if (!course_id) {
        return res.status(400).json({ message: 'Missing course_id' });
    }

    try {
        const sections = await getSectionsByCourse(course_id);
        if (sections.length === 0) {
            return res.status(200).json({ message: 'No sections found for this course.' });
        }

        res.status(200).json({ sections });
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const deleteSectionByIdController = async (req, res) => {
    const { section_id } = req.params;
    try {
        const result = await deleteSectionById(section_id); // Expecting { status, message }

        if (result.status === 200) {
            return res.status(200).json({ status: 200, message: 'Section deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting section:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};

module.exports = {
    createSectionController,
    updateSectionController,
    getSectionsController,
    deleteSectionByIdController,
};