// Flow: Create a server using Express, start server using app.listen, connect to MongoDB, and set up routes for authentication.

// Import dependencies
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB
const connectDB = require('./src/db/db');
connectDB();

//Start server
const app = require('./src/app');
app.listen(3000, ()=>{
    console.log("Server is runninng on port 3000");
})