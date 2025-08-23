import http from "./http-common.tsx";

const getVideoPathByCourseId = async (course_id: number): Promise<any> => {
    return http.get(`/videos/video/${course_id}`);
};

const VideoService = {
    getVideoPathByCourseId
};

export default VideoService;
