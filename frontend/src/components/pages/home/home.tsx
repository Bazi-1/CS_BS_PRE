import React from 'react';
import { Container, Typography } from '@mui/material';
import {
    Subtitle,
    SectionContainer,
    Title,
    ButtonContainer,
    ActionButton,
    AdvantageSection,
    HighlightTextSpan,
    AdvantagesContainer,
    AdvantageItem,
    AdvantageNumber,
    AdvantageHeading,
    AdvantageDescription,
    NewSection,
    SectionTitle,
    SectionSubtitle,
    ExploreButton,
} from './HomeSections.tsx';
import CourseShowcase from '../courses/coursesShowcase.tsx';
import FAQSection from '../help/FAQ.tsx';
import HeroSection from './heroSection.tsx';
import { motion } from 'framer-motion';

const MotionBox = motion.section;


const Home = () => {
    return (
        <Container maxWidth="lg" disableGutters>
            <HeroSection />

            <SectionContainer>
                <Title>Discover our programs</Title>
                <Subtitle>
                    Our courses are designed to provide you with the skills and knowledge
                    you need to excel. Whether you're advancing your career or exploring
                    something new — we’ve got you covered.
                </Subtitle>
                <ButtonContainer>
                    <ActionButton href="/courses">Our Store</ActionButton>
                    <ActionButton href="/contact">Contact Us</ActionButton>
                </ButtonContainer>
            </SectionContainer>

            <CourseShowcase />

            <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <AdvantageSection>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, color:'rgb(229, 165, 222)' }}>
                        Discover our <HighlightTextSpan style={{color:'rgb(132, 89, 132)'}}>main three advantages</HighlightTextSpan>
                    </Typography>

                    <AdvantagesContainer>
                        <AdvantageItem>
                            <AdvantageNumber>1</AdvantageNumber>
                            <AdvantageHeading>Comprehensive Learning Paths</AdvantageHeading>
                            <AdvantageDescription>
                                We offer tailored learning paths that align with your career goals, driving growth and maximizing potential.
                            </AdvantageDescription>
                        </AdvantageItem>

                        <AdvantageItem>
                            <AdvantageNumber>2</AdvantageNumber>
                            <AdvantageHeading>Expert Instructors</AdvantageHeading>
                            <AdvantageDescription>
                                Our team provides continuous support, ensuring your learning journey is smooth and any challenges are addressed promptly.
                            </AdvantageDescription>
                        </AdvantageItem>

                        <AdvantageItem>
                            <AdvantageNumber>3</AdvantageNumber>
                            <AdvantageHeading>Flexible Learning Options</AdvantageHeading>
                            <AdvantageDescription>
                                Benefit from unique collaborations and partnerships that enhance your learning experience and provide valuable insights in the market.
                            </AdvantageDescription>
                        </AdvantageItem>
                    </AdvantagesContainer>
                </AdvantageSection>
            </MotionBox>

            {/* FAQ */}
            <FAQSection />

            {/* Call to Action Section */}
            <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <NewSection>
                    <SectionTitle>Discover our different course categories</SectionTitle>
                    <SectionSubtitle>
                        Ready to enhance your skills? Explore our course catalog today!
                    </SectionSubtitle>
                    <ExploreButton href="/courses">Explore our courses</ExploreButton>
                </NewSection>
            </MotionBox>
        </Container>
    );
};

export default Home;
