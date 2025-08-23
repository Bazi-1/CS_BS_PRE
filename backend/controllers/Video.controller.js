const { validationResult } = require('express-validator');
const { uploadVideo, deleteVideo, getVideoById, getVideoByCourseId } = require("../services/Video.services");
const { checkIfVideoExistsByID } = require("../services/Video.services");
const { getCourseNameById } = require('../services/Course.services');

/*-- getVideoByIdController */
/**
 * Controller function to retrieve a video by its ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response containing the video data or error message.
 */
const getVideoByIdController = async (req, res) => {
    const { video_id } = req.params;

    try {
        const videoPath = await getVideoById(video_id);

        if (!videoPath) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ path: videoPath });
    } catch (error) {
        console.error("Error in getVideoByIdController:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


/*-- uploadVideoController */
/**
 * Controller function to upload a video.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const uploadVideoController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    try {

        const {
            title,
            duration,
            description,
            upload_date } = req.body;

        const username = req.cookies.username;

        const result = await uploadVideo(username, title, req.file.filename, duration, description,
            upload_date);

        res.status(200).json({ message: 'File uploaded and video data saved successfully!' });

    } catch (error) {
        res.status(500).json({ message: 'You need to login!' });
    }
};

/*--  getVideoByCourseIdController */
/**
 * Controller function to get a video by course_id.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const getVideoByCourseIdController = async (req, res) => {
    const { course_id } = req.params;


    try {
        const videoSessions = await getVideoByCourseId(course_id); // Fetch session_id + video_url

        if (!videoSessions || videoSessions.length === 0) {
            return res.status(404).json({ message: "No video found for this course." });
        }

        const courseDetails = await getCourseNameById(course_id);

        if (!courseDetails) {
            return res.status(404).json({ message: "Course details not found." });
        }

        const { name, description } = courseDetails;

        res.status(200).json({
            sessions: videoSessions,  // ✅ Update response key
            course_id,
            name,
            description
        });
    } catch (error) {
        console.error("Error in getVideoByCourseIdController:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


/*-- deleteVideoController */
/**
 * Controller function to delete a video by its ID.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response indicating success or failure.
 */
const deleteVideoController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }
    const { video_id } = req.params;
    try {

        const videoExists = await checkIfVideoExistsByID(video_id)
        if (!videoExists) {
            return res.status(400).json({ message: `No video found with ID : ${video_id}` })
        }
        const result = await deleteVideo(video_id);
        if (!result) {
            return res.status(200).json({ message: "Video can not be deleted" });
        }
        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}

module.exports = {
    getVideoByIdController,
    uploadVideoController,
    deleteVideoController,
    getVideoByCourseIdController
};
