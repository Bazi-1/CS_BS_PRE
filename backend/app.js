const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const bodyParser = require('body-parser'); // Parse request bodies
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const cookieParser = require('cookie-parser'); // Parse cookies
const methodOverride = require('method-override');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const rootSchema = require('./graphql/index');
const fs = require('fs'); //the file system
const https = require('https');
const http = require('http');
const socketio = require('socket.io');
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




// Mount GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema:rootSchema,
    graphiql: true,
}));

const expressServer = http.createServer({}, app);
const io = socketio(expressServer,{
    cors: [
        'http://localhost:3001',
        'https://localhost:3000',
        'https://localhost:3001',
        'https://localhost:3002',
        'https://www.deploying-javascript.com',
        // 'http://www.deploying-javascript.com', TEST ONLY
    ]
})
// Start server and listen on specified port
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

const linkSecret = "ijr2iq34rfeiadsfkjq3ew";
const jwt = require('jsonwebtoken');



const connectedProfessionals = [];
const connectedClients = [];

const allKnownOffers = {
    // uniqueId - key
    //offer
    //professionalsFullName
    //clientName
    //apptDate
    //offererIceCandidates
    //answer
    //answerIceCandidates
};

io.on('connection',socket=>{
    console.log(socket.id,"has connected")

    const handshakeData = socket.handshake.auth.jwt;
    let decodedData
    try{
        decodedData = jwt.verify(handshakeData,linkSecret);
    }catch(err){
        console.log(err);
        //these arent the droids were looking for. Star wars...
        // goodbye.
        socket.disconnect()
        return
    }

    const { fullName, proId } = decodedData;

    if(proId){
        //this is a professional. Update/add to connectedProfessionals
        //check to see if this user is already in connectedProfessionals
        //this would happen because they have reconnected
        const connectedPro = connectedProfessionals.find(cp=>cp.proId === proId)
        if(connectedPro){
            //if they are, then just update the new socket.id
            connectedPro.socketId = socket.id;
        }else{
            //otherwise push them on
            connectedProfessionals.push({
                socketId: socket.id,
                fullName,
                proId
            })
        }
        //send the appt data out to the professional
        const professionalAppointments = app.get('professionalAppointments');
        socket.emit('apptData',professionalAppointments.filter(pa=>pa.professionalsFullName === fullName))
        
        //loop through all known offers and send out to the professional that just joined, 
        //the ones that belong to him/her
        for(const key in allKnownOffers){
            if(allKnownOffers[key].professionalsFullName === fullName){
                //this offer is for this pro
                io.to(socket.id).emit('newOfferWaiting',allKnownOffers[key])
            }
        }
    }else{
        //this is a client
        const { professionalsFullName, uuid, clientName } = decodedData;
        //check to see if the client is already in the array
        //why? could have reconnected
        const clientExist = connectedClients.find(c=>c.uuid == uuid)
        if(clientExist){
            //already connected. just update the id
            clientExist.socketId = socket.id
        }else{
            //add them
            connectedClients.push({
                clientName,
                uuid,
                professionalMeetingWith: professionalsFullName,
                socketId: socket.id,
            })    
        }

        const offerForThisClient = allKnownOffers[uuid];
        if(offerForThisClient){
            io.to(socket.id).emit('answerToClient',offerForThisClient.answer);
        }

    }

    console.log(connectedProfessionals)

    socket.on('newAnswer',({answer,uuid})=>{
        //emit this to the client
        const socketToSendTo = connectedClients.find(c=>c.uuid == uuid);
        if(socketToSendTo){
            socket.to(socketToSendTo.socketId).emit('answerToClient',answer);
        }
        //update the offer
        const knownOffer = allKnownOffers[uuid];
        if(knownOffer){
            knownOffer.answer = answer;
        }

    })

    socket.on('newOffer',({offer, apptInfo})=>{
        //offer = sdp/type, apptInfo has the uuid that we can add to allKnownOffers
        //so that, the professional can find EXACTLY the right allKnownOffers
        allKnownOffers[apptInfo.uuid] = {
            ...apptInfo,
            offer,
            offererIceCandidates: [],
            answer: null,
            answerIceCandidates: [],
        }
        //we dont emit this to everyone like we did our chat server
        //we only want this to go to our professional.

        //we got professionalAppointments from express (thats where its made)
        const professionalAppointments = app.get('professionalAppointments');
        //find this particular appt so we can update that the user is waiting (has sent us an offer)
        const pa = professionalAppointments.find(pa=>pa.uuid === apptInfo.uuid);
        if(pa){
            pa.waiting = true;
        }

        //find this particular professional so we can emit
        const p = connectedProfessionals.find(cp=>cp.fullName === apptInfo.professionalsFullName)
        if(p){
            //only emit if the professional is connected
            const socketId = p.socketId;
            //send the new offer over
            socket.to(socketId).emit('newOfferWaiting',allKnownOffers[apptInfo.uuid])
            //send the updated appt info with the new waiting
            socket.to(socketId).emit('apptData',professionalAppointments.filter(pa=>pa.professionalsFullName === apptInfo.professionalsFullName))
        }
    })

    socket.on('getIce',(uuid,who,ackFunc)=>{
        const offer = allKnownOffers[uuid];
        // console.log(offer)
        let iceCandidates = [];
        if(offer){
            if(who === "professional"){
                iceCandidates = offer.offererIceCandidates
            }else if(who === "client"){
                iceCandidates = offer.answerIceCandidates;
            }
            ackFunc(iceCandidates)
        }
    })

    socket.on('iceToServer',({who,iceC,uuid})=>{
        console.log("==============",who)
        const offerToUpdate = allKnownOffers[uuid];
        if(offerToUpdate){
            if(who === "client"){
                //this means the client has sent up an iceC
                //update the offer
                offerToUpdate.offererIceCandidates.push(iceC)
                const socketToSendTo = connectedProfessionals.find(cp=>cp.fullName === decodedData.professionalsFullName)
                if(socketToSendTo){
                    socket.to(socketToSendTo.socketId).emit('iceToClient',iceC);
                }
            }else if(who === "professional"){
                offerToUpdate.answerIceCandidates.push(iceC)
                const socketToSendTo = connectedClients.find(cp=>cp.uuid == uuid)
                if(socketToSendTo){
                    socket.to(socketToSendTo.socketId).emit('iceToClient',iceC);
                }
            }
        }
    })
})

const { v4: uuidv4 } = require('uuid');

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

    const apptData = professionalAppointments[0];

    professionalAppointments.push(apptData);

    //we need to encode this data in a token
    //so it can be added to a url
    const token = jwt.sign(apptData,linkSecret);
    res.send('https://localhost:3000/join-video?token='+token);
    // res.json("This is a test route")
})  

app.post('/validate-link',(req, res)=>{
    console.log(`validate-link: 11111`)
    //get the token from the body of the post request (  thanks express.json() )
    const token = req.body.token;
    console.log(`token: ${token}`)
    //decode the jwt with our secret
    const decodedData = jwt.verify(token,linkSecret);
    console.log(`decodedData: ${JSON.stringify(decodedData)}`)
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

expressServer.listen(3001);
// module.exports = { io, expressServer, app };
