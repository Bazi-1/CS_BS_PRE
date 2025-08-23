const { query } = require("../database/db");

/**
 * Inserts a new comment into the comment table if it doesn't already exist.
 * @param {string} username - The username of the user adding the comment.
 * @param {number} course_id - The ID of the course for which the comment is added.
 * @param {string} comment - The text of the comment.
 * @returns {Object} - Result of the insertion operation.
 */
const addNote = async (noteTitle, noteText, user_id, sessionId) => {
    try {
        const noteSql = 'INSERT INTO public.notes (title, content, user_id,session_id) VALUES ($1, $2, $3,$4)  RETURNING *';
        const values = [noteTitle, noteText, user_id, sessionId];

        const noteResult = await query(noteSql, values);
        return noteResult;

    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Retrieves comments for a specific course.
 * @param {number} course_id - The ID of the course to retrieve comments for.
 * @returns {Array} - An array containing the comments for the specified course.
 */
const getNotes = async (sessionid, user_id) => {
    try {
        const notesSql = 'SELECT * FROM public.notes WHERE session_id = $1 AND user_id = $2 ';
        const notes = await query(notesSql, [sessionid, user_id]);
        return notes;

    } catch (error) {
        throw new Error(error);
    }
}

const getUserNotes = async (user_id) => {
    try {
        const notesSql = `SELECT * FROM public.notes WHERE user_id = $1`;
        const userNotesResult = await query(notesSql, [user_id]);

        const userNotes = userNotesResult;

        if (userNotes.length === 0) {
            return { notes: [] };
        }

        // Extract session_id from the first note (assuming all notes belong to the same session)
        const session_id = userNotes[0].session_id;

        // Fetch related course and section details
        const courseResult = await query(
            `SELECT c.name AS course_title, s.title AS section_title 
             FROM public.session se
             JOIN public.course c ON se.course_id = c.course_id
             JOIN public.sections s ON se.section_id = s.section_id
             WHERE se.session_id = $1`,
            [session_id]
        );

        if (courseResult.length === 0) {
            throw new Error("Course or Section not found");
        }

        const { course_title, section_title } = courseResult[0];

        // Fetch session title
        const sessionResult = await query(
            `SELECT title FROM public.session WHERE session_id = $1`,
            [session_id]
        );
        const session_title = sessionResult[0]?.title || "Unknown Session";

        // Add course, section, and session info to each note
        const notesWithDetails = userNotes.map(note => ({
            ...note,
            course_title,
            section_title,
            session_title
        }));

        return { notes: notesWithDetails };

    } catch (error) {
        console.error("Error fetching user notes:", error);
        throw new Error("Failed to fetch user notes");
    }
};


const updateNote = async (note_id, title, content) => {
    const updateSql = `
        UPDATE notes
        SET title = $1, content = $2, updated_at = NOW()
        WHERE note_id = $3
        RETURNING *;
    `;

    const values = [title, content, note_id];
    const result = await query(updateSql, values);

    return result[0];
};

/**
 * Deletes a comment with the specified ID.
 * @param {number} comment_id - The ID of the comment to delete.
 * @param {number} user_id - The ID of the user who posted the comment.
 * @param {number} course_id - The ID of the course associated with the comment.
 * @returns {boolean} - Returns true if the comment was successfully deleted, otherwise false.
 */
const deleteNoteService = async (note_id, session_id, user_id) => {
    try {
        const deleteSql = 'DELETE FROM public.notes WHERE note_id = $1 AND session_id = $2 AND user_id = $3 RETURNING *';
        const note = await query(deleteSql, [note_id, session_id, user_id]);

        return 200;

    } catch (error) {
        throw new Error(error);
    }

}

module.exports = {
    addNote,
    getNotes,
    updateNote,
    deleteNoteService,
    getUserNotes
}
