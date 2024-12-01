const express = require('express');
const mongoose = require('mongoose');
const Test = require('../Models/test'); // Assuming the model is in models/Answers.js
const jwt = require("jsonwebtoken");
const User = require('../Models/User');
const { default: axios } = require('axios');
const Testrouter = express.Router();

const authenticateToken = (req, res, next) => {
    // Get the Authorization heade
    console.log(req.headers)
    const authHeader = req.headers['authorization'];
    
    console.log(authHeader)
    // Check if the Authorization header is present and starts with 'Bearer'
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }
  
    // Verify the token using your secret key
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ error: 'Token is invalid' });
      }

      const user = await User.findById(decodedToken.id);
      // Extract user ID from the token and attach it to the request object
      req.userId = user.id;
  
      // Call the next middleware or route handler
      next();
    });
  };

// POST /submit route to store answers
Testrouter.post('/submit', authenticateToken, async (req, res) => {
    try {
      const userId = req.userId;
      const { aptitudeAnswers, personalityAnswers, growthAnswers } = req.body;
  
      // Ensure only one section is provided in the request body
      const providedSections = [
        aptitudeAnswers ? 'aptitude' : null,
        personalityAnswers ? 'personality' : null,
        growthAnswers ? 'growth' : null,
      ].filter(Boolean);
  
      if (providedSections.length !== 1) {
        return res.status(400).json({ error: 'You must provide answers for exactly one section at a time' });
      }
  
      // Determine which section is being submitted and validate the answers
      let result;
      if (aptitudeAnswers) {
        if (Object.keys(aptitudeAnswers).length !== 12) {
          return res.status(400).json({ error: 'Aptitude section must contain exactly 12 answers' });
        }
  
        // Call Python backend to calculate Aptitude score
        result = await axios.post(`${process.env.PYTHON_BACKEND_URL}/calculate_score`, {
          aptitude_answers: aptitudeAnswers
        });
  
        console.log(result.data);
  
        // Create or update the test result for the Aptitude section
        const test = await Test.findOneAndUpdate(
          { user: mongoose.Types.ObjectId(userId) },
          {
            aptitudeAnswers,
            aptitudeResult: result.data.aptitude_score,
          },
          { upsert: true, new: true }
        );
  
        return res.status(201).json({
          message: 'Aptitude answers submitted successfully',
          aptitudeResult: test.aptitudeResult,
        });
  
      } else if (personalityAnswers) {
        if (Object.keys(personalityAnswers).length !== 12) {
          return res.status(400).json({ error: 'Personality section must contain exactly 12 answers' });
        }
  
        // Call Python backend to calculate Personality score
        result = await axios.post(`${process.env.PYTHON_BACKEND_URL}/calculate_score`, {
          personality_answers: personalityAnswers
        });
  
        console.log(result.data);
  
        // Create or update the test result for the Personality section
        const test = await Test.findOneAndUpdate(
          { user: mongoose.Types.ObjectId(userId) },
          {
            personalityAnswers,
            personalityResult: result.data.personality_score,
          },
          { upsert: true, new: true }
        );
  
        return res.status(201).json({
          message: 'Personality answers submitted successfully',
          personalityResult: test.personalityResult,
        });
  
      } else if (growthAnswers) {
        if (Object.keys(growthAnswers).length !== 12) {
          return res.status(400).json({ error: 'Growth section must contain exactly 12 answers' });
        }
  
        // Call Python backend to calculate Growth score
        result = await axios.post(`${process.env.PYTHON_BACKEND_URL}/calculate_score`, {
          growth_answers: growthAnswers
        });
  
        console.log(result.data);
  
        // Create or update the test result for the Growth section
        const test = await Test.findOneAndUpdate(
          { user: mongoose.Types.ObjectId(userId) },
          {
            growthAnswers,
            growthResult: result.data.growth_score,
          },
          { upsert: true, new: true }
        );
  
        return res.status(201).json({
          message: 'Growth answers submitted successfully',
          growthResult: test.growthResult,
        });
      }
  
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  });

  Testrouter.get('/getResults', authenticateToken, async (req, res) => {
    try {
      const userId = req.userId;
  
      // Find the test results for the user
      const test = await Test.findOne({ user: mongoose.Types.ObjectId(userId) });

        if (!test) {
            return res.status(200).json({status:true, message: 'No test results found for this user.',completedSections:[] });
       }

        // Determine which sections have been completed

        const completedSections = [
            test.aptitudeResult ? 'aptitude' : null,
            test.personalityResult ? 'personality' : null,
            test.growthResult ? 'growth' : null,
        ].filter(Boolean);

        return res.status(200).json({
            status:true,
            message: 'Test results retrieved successfully',
            completedSections,
        });
    } catch (error) {
        return res.status(500).json({ status:false,error: 'Internal server error' });
    }

}
);


module.exports = Testrouter;