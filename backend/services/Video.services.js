const { query } = require("../database/db");

const getVideoById = async (video_id) => {
    try {
        let videoSql = `SELECT video_url FROM public.video WHERE video_id = $1`;
        const video = await query(videoSql, [video_id]);

        if (video.length === 0) {
            throw new Error(`No video found with ID ${video_id}`);
        }

        return video[0].video_url; // Return the URL directly
    } catch (error) {
        console.error("Error in getVideoById:", error.message);
        throw new Error("Failed to fetch video by ID");
    }
};


const checkIfVideoExistsByID = async (video_id) => {
    try {
        let sql = `SELECT COUNT(*) as count FROM public.video WHERE video_id = $1`;
        const result = await query(sql, [video_id]);
        return result[0].count > 0;
    } catch (error) {
        throw new Error(error);
    }
};

const getVideoByCourseId = async (course_id) => {
    try {

        // Step 1: Get all session_ids for the given course_id
        let sqlSession = `SELECT session_id FROM session WHERE course_id = $1`;
        const sessionResult = await query(sqlSession, [course_id]);


        // Check if sessionResult is valid
        if (!sessionResult || sessionResult.length === 0) {
            console.warn(`No sessions found for course with ID ${course_id}`);
            return null;
        }

        // Step 2: Create an array to store session_id and corresponding video_url pairs
        const videoData = [];

        // Iterate through all sessions and get video_url for each session_id
        for (const session of sessionResult) {
            const session_id = session.session_id;
            let sqlVideo = `SELECT video_url FROM video WHERE session_id = $1`;
            const videoResult = await query(sqlVideo, [session_id]);


            // Ensure that videoResult has rows and properly extract the video_url
            const videoUrl = videoResult;


            // Add session_id and video_url to the videoData array
            videoData.push({
                session_id: session_id,
                video_url: videoUrl
            });
        }

        // Step 3: Return videoData array containing session_id and video_url for each session
        return videoData;

    } catch (error) {
        console.error("Error in getVideoByCourseId:", error.message);
        throw new Error("Failed to fetch video by course ID");
    }
};





const uploadVideo = async (username, title, URL, duration, description, upload_date) => {
    try {
        const userQuery = 'SELECT user_id FROM public.users WHERE username = $1';
        const userRows = await query(userQuery, [username]);

        if (!userRows || userRows.length === 0) {
            throw new Error('User not found');
        }

        const user_id = userRows[0].user_id;

        const sessionQuery = 'SELECT session_id FROM public.session WHERE user_id = $1';
        const sessionRows = await query(sessionQuery, [user_id]);

        if (!sessionRows || sessionRows.length === 0) {
            throw new Error('Session not found');
        }

        const session_id = sessionRows[0].session_id;

        const uploadSql = `INSERT INTO public.video (session_id, title, URL, duration, description, upload_date) 
                            VALUES ($1, $2, $3, $4, $5, $6)`;

        const uploadedVideo = await query(uploadSql, [session_id, title, URL, duration, description, upload_date]);

        return uploadedVideo;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteVideo = async (video_id) => {
    try {
        let deleteSql = `DELETE FROM public.video WHERE video_id = $1`;
        const deletedVideo = await query(deleteSql, [video_id]);

        return deletedVideo.affectedRows > 0;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    getVideoById,
    uploadVideo,
    deleteVideo,
    getVideoByCourseId,
    checkIfVideoExistsByID
};