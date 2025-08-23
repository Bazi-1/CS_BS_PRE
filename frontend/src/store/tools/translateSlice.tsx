import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export const translateText = createAsyncThunk(
    'translate/translateText',
    async ({ sourceLanguage, targetLanguage, text }: { sourceLanguage: string; targetLanguage: string; text: string }) => {
        const response = await fetch("https://text-translator2.p.rapidapi.com/translate", {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "X-RapidAPI-Key": "70a7e9d646msh1390870405bd41cp1fe75ajsn102d61a49923",
                "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
            },
            body: new URLSearchParams({
                source_language: sourceLanguage,
                target_language: targetLanguage,
                text,
            }),
        });

        const result = await response.json();
        return result?.data?.translatedText || '';
    }
);

interface TranslateState {
    inputText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    loading: boolean;
}

const initialState: TranslateState = {
    inputText: '',
    translatedText: '',
    sourceLanguage: 'en',
    targetLanguage: 'id',
    loading: false,
};

const translateSlice = createSlice({
    name: 'translate',
    initialState,
    reducers: {
        setInputText: (state, action: PayloadAction<string>) => {
            state.inputText = action.payload;
        },
        setSourceLanguage: (state, action: PayloadAction<string>) => {
            state.sourceLanguage = action.payload;
        },
        setTargetLanguage: (state, action: PayloadAction<string>) => {
            state.targetLanguage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(translateText.pending, (state) => {
                state.loading = true;
            })
            .addCase(translateText.fulfilled, (state, action) => {
                state.loading = false;
                state.translatedText = action.payload;
            })
            .addCase(translateText.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { setInputText, setSourceLanguage, setTargetLanguage } = translateSlice.actions;
export default translateSlice.reducer;
