//this is where all our express stuff happens (routes)
const app = require('./server').app;
const jwt = require('jsonwebtoken');
const linkSecret = "jwiroido29edn2u3idnsjsal";
const { v4: uuidv4 } = require('uuid');
const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const bodyParser = require('body-parser'); // Parse request bodies
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const cookieParser = require('cookie-parser'); // Parse cookies
const methodOverride = require('method-override');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const rootSchema = require('./graphql/index');
require('./socketServer');
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


// Mount GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema:rootSchema,
    graphiql: true,
}));


//normally this would be persistent data... db, api, file, etc.
const professionalAppointments = [{
    professionalsFullName: "Peter Chan, J.D.",
    apptDate: Date.now() + 500000,
    uuid:1,
    clientName: "Jim Jones",
},{
    professionalsFullName: "Peter Chan, J.D.",
    apptDate: Date.now() - 2000000,
    uuid:2,// uuid:uuidv4(),
    clientName: "Akash Patel",
},{
    professionalsFullName: "Peter Chan, J.D.",
    apptDate: Date.now() + 10000000,
    uuid:3,//uuid:uuidv4(),
    clientName: "Mike Williams",
}];

app.set('professionalAppointments',professionalAppointments)

//this route is for US! In production, a receptionist, or calender/scheduling app
//would send this out. We will print it out and paste it in. It will drop
//us on our React site with the right info for CLIENT1 to make an offer
app.get('/user-link',(req, res)=>{
 console.log("2 webrtc")
    const apptData = professionalAppointments[0];

    professionalAppointments.push(apptData);  

    //we need to encode this data in a token
    //so it can be added to a url
    const token = jwt.sign(apptData,linkSecret);
    console.log("1 webrtc")
    console.log(`token webrtc ${token}`)
    res.send('https://localhost:3000/join-video?token='+token);
    // res.json("This is a test route")
})  



app.post('/validate-link',(req, res)=>{
    //get the token from the body of the post request (  thanks express.json() )
    const token = req.body.token;
    //decode the jwt with our secret
    const decodedData = jwt.verify(token,linkSecret);
    //send the decoded data (our object) back to the front end
    res.json(decodedData)
})

app.get('/pro-link',(req, res)=>{
    const userData = {
        fullName: "Peter Chan, J.D.",
        proId: 1234,
    }
    const token = jwt.sign(userData,linkSecret);
    res.send(`<a href="https://localhost:3000/dashboard?token=${token}" target="_blank">Link Here</a>`);
})












