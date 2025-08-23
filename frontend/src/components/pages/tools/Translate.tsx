import React from "react";
import {
  Button, Paper, Select, MenuItem, InputLabel, FormControl,
  Container, Typography, Box, IconButton
} from "@mui/material";
import { VolumeUp } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import supportedLanguages from "../../reusables/CountryLanguages.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store.tsx";
import {
  setInputText, setSourceLanguage, setTargetLanguage, translateText
} from "../../../store/tools/translateSlice.tsx";

const Translate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    inputText,
    translatedText,
    sourceLanguage,
    targetLanguage,
    loading,
  } = useSelector((state: RootState) => state.translate);

  const handleTranslate = () => {
    dispatch(translateText({ sourceLanguage, targetLanguage, text: inputText }));
  };

  const handlePronunciation = () => {
    if (!translatedText) return;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLanguage;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", py: 4, background: "linear-gradient(to bottom,rgb(221, 206, 211),rgb(242, 207, 248))" }}>
      <IconButton sx={{ marginTop: '4%', position: 'absolute', top: 20, left: 20, color: 'black' }} onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>

      <Paper elevation={8} sx={{ p: 4, borderRadius: 4, width: "90%", maxWidth: 700, marginTop: '4%', backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(180, 130, 210, 0.3)" }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" color="#5f2b8a" gutterBottom>
          🌟 Smart Translator
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <FormControl fullWidth>
            <InputLabel>From</InputLabel>
            <Select value={sourceLanguage} label="From" onChange={(e) => dispatch(setSourceLanguage(e.target.value))}>
              {supportedLanguages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>To</InputLabel>
            <Select value={targetLanguage} label="To" onChange={(e) => dispatch(setTargetLanguage(e.target.value))}>
              {supportedLanguages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextareaAutosize
          placeholder="Type something to translate..."
          minRows={3}
          value={inputText}
          onChange={(e) => dispatch(setInputText(e.target.value))}
          style={{ width: "100%", padding: "16px", fontSize: "16px", borderRadius: "10px", border: "1px solid #ccc", background: "#fafafa", marginBottom: "20px" }}
        />

        <Button
          onClick={handleTranslate}
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            background: "linear-gradient(135deg, #ba68c8, #ce93d8)",
            color: "white",
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1rem",
            mb: 3,
            borderRadius: "10px",
            textTransform: "none",
            ":hover": {
              background: "linear-gradient(135deg, #ab47bc, #f48fb1)",
            },
          }}
        >
          {loading ? "Translating..." : "Translate"}
        </Button>

        <TextareaAutosize
          readOnly
          minRows={3}
          value={translatedText}
          placeholder="Translated text will appear here..."
          style={{ width: "100%", padding: "16px", fontSize: "16px", borderRadius: "10px", border: "1px solid #ddd", background: "#f3e8f9", marginBottom: "20px", resize: "none", color: "#333" }}
        />

        <Button
          onClick={handlePronunciation}
          fullWidth
          variant="outlined"
          startIcon={<VolumeUp />}
          sx={{
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
            color: "#8e24aa",
            borderColor: "#ba68c8",
            ":hover": {
              background: "#f3e5f5",
              borderColor: "#ab47bc",
            },
          }}
        >
          Pronounce
        </Button>
      </Paper>
    </Container>
  );
};

export default Translate;
