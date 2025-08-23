
import http from "./http-common.tsx";

const getSections = (course_id) => {
    return http.get(`/sections/sections`, { params: { course_id } }); 
};

const addSection=(title,course_id,user_id)=>{
    return http.post(`/sections/section`,{title,course_id,user_id});
}

const deleteSection = (section_id) => {
    return http.delete(`/sections/section/${section_id}`); // Use the section_id directly in the URL
};


const SectionService = {
getSections,
addSection,
deleteSection
}


export default SectionService;
