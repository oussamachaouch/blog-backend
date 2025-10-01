const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connexion = require('./config/dbConfig');

const app = express();

// middleware
dotenv.config({ path : './config/config.env'});
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
  }
app.use(express.json())
//***************** CORS *************************** //
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

//**************************************************//

const PORT = process.env.PORT || 3000;
const blogRoute = require('./routes/blog');
const subscriberRoute = require('./routes/subscriber');
const newsRouter = require('./routes/news');
const translationRouter = require('./routes/translation');


app.use('/blogs',blogRoute);
app.use('/newsletter',subscriberRoute);
app.use("/news", newsRouter);
app.use("/translate", translationRouter);

// connect to mongo
connexion();

// start server
app.listen(PORT,()=>{
    console.log(`server lestening on port ${PORT} `);
});