const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../models/user');
//const updatehoteldetail = require('../models/updatehoteldetail');
//const hotelrequest = require('../models/hotelrequest');
// Define your routes here
router.get('/', (req, res) => {
  res.send('Hello, World!');
});


// Register a new hotel owner
router.post("/register", async (req, resp) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newuser = new user({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      score_time:100000,
      score_move:100000,
    });

    const saveduser = await newuser.save();
    resp.status(201).json(saveduser);
  } catch (error) {
    console.error("Error registering user:", error);
    resp.status(500).json({ error: "An error occurred while registering the user." });
  }
});

// Login a hotel owner
router.post("/login", async (req, resp) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);
    // Find the hotel owner by email
    const founduser = await user.findOne({ email });

    if (!founduser) {
      return resp.status(401).json({ error: "Invalid credentials." });
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, founduser.password);

    if (passwordMatch) {
      resp.status(200).json({ message: "Login successful!" });
    } else {
      resp.status(401).json({ error: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    resp.status(500).json({ error: "An error occurred while logging in." });
  }
});


router.get("/bestscore", async (req, res) => {
  try {
    // Find the 5 users with the lowest score_time values
    const lowestTimeUsers = await user.find().sort({ score_time: 1 }).limit(5);

    // Find the 5 users with the lowest score_move values
    const lowestMoveUsers = await user.find().sort({ score_move: 1 }).limit(5);

    res.status(200).json({
      lowestTimeUsers: lowestTimeUsers.map(user => ({
        username: user.username,
        score_time: user.score_time
      })),
      lowestMoveUsers: lowestMoveUsers.map(user => ({
        username: user.username,
        score_move: user.score_move
      }))
    });
  } catch (error) {
    console.error("Error getting best scores:", error);
    res.status(500).json({ error: "An error occurred while fetching best scores." });
  }
});

router.post("/update-bestscores", async (req, res) => {
  try {
    const { email, time, moves } = req.body;

    // Find the user by email
    const foundUser = await user.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the provided time is lower than the current best score time
    if (time < foundUser.score_time) {
      foundUser.score_time = time;
    }

    // Check if the provided moves count is lower than the current best score moves count
    if (moves < foundUser.score_move) {
      foundUser.score_move = moves;
    }

    // Save the updated user
    const updatedUser = await foundUser.save();

    res.status(200).json({
      message: "Best scores updated successfully.",
      updatedUser: {
        username: updatedUser.username,
        score_time: updatedUser.score_time,
        score_move: updatedUser.score_move
      }
    });
  } catch (error) {
    console.error("Error updating best scores:", error);
    res.status(500).json({ error: "An error occurred while updating best scores." });
  }
});

// Export the router to be used in the main application file
module.exports = router;
