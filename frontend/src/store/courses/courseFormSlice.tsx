import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Session = { name: string; video_url: any; video: File | null };
type SessionsState = Record<string, Session[]>;

interface CourseFormState {
    formData: { name: string; description: string; image: File | null };
    sections: string[];
    sessions: SessionsState;
    currentSection: string | null;
    sectionName: string;
    numLectures: number;
    message: string | null;
    messageColor: string;
}

const initialState: CourseFormState = {
    formData: { name: '', description: '', image: null },
    sections: [],
    sessions: {},
    currentSection: null,
    sectionName: '',
    numLectures: 1,
    message: null,
    messageColor: '#7ce0a8',
};

const courseFormSlice = createSlice({
    name: 'courseForm',
    initialState,
    reducers: {
        updateFormData(state, action: PayloadAction<{ name: string; value: string }>) {
            state.formData[action.payload.name] = action.payload.value;
        },
        setImage(state, action: PayloadAction<File>) {
            state.formData.image = action.payload;
        },
        setSections(state, action: PayloadAction<string[]>) {
            state.sections = action.payload;
        },
        setCurrentSection(state, action: PayloadAction<string>) {
            state.currentSection = action.payload;
            state.sectionName = action.payload;
        },
        setSectionName(state, action: PayloadAction<string>) {
            state.sectionName = action.payload;
        },
        setNumLectures(state, action: PayloadAction<number>) {
            state.numLectures = action.payload;
        },
        updateSessionName(state, action: PayloadAction<{ section: string; index: number; name: string }>) {
            state.sessions[action.payload.section][action.payload.index].name = action.payload.name;
        },
        setSessionVideo(state, action: PayloadAction<{ section: string; index: number; video_url: File }>) {
            state.sessions[action.payload.section][action.payload.index].video_url = action.payload.video_url;
        },
        saveSection(state) {
            const title = state.sectionName;
            if (!state.sessions[title]) {
                state.sessions[title] = Array.from({ length: state.numLectures }, (_, i) => ({
                    name: `Session ${i + 1}`,
                    video_url: '',
                    video: null,
                }));
            }
            state.sections = state.sections.map((s) => (s === state.currentSection ? title : s));
        },
        setMessage(state, action: PayloadAction<{ message: string; color: string }>) {
            state.message = action.payload.message;
            state.messageColor = action.payload.color;
        },
    },
});

export const {
    updateFormData, setImage, setSections, setCurrentSection, setSectionName,
    setNumLectures, updateSessionName, setSessionVideo, saveSection, setMessage
} = courseFormSlice.actions;

export default courseFormSlice.reducer;
