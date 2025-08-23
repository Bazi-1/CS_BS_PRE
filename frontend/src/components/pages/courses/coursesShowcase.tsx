import { React, Box, Typography, Container, Grid, styled } from '../../imports/imports.tsx'

const SectionContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#ffffff',
});

const ContentBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'left',
});

const Title = styled(Typography)({
    fontSize: '2.5rem',
    fontWeight: 600,
    marginBottom: '20px',
    '@media (max-width: 768px)': {
        fontSize: '2rem',
    },
});

const Subtitle = styled(Typography)({
    fontSize: '1.2rem',
    color: '#6c757d',
    marginBottom: '30px',
});

const FeatureBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
});

const IconWrapper = styled(Box)({
    backgroundColor: '#f8fbfc',
    borderRadius: '8px',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '15px',
});

const FeatureText = styled(Typography)({
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: '5px',
});

const ImageWrapper = styled(Box)({
    textAlign: 'center',
    '@media (max-width: 768px)': {
        marginTop: '20px',
    },
});

const CourseShowcase = () => {
    return (
        <SectionContainer>
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <ContentBox>
                            <Title>
                                Course <span style={{ textDecoration: 'underline', color: 'rgb(229, 165, 222)' }}>showcase</span>
                            </Title>
                            <Subtitle>
                                A features section highlights your courses’ key attributes,
                                engaging visitors and boosting enrollment.
                            </Subtitle>
                            <FeatureBox>
                                <IconWrapper>
                                    ⭐
                                </IconWrapper>
                                <Box>
                                    <FeatureText>Highlights Key Features</FeatureText>
                                    <Typography color="textSecondary" fontSize="0.9rem">
                                        A feature section allows you to clearly showcase the main benefits
                                        and unique aspects of your courses.
                                    </Typography>
                                </Box>
                            </FeatureBox>
                            <FeatureBox>
                                <IconWrapper>
                                    👤
                                </IconWrapper>
                                <Box>
                                    <FeatureText>Interactive Community</FeatureText>
                                    <Typography color="textSecondary" fontSize="0.9rem">
                                        It captures your visitors' attention and helps them quickly understand
                                        the value of your courses.
                                    </Typography>
                                </Box>
                            </FeatureBox>
                            <FeatureBox>
                                <IconWrapper>
                                    ❤️
                                </IconWrapper>
                                <Box>
                                    <FeatureText>Boosts Enrollment</FeatureText>
                                    <Typography color="textSecondary" fontSize="0.9rem">
                                        Organizing and presenting key information effectively increases the
                                        likelihood of turning your visitors into students.
                                    </Typography>
                                </Box>
                            </FeatureBox>
                        </ContentBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ImageWrapper>
                            <img
                                src="http://localhost:3001/images/student.png"
                                alt="Course Showcase Illustration"
                                style={{ width: '100%', maxWidth: '400px' }}
                            />
                        </ImageWrapper>
                    </Grid>
                </Grid>
            </Container>
        </SectionContainer>
    );
};

export default CourseShowcase;
