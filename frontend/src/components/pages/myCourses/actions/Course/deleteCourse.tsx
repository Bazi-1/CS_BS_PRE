import MeService from "../../../../../services/MeServices.tsx";

export const deleteCourse = async (user_id: number, course_id: number) => {
        try {
            const result = await MeService.deleteCourse(user_id, course_id);
            if (result.status === 200) {
                window.location.href = '/MyCourses'
            } else {
                console.warn("Failed to delete session.");
            }
        } catch (error) {
            console.log("Error deleting course", error)

        }
    }
