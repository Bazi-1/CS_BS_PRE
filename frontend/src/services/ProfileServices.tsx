import http from "./http-common.tsx";

const updateUsername = (user_id,username) => {
    return http.put('/users/username', {username}, {params: {user_id}}
);

}

const updateEmail = (user_id, email) => {
    return http.put('/users/email', { email }, { params: { user_id } })
}

const updatePassword = (user_id, password) => {
    return http.put('/users/password', { password }, { params: { user_id } })
}

const uploadProfilePic = (formData) => {
    return http.post(`/users/upload-profile-pic`, formData, {
        withCredentials: true, 
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

const ProfileService = {
    updateUsername,
    updateEmail,
    updatePassword,
    uploadProfilePic
}


export default ProfileService;
