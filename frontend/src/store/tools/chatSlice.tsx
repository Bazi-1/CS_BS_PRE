import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type Message = {
    role: 'user' | 'system';
    content: string;
};

interface ChatState {
    messages: Message[];
    inputValue: string;
    loading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    messages: [],
    inputValue: '',
    loading: false,
    error: null,
};

export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (input: string, { rejectWithValue }) => {
        const userMessage: Message = { role: 'user', content: input };

        try {
            const response = await axios.post(
                "https://chatgpt-42.p.rapidapi.com/gpt4",
                {
                    messages: [userMessage],
                    web_access: false
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-RapidAPI-Key": "3a47707ed8msha5c5625c64d185ep1814c5jsnbcdfd0c9cc52",
                        "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com"
                    }
                }
            );
            const aiMessage: Message = {
                role: 'system',
                content: response.data.result || "Sorry, I didn't understand that."
            };

            return { userMessage, aiMessage };
        } catch (error) {
            return rejectWithValue("An error occurred. Please try again.");
        }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setInputValue: (state, action: PayloadAction<string>) => {
            state.inputValue = action.payload;
        },
        clearInput: (state) => {
            state.inputValue = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push(action.payload.userMessage, action.payload.aiMessage);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.messages.push({ role: 'system', content: action.payload as string });
            });
    }
});

export const { setInputValue, clearInput } = chatSlice.actions;
export default chatSlice.reducer;
