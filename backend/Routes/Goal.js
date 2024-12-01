// routes/goalRoutes.js
const express = require("express");
const router = express.Router();
const Goal = require("../Models/Goals");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const authenticateToken = (req, res, next) => {
    // Get the Authorization heade
    console.log(req.headers);
    const authHeader = req.headers["authorization"];
  
    console.log(authHeader);
    // Check if the Authorization header is present and starts with 'Bearer'
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }
  
    // Verify the token using your secret keß
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ error: "Token is invalid" });
      }
  
      const user = await User.findById(decodedToken.id);
      // Extract user ID from the token and attach it to the request object
      req.userId = user.id;
  
      // Call the next middleware or route handler
      next();
    });
  };

// GET all goals
router.get("/",authenticateToken ,async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId });
    res.json({ goals });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// POST a new goal
router.post("/",authenticateToken,async (req, res) => {
  const { title, amount } = req.body;
  if (!title || amount == null) {
    return res.status(400).json({ error: "Title and amount are required" });
  }
  
  try {
    const newGoal = new Goal({ title, amount,user: req.userId });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create goal" });
  }
});

// PUT to update an existing goal by ID
router.put("/:id", authenticateToken,async (req, res) => {
  const { id } = req.params;
  const { title, amount } = req.body;

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      { title, amount },
      { new: true }
    );
    if (!updatedGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update goal" });
  }
});

// DELETE a goal by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGoal = await Goal.findByIdAndDelete(id);
    if (!deletedGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete goal" });
  }
});

module.exports = router;