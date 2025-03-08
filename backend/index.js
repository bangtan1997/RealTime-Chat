require('dotenv').config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3001;
const CHAT_ENGINE_API_URL = "https://api.chatengine.io/users";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Middleware
app.use(express.json());
app.use(cors({ origin: true }));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Route for user authentication
app.post("/authenticate", async (req, res) => {
  const { username } = req.body;

  // Validate input
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // Make a request to the Chat Engine API
    const response = await axios.put(
      CHAT_ENGINE_API_URL,
      { username, secret: username, first_name: username },
      { headers: { "Private-Key": PRIVATE_KEY } }
    );

    // Return the response from the Chat Engine API
    return res.status(response.status).json(response.data);
  } catch (error) {
    // Handle errors from the Chat Engine API
    if (error.response) {
      console.error("Error response from Chat Engine API:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    } else {
      // Handle internal server errors
      console.error("Internal Server Error:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});