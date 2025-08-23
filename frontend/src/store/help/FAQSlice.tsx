import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FAQState {
    expandedPanel: string | false;
}

const initialState: FAQState = {
    expandedPanel: false,
};

const faqSlice = createSlice({
    name: 'faq',
    initialState,
    reducers: {
        setExpandedPanel: (state, action: PayloadAction<string | false>) => {
            state.expandedPanel = action.payload;
        },
    },
});

export const { setExpandedPanel } = faqSlice.actions;
export default faqSlice.reducer;
