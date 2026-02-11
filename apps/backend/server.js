require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const path = require('path');

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({limit:'10mb',extended:true}));
app.use(cors());

// Static file serving for production
if (process.env.NODE_ENV == 'production') {
    const clientPath = path.join(__dirname,'../frontend/dist');
    app.use(express.static(clientPath));
    app.get('/',(req,res)=>{
        res.sendFile(path.join(clientPath,'index.html'));
    })
}

// MongoDB connection with connection pooling configuration
const mongoOptions = {
    maxPoolSize: 10,        // Max concurrent connections to MongoDB
    minPoolSize: 5,         // Min concurrent connections
    maxIdleTimeMS: 45000,   // Close idle connections after 45s
    socketTimeoutMS: 45000  // Socket timeout for operations
};

mongoose.connect(process.env.MONGOURL, mongoOptions).then(()=>{
    app.listen(process.env.PORT,()=>{console.log("Connected to Database and Listening to requests at "+process.env.PORT)})
}).catch(error=>{console.error("Database connection failed:", error); process.exit(1)});