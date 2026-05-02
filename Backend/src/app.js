//Create server
const express = require('express');
const cookieparser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes')
const foodRoutes = require('./routes/food.routes')

const app = express();
app.use(express.json());
app.use(cookieparser());

app.get("/", (req,res)=>{
    res.send("Hello World");
})

// Set up routes for authentication
app.use('/api/auth', authRoutes);
// Set up routes for food management
app.use('/api/food', foodRoutes);

module.exports = app;