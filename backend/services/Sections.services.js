const { query } = require("../database/db");

const createSection = async (title, course_id, user_id) => {
    try {
        // 1. Insert the new section into the sections table
        const sectionSql = 'INSERT INTO public.sections (title, course_id, user_id) VALUES ($1, $2, $3) RETURNING section_id';
        const addedSection = await query(sectionSql, [title, course_id, user_id]);
        const sectionId = addedSection[0].section_id;

        return sectionId;
    } catch (error) {
        throw new Error(`Error in createSection: ${error.message}`);
    }
};


const updateSection = async (section_id, title, course_id, user_id) => {
    try {
        // SQL query to update the section
        const updateSql = 'UPDATE public.sections SET title = $1, course_id = $2, user_id = $3 WHERE section_id = $4';
        const updatedSection = await query(updateSql, [title, course_id, user_id, section_id]);

        return updatedSection.affectedRows;
    } catch (error) {
        throw new Error(error);
    }

};

const checkIfSectionExistsById = async (section_id) => {
    try {
        const sql = 'SELECT COUNT(*) AS count FROM public.sections WHERE section_id = $1';
        const result = await query(sql, [section_id]);
        return result[0].count > 0;
    } catch (error) {
        throw new Error(error);
    }
};

const getSectionsByCourse = async (course_id) => {
    try {
        const sectionsSql = `
        SELECT 
            s.section_id,
            s.title AS section_title,   
            ses.session_id,
            ses.title AS session_title, 
            ses.completed,
            v.video_url
        FROM public.sections AS s
        LEFT JOIN public.session AS ses ON s.section_id = ses.section_id  
        LEFT JOIN public.video AS v ON ses.session_id = v.session_id
        WHERE s.course_id = $1
        ORDER BY s.section_id ASC, ses.session_id ASC
    `;

        const rows = await query(sectionsSql, [course_id]);

        const sections = rows.reduce((acc, row) => {
            const { section_id, section_title, session_id, session_title, completed, video_url } = row;

            let section = acc.find(sec => sec.section_id === section_id);
            if (!section) {
                section = {
                    section_id,
                    title: section_title,
                    sessions: []
                };
                acc.push(section);
            }

            if (session_id) {
                let session = section.sessions.find(sess => sess.session_id === session_id);
                if (!session) {
                    session = {
                        session_id,
                        title: session_title,
                        completed: completed,
                        video_url: video_url || null // Ensure null if no video found
                    };
                    section.sessions.push(session);
                }
            }

            return acc;
        }, []);

        return sections;
    } catch (error) {
        throw new Error(error);
    }
};


const deleteSectionById = async (section_id) => {
    try {
        // Step 1: Get all session IDs linked to this section
        const sessionSql = `SELECT session_id FROM public.session WHERE section_id = $1`;
        const sessionResults = await query(sessionSql, [section_id]);

        if (sessionResults.length > 0) {
            // Extract session IDs as an array of integers
            const sessionIds = sessionResults.map(session => session.session_id);

            // Step 2: Delete all videos linked to these sessions
            const deleteVideosSql = `DELETE FROM public.video WHERE session_id = ANY($1) RETURNING *`;
            await query(deleteVideosSql, [sessionIds]);

            // Step 3: Delete all sessions
            const deleteSessionsSql = `DELETE FROM public.session WHERE section_id = $1 RETURNING *`;
            await query(deleteSessionsSql, [section_id]);

        }

        // Step 4: Delete the section itself
        const deleteSectionSql = `DELETE FROM public.sections WHERE section_id = $1 RETURNING *`;
        const sectionResult = await query(deleteSectionSql, [section_id]);

        if (sectionResult.length === 0) {
            return { status: 404, message: "Section not found" };
        }

        return { status: 200, message: "Section, its sessions, and related videos deleted successfully" };
    } catch (error) {
        console.error("Error deleting section and sessions:", error);
        return { status: 500, message: "Server error, try again later" };
    }
};



module.exports = {
    createSection,
    updateSection,
    getSectionsByCourse,
    checkIfSectionExistsById,
    deleteSectionById
};