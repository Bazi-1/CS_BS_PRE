import React from "react";
import {
    AppBar, Toolbar, Typography, TextField,
    InputAdornment, IconButton, Container
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store.tsx";
import { setInputValue, sendMessage, clearInput } from "../../../store/tools/chatSlice.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { main: "#f48fb1" }, // soft pink
        background: {
            default: "#fff0f5",       // lavender blush
            paper: "#ffe4e1",         // misty rose
        },
        text: {
            primary: "#4a0033",       // deep rose
            secondary: "#880e4f",     // dark pink
        },
        divider: "#f8bbd0"
    }
});


const Bots = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { messages, inputValue } = useSelector((state: RootState) => state.chat);

    const handleSend = () => {
        if (inputValue.trim() !== '') {
            dispatch(sendMessage(inputValue));
            dispatch(clearInput());
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default }}>
                <AppBar position="static" style={{ backgroundColor: theme.palette.background.paper,marginTop:'5.5%' }}>
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1, color: theme.palette.text.primary }}>
                            ChatGPT 4 (via RapidAPI)
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="sm" style={{ overflowY: "auto", flex: 1, padding: theme.spacing(2) }}>
                    {messages.map((msg, idx) => (
                        <Typography key={idx} style={{ color: theme.palette.text.primary, marginBottom: 8 }}>
                            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
                        </Typography>
                    ))}
                </Container>

                <div style={{ padding: theme.spacing(2) }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Ask ChatGPT..."
                        value={inputValue}
                        onChange={(e) => dispatch(setInputValue(e.target.value))}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSend} style={{ color: theme.palette.primary.main }}>
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        style={{ background: theme.palette.background.paper, borderRadius: 4 }}
                    />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Bots;
