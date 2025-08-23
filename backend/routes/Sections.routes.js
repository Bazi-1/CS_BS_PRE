const express = require('express');
const router = express.Router();
// Import controllers
const { 
    createSectionController, 
    updateSectionController, 
    getSectionsController, 
    deleteSectionByIdController 
} = require("../controllers/Sections.controller");  // Note the changed import path
// Import validators
const { 
    createSectionValidator, 
    getSectionsValidator, 
    deleteSectionByIdValidator, 
    updateSectionValidator 
} = require('../validators/Sections.validators');  // Note the changed import path
// Define routes and their respective controllers
router.post('/section', createSectionValidator, createSectionController); // Route to create a section for a course
router.put('/section/:section_id', updateSectionValidator, updateSectionController); // Route to update a section
router.get('/sections', getSectionsValidator, getSectionsController); // Route to get sections for a course
router.delete('/section/:section_id', deleteSectionByIdValidator, deleteSectionByIdController); // Route to delete a section by ID
module.exports = router;
