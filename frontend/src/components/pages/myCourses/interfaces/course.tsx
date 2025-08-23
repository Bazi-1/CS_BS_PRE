interface Session {
    session_id: string;
    name: string;
    video_url: string;
    videoFile?: File
}


interface Section {
    section_id: string;
    name: string;
    number_of_sessions: number;
    sessions: Session[];
}

export interface Course {
    course_id: string;
    name: string;
    image: string;
    instructor:string;
    description: string;
    sections: Section[];
}