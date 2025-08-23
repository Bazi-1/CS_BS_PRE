import http from "./http-common.tsx";

const sendMessage = (formData) => {
    return http.post(`/contacts/sendMessage`, formData);
};

const ContactService = {
    sendMessage,
};

export default ContactService;
