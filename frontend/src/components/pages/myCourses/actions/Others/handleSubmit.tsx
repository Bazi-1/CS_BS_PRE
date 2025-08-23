import SessionService from "../../../../../services/SessionsServices.tsx";
import { Course } from "../../interfaces/course";
import {React} from '../../../../imports/imports.tsx'

export const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    selectedCourse: Course,
    user_id: number
) => {
    event.preventDefault();
    if (!selectedCourse) return;

    try {
        const formData = new FormData();
        formData.append("course_id", selectedCourse.course_id);
        formData.append("user_id", String(user_id));

        let sessionIds: string[] = [];
        let sectionIds: string[] = [];
        let titles: string[] = [];

        selectedCourse.sections.forEach((section) => {
            section.sessions.forEach((session) => {
                if (session.videoFile) {
                    formData.append("videos", session.videoFile);
                    sessionIds.push(session.session_id);
                    sectionIds.push(section.section_id);
                    titles.push(session.name);
                }
            });
        });

        formData.append("session_ids", JSON.stringify(sessionIds));
        formData.append("section_ids", JSON.stringify(sectionIds));
        formData.append("titles", JSON.stringify(titles));

        const response = await SessionService.addSession(formData);

        if (response.status === 200) {
            window.location.href = "/MyCourses";
        } else {
            alert("Failed to add session.");
        }
    } catch (error) {
        console.error("Error uploading videos:", error);
        alert("Error uploading videos.");
    }
};
