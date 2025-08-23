import SessionService from "../../../../../services/SessionsServices.tsx";

export const deleteSession = async (session_id: string) => {
        try {
            const result = await SessionService.deleteSession(session_id);
            if (result.status === 200) {
                window.location.href = '/MyCourses'
            } else {
                console.warn("Failed to delete session.");
            }
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    };