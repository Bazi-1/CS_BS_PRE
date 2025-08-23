const { validationResult } = require('express-validator');
const {
    createSession,
    updateSession,
    deleteSessionById,
    checkIfSessionExistsById,
    getSessionsByUser,
    completeSession
} = require("../services/Sessions.services.js");
const { checkIfCourseExistsById } = require("../services/Course.services.js");
const { checkIfSectionExistsById } = require("../services/Sections.services.js");
/*-- createSessionController */

const createSessionController = async (req, res) => {
    try {
        // Extract request body data
        const { user_id, course_id, session_ids, section_ids, titles } = req.body;

        if (!user_id || !course_id || !session_ids || !section_ids || !titles || !req.files || req.files.length === 0) {
            return res.status(400).json({ error: "Missing required fields or videos" });
        }

        // Parse JSON strings to arrays
        const sessionIdArray = JSON.parse(session_ids);
        const sectionIdArray = JSON.parse(section_ids);
        const titleArray = JSON.parse(titles);

        // Validate array lengths
        if (sessionIdArray.length !== req.files.length || sessionIdArray.length !== sectionIdArray.length || sessionIdArray.length !== titleArray.length) {
            return res.status(400).json({ error: "Session IDs, section IDs, titles, and videos count mismatch" });
        }

        let uploadedSessions = [];

        // Process each session
        for (let i = 0; i < sessionIdArray.length; i++) {
            const sessionData = {
                section_id: sectionIdArray[i],
                title: titleArray[i],
                course_id,
                user_id,
                videofile: req.files[i].filename
            };

            // Send data to service
            const newSession = await createSession(sessionData);

            uploadedSessions.push(newSession);
        }

        return res.status(200).json({
            message: "Sessions added successfully!",
            sessions: uploadedSessions,
        });

    } catch (error) {
        console.error("Error creating session:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

/*-- updateSessionController */
const updateSessionController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }
    const { session_id } = req.params;
    const { section_id, video_path, completed, user_id, course_id } = req.body;
    try {
        const sessionExists = await checkIfSessionExistsById(session_id);
        if (!sessionExists) {
            return res.status(404).json(`{ message: No session found with id: ${session_id} }`);
        }
        // Optional: Check if course and section exist, if you're updating those fields
        if (course_id) {
            const courseExists = await checkIfCourseExistsById(course_id);
            if (!courseExists) {
                return res.status(400).json(`{ message: No course found with id: ${course_id} }`);
            }
        }
        if (section_id) {
            const sectionExists = await checkIfSectionExistsById(section_id);
            if (!sectionExists) {
                return res.status(400).json(`{ message: No section found with id: ${section_id} }`);
            }
        }
        const result = await updateSession(session_id, section_id, video_path, completed, user_id, course_id);
        if (result > 0) {
            res.status(200).json({ message: 'Session updated successfully' });
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*-- getSessionsController */
const getSessionsController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { course_id, user_id } = req.query; // Include user_id in the query

    try {
        // Check if course exists
        const courseExists = await checkIfCourseExistsById(course_id);
        if (!courseExists) {
            return res.status(400).json({ message: `No course found with id: ${course_id}` });
        }

        // ✅ Get only sessions created by the user
        const sessions = await getSessionsByUser(course_id, user_id);
        if (sessions.length === 0) {
            return res.status(200).json({ message: "No sessions found for this user in this course." });
        }

        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/*-- deleteSessionByIdController */

const deleteSessionByIdController = async (req, res) => {
    try {
        const {session_id} = req.params;

        const result = await deleteSessionById(session_id);
        if (result) {
            return res.status(200).json({ message: "Session deleted successfully." });
        } else {
            return res.status(404).json({ message: "Session not found." });
        }
    } catch (error) {
        console.error("Error deleting session:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const completeSessionController= async (req, res) => {
    const { session_id } = req.params;

    try {
        const result = await completeSession(session_id);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error completing session:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createSessionController,
    updateSessionController,
    getSessionsController,
    deleteSessionByIdController,
    completeSessionController
};