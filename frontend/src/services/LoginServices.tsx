
import http from "./http-common.tsx";

const register = (formData) => {
    return http.post(`/users/register`, formData);
}


const login =  (formData)=>{ 
    return http.post('/users/login',formData);
}

const LoginService = {
login,
register
}


export default LoginService;
