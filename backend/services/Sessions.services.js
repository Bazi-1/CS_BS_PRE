const { query } = require("../database/db");

const createSession = async ({ section_id, title, course_id, user_id, videofile }) => {
    try {

        const sessionResult = await query(
            "INSERT INTO public.session (section_id, title, course_id, user_id,completed) VALUES ($1, $2, $3, $4,$5) RETURNING session_id",
            [section_id, title, course_id, user_id, "NO"]
        );

        const insertedSessionId = sessionResult[0].session_id;
        await query(
            "INSERT INTO public.video (video_url, session_id) VALUES ($1, $2)",
            [videofile, insertedSessionId]
        );

        return { session_id: insertedSessionId, videofile };
    } catch (error) {
        throw new Error(error);
    }
};

const updateSession = async (session_id, section_id, video_path, user_id, course_id) => {
    try {
        const updateSql = `UPDATE public.session SET section_id = $1, video_path = $2, user_id = $3, course_id = $4 WHERE session_id = $5`;
        const updatedSession = await query(updateSql, [section_id, video_path, user_id, course_id, session_id]);
        return updatedSession.affectedRows;
    } catch (error) {
        throw new Error(error);
    }
};

const checkIfSessionExistsById = async (session_id) => {
    try {
        const sql = `SELECT COUNT(*) AS count FROM public.session WHERE session_id = $1`;
        const result = await query(sql, [session_id]);
        return result[0].count > 0;
    } catch (error) {
        throw new Error(error);
    }
};

const getSessionById = async (session_id) => {
    try {
        const sessionSql = 'SELECT * FROM public.session WHERE session_id = $1';
        const session = await query(sessionSql, [session_id]);
        return session[0];
    } catch (error) {
        throw new Error(error);
    }
};

const getSessionsByUser = async (course_id, user_id) => {
    try {
        const sql = `
            SELECT 
                s.session_id, s.video_path, s.completed, sec.section_id, sec.title 
            FROM public.session AS s
            JOIN public.sections AS sec ON s.section_id = sec.section_id
            WHERE s.course_id = $1 AND s.user_id = $2
        `;
        const sessions = await query(sql, [course_id, user_id]);
        return sessions;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteSessionById = async (session_id) => {
    try {
        // First, delete the associated video if it exists
        await query("DELETE FROM public.video WHERE session_id = $1  RETURNING *", [session_id]);

        // Then delete the session
        await query("DELETE FROM public.session WHERE session_id = $1 RETURNING *", [session_id]);
        return { status: 200, message: `Session deleted successfully` };
    } catch (error) {
        console.error("Error deleting session:", error);
        throw error;
    }
};

const completeSession = async (session_id) => {
    try {
        // Check if session exists
        const sessionExists = await query('SELECT * FROM session WHERE session_id = $1', [session_id]);
        if (sessionExists.rowCount === 0) return { message: 'Session does not exist for this ID' };
        // Mark session as completed
        await query(`UPDATE session SET completed = 'true' WHERE session_id = $1`, [session_id]);
        return { message: 'Session marked as completed' };
    } catch (error) {
        throw new Error(error);
    }
};



module.exports = {
    createSession,
    updateSession,
    getSessionsByUser,
    checkIfSessionExistsById,
    deleteSessionById,
    completeSession
};
