import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import NoteService from "../../services/NotesServices.tsx";

interface Note {
    note_id: number;
    title: string;
    session_id: number;
    content: string;
    course_title: string;
    section_title: string;
    session_title: string;
    created_at: string;
    updated_at: string;
}

interface NotesState {
    notes: Note[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NotesState = {
    notes: [],
    status: 'idle',
    error: null
};

export const fetchUserNotes = createAsyncThunk(
    'notes/fetchUserNotes',
    async (user_id: number) => {
        const response = await NoteService.getUserNotes(user_id);
        return response.data.data.userNotes;
    }
);

export const addUserNote = createAsyncThunk(
    'notes/addUserNote',
    async (formData: {
        noteTitle: string;
        noteText: string;
        user_id: number;
        sessionId: number;
    }) => {
        const newNote = await NoteService.addNote(formData);
        return newNote;
    }
);

export const updateUserNote = createAsyncThunk(
    'notes/updateUserNote',
    async ({ note_id, updatedNote }: { note_id: number; updatedNote: Note }) => {
        await NoteService.updateNote(note_id, updatedNote);
        return updatedNote;
    }
);

export const deleteUserNote = createAsyncThunk(
    'notes/deleteUserNote',
    async ({ note_id, session_id, user_id }: { note_id: number; session_id: number; user_id: number }) => {
        await NoteService.deleteNote(note_id, { session_id: session_id, user_id });
        return note_id;
    }
);

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
                state.status = 'succeeded';
                state.notes = action.payload;
            })
            .addCase(fetchUserNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || "Failed to fetch notes";
            })
            .addCase(updateUserNote.fulfilled, (state, action: PayloadAction<Note>) => {
                state.notes = state.notes.map((note) =>
                    note.note_id === action.payload.note_id ? action.payload : note
                );
            })
            .addCase(addUserNote.fulfilled, (state, action: PayloadAction<Note>) => {
                state.notes.push(action.payload);
            })
            .addCase(deleteUserNote.fulfilled, (state, action: PayloadAction<number>) => {
                state.notes = state.notes.filter((note) => note.note_id !== action.payload);
            });
    },
});

export default notesSlice.reducer;
