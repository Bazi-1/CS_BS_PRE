import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ContactService from "../../services/ContactServices.tsx";

interface ContactState {
    alertMessage: string | null;
    alertSeverity: "success" | "error";
}

const initialState: ContactState = {
    alertMessage: null,
    alertSeverity: "success",
};

export const sendContactMessage = createAsyncThunk(
    "contact/sendMessage",
    async (data: { username: string; email: string; subject: string; message: string }, { rejectWithValue }) => {
        try {
            const response = await ContactService.sendMessage(data);
            if (response.data.success) return { message: "Your message has been sent successfully!", severity: "success" };
            return rejectWithValue({ message: response.data.message || "Failed to send message.", severity: "error" });
        } catch {
            return rejectWithValue({ message: "You need to login!", severity: "error" });
        }
    }
);

const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        clearAlert: (state) => {
            state.alertMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendContactMessage.fulfilled, (state, action: any) => {
                state.alertMessage = action.payload.message;
                state.alertSeverity = action.payload.severity;
            })
            .addCase(sendContactMessage.rejected, (state, action: any) => {
                state.alertMessage = action.payload.message;
                state.alertSeverity = action.payload.severity;
            });
    }
});

export const { clearAlert } = contactSlice.actions;
export default contactSlice.reducer;
