
import http from "./http-common.tsx";

const getSessions = (course_id) => {
    return http.get(`/sessions/sessions`, { params: course_id });
}

const deleteSession = (session_id) => {
    return http.delete(`/sessions/${session_id}`);
}

const completeSession = (session_id) => {
    return http.put(`/sessions/complete/${session_id}`, session_id);
}

const addSession = (formdata) => {
    return http.post('/sessions/addSession', formdata);
};

const SessionService = {
    deleteSession,
    getSessions,
    addSession,
    completeSession
}


export default SessionService;
