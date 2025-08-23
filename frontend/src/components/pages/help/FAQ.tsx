import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store.tsx";
import { setExpandedPanel } from "../../../store/help/FAQSlice.tsx";
import {
    Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid
} from "@mui/material";
import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQContainer = styled(Container)({
    backgroundColor: "#ffffff",
    padding: "40px 20px",
    fontFamily: "'Roboto', sans-serif",
    textAlign: "left",
});

const FAQTitle = styled(Typography)({
    fontSize: "2rem",
    fontWeight: 700,
    color: "#333333",
    marginBottom: "20px",
    fontFamily: "'Roboto', sans-serif",
});

const FAQSubtitle = styled(Typography)({
    fontSize: "1rem",
    fontWeight: 400,
    color: "#6c757d",
    marginBottom: "30px",
    fontFamily: "'Roboto', sans-serif",
})

const StyledAccordion = styled(Accordion)({
    marginBottom: "10px",
    boxShadow: "none",
    "&.Mui-expanded": {
        margin: "10px 0",
    },
});

const StyledAccordionSummary = styled(AccordionSummary)({
    fontSize: "1.1rem",
    fontWeight: 600,
    fontFamily: "'Roboto', sans-serif",
    color: "#333333",
});

const StyledAccordionDetails = styled(AccordionDetails)({
    fontSize: "1rem",
    fontWeight: 400,
    fontFamily: "'Roboto', sans-serif",
    color: "#6c757d",
    paddingTop: "10px",
    paddingBottom: "10px",
});

const ImageContainer = styled("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%",
    margin: "auto",
});

const FAQSection = () => {
    const dispatch = useDispatch();
    const expanded = useSelector((state: RootState) => state.faq.expandedPanel);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        dispatch(setExpandedPanel(isExpanded ? panel : false));
    };

    return (
        <FAQContainer>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                    <FAQTitle>
                        Frequently Asked <span style={{ color: "rgb(218, 139, 212)" }}>questions</span>
                    </FAQTitle>
                    <FAQSubtitle>
                        In this section, you can find answers to frequently asked questions.
                    </FAQSubtitle>

                    <StyledAccordion expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
                        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                            What courses does your company offer?
                        </StyledAccordionSummary>
                        <StyledAccordionDetails>
                            Our company specializes in online courses, skill development, and personalized coaching.
                        </StyledAccordionDetails>
                    </StyledAccordion>

                    <StyledAccordion expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
                        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                            How can I contact course support?
                        </StyledAccordionSummary>
                        <StyledAccordionDetails>
                            You can contact our support team via email at letsscale12@gmail.com or through our live chat.
                        </StyledAccordionDetails>
                    </StyledAccordion>

                    <StyledAccordion expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
                        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                            What is your course completion policy?
                        </StyledAccordionSummary>
                        <StyledAccordionDetails>
                            Learners must complete 80% of the content and pass assessments to earn a certificate.
                        </StyledAccordionDetails>
                    </StyledAccordion>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ImageContainer>
                        <img
                            src="http://localhost:3001/images/people.png"
                            alt="FAQ Illustration"
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    </ImageContainer>
                </Grid>
            </Grid>
        </FAQContainer>
    );
};

export default FAQSection;
