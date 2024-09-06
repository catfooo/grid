// Import express and mongoose using ES module syntax
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch'

//create the express app
const app = express();
const port = process.env.PORT || 5001;

// Middleware
// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Handle preflight OPTIONS requests
app.options('*', cors());  // Apply CORS for all routes on OPTIONS requests

// MongoDB Connection
const URL = process.env.VITE_URL
mongoose.connect(URL,{
    // to deal with timeout
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a user schema and model
const userSchema = new mongoose.Schema({
    googleId: String,
    grid: {
        column: { type: Number, default: 0 },
        row: { type: Number, default: 0 }
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Health check endpoint
app.get('/health', (req, res) => {
    // console.log('Health check endpoint hit');
    res.status(200).send('Server is healthy');
  });  

// API endpoint to save user data
app.post('/', async (req, res) => {
    const { googleId } = req.body;
  
    try {
      let user = await User.findOne({ googleId });
  
      if (!user) {
        user = new User({ googleId });
        await user.save();
      }
  
      res.status(200).json({ message: 'User saved or found', googleId:user.googleId, grid: user.grid });
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ message: 'Error saving user' });
    }
});

// API endpoint to increment either row or column
app.post('/updateGrid', async (req, res) => {
    const { googleId, action } = req.body;

    try {
        const user = await User.findOne({ googleId });

        if (user) {
            if (action === 'row') {
                user.grid.row += 1;  // Increment the row count
                res.status(200).json({ message: 'Row incremented', grid: user.grid });
            } else if (action === 'column') {
                user.grid.column += 1;  // Increment the column count
                res.status(200).json({ message: 'Column incremented', grid: user.grid });
            } else if (action === '-row') {
                user.grid.row -= 1;  // Decrement the row count
                res.status(200).json({ message: 'Row decremented', grid: user.grid });
            } else if (action === '-column') {
                user.grid.column -= 1;  // Decrement the column count
                res.status(200).json({ message: 'Column decremented', grid: user.grid });
            } else {
                res.status(400).json({ message: 'Invalid action' });
            }

            await user.save();    // Save the updated user object
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating grid:', error);
        res.status(500).json({ message: 'Error updating grid' });
    }
});

const serverUrl = 'https://grid-s0tx.onrender.com/health'; // Replace with your actual server URL
// const serverUrl = 'http://localhost:5001/health'; // Point to your local server URL


const pingServer = async () => {
  try {
    const response = await fetch(serverUrl);
    if (response.ok) {
    //   console.log('Server pinged successfully');
    } else {
      console.log('Ping failed:', response.status);
    }
  } catch (error) {
    console.error('Error pinging server:', error);
  }
};

// console.log('Starting ping server');

pingServer(); // Call once immediately
// Ping the server every 5 minutes
setInterval(pingServer, 5 * 60 * 1000); // 5 minutes

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });