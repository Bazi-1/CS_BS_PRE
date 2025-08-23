import SectionService from "../../../../../services/Sections.tsx";

export const deleteSection = async (section_id: number) => {
        try {
            const result = await SectionService.deleteSection(section_id);
            if (result.status === 200) {
                window.location.href = "/MyCourses";
            } else {
                console.warn("Failed to delete section.");
            }
        } catch (error) {
            console.error("Error deleting section:", error);
        }
    };