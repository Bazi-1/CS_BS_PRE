//this is where all our express stuff happens (routes)
const app = require('./server').app;
const jwt = require('jsonwebtoken');
const linkSecret = "jwiroido29edn2u3idnsjsal";


app.get('/user-link',(req,res)=>{

    const appData = {
        professionalsFullName:"Ziad Halilo, Z.H.",
        appDate : Date.now()
    }

    const token = jwt.sign(appData,linkSecret);
    res.send('http://localhost/3000/join-video?token='+token)
 
})


app.post('/validate-link',(req,res)=>{
    const token = req.body.token;
    const decodedData = jwt.verify(token,linkSecret);
    res.json(decodedData)
})















