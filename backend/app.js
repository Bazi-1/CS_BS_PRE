const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const bodyParser = require('body-parser'); // Parse request bodies
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const cookieParser = require('cookie-parser'); // Parse cookies
const methodOverride = require('method-override');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const rootSchema = require('./graphql/index');


const port = process.env.PORT || 3001; // Set server port
const app = express(); // Initialize Express application
app.use(express.static('public')); // Serve static files from 'public' directory
// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(methodOverride('_method')); // Handles method override for PUT/DELETE
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json());
app.use(cookieParser()); // Parse cookies
//app.use(cors({ origin: '*' })); // Enable CORS for all origins
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
const ejs = require("ejs"); // Templating engine

app.set("view engine", "ejs"); // Set EJS as the view engine

app.use(cors());


// Import route modules
const users = require('./routes/User.routes');
const courses = require('./routes/Course.routes');
const sessions = require('./routes/Sessions.routes');
const contacts = require('./routes/Contact.routes');
const comments = require('./routes/Comment.routes');
const enrollments = require('./routes/Enrollment.routes');
const videos = require('./routes/Video.routes');
const my_courses = require('./routes/me.routes')
const sections = require('./routes/Sections.routes')
// Mount route handlers for API endpoints
app.use('/users', users);
app.use('/courses', courses);
app.use('/sessions', sessions);
app.use('/contacts', contacts);
app.use('/comments', comments);
app.use('/enrollments', enrollments);
app.use('/videos', videos);
app.use('/myCourses', my_courses)
app.use('/sections', sections);

const apiKey = process.env.OPENAI_API_KEY;

app.post('/api/get-response', async (req, res) => {
    const { userMessage } = req.body;
    try {
        const openAIResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
            max_tokens: 150,
        }, {
            headers: {
                'Authorization': `Bearer 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`
            },
        });
        res.json({ response: openAIResponse.data.choices[0].message.content.trim() });
    } catch (error) {
        res.status(500).send('Error generating response');
    }
});


// Start server and listen on specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Mount GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema:rootSchema,
    graphiql: true,
}));
