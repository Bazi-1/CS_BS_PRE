
import http from "./http-common.tsx";

const addComment = (formData,username) => {
    return http.post('/comments/addComment',formData,{params:{username}})
}

const getComments = (course_id) => {
    return http.get(`/comments/comment`,{params:{course_id}});
};


const deleteComment = (comment_id, course_id,username,) => {
    return http.delete('/comments/deleteComment', {
        data: { comment_id, course_id }, 
        params:{username}
    });
};


const CommentService = {
addComment,
getComments,
deleteComment
}


export default CommentService;
