export interface Session {
    session_id: string;
    name: string;
    video_url?: string;
    videoFile?: File | null;
}

export interface Section {
    section_id: string;
    name: string;
    sessions: Session[];
}

export interface Course {
    course_id: string;
    name: string;
    description: string;
    image: string;
    sections: Section[];
}
