const express = require("express");
// Import the Message model
const User = require("../Models/User"); // Import the User model
const jwt = require("jsonwebtoken");
const budgetrouter = express.Router();
const Expenses = require("../Models/Expenses");
const dayjs = require('dayjs');
const mongoose = require('mongoose');
const Budget = require("../Models/Budget");

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

budgetrouter.post("/addbudget", authenticateToken, async (req, res) => {
    try {
      const userId = req.userId;
      const { _id, title, amount, type } = req.body; // Include an `id` field in the request to check for existing expenses
  
      if (!title || !amount || !type) {
        return res.status(400).json({
          status: false, 
          error: "Please provide all required fields."
        });
      }
  
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(400).json({
          status: false, 
          error: "Invalid user ID."
        });
      }
  
      if (_id) {
        // If an ID is provided, attempt to update the existing expense
        const budget = await Budget.findOneAndUpdate(
          { _id: _id, user: userId }, // Ensure the expense belongs to the user
          { title, amount, type },
          { new: true } // Return the updated document
        );
  
        if (!budget) {
          return res.status(404).json({
            status: false, 
            error: "Expense not found."
          });
        }
  
        return res.status(200).json({
          status: true,
          message: "Expense updated successfully",
          budget: budget
        });
      } else {
        // No ID provided, create a new expense
        const newBudget = new Budget({
          title, 
          amount, 
          type, 
          user: userId
        });
        await newBudget.save();
        return res.status(201).json({
          status: true,
          message: "Expense added successfully",
          budjet: newBudget
        });
      }
    } catch (error) {
      console.error("Error processing expense request:", error);
      return res.status(500).json({
        status: false, 
        error: "Internal server error"
      });
    }
  });

// write a route to fetch data of particular month and year
 // Assuming model import

budgetrouter.get("/budgets", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
       
        // Validate user existence
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(400).json({ status: false, error: "Invalid user ID." });
        }

        // Construct the start and end dates for the month
      

        // Fetch expenses within the month
        const budgets = await Budget.find({
            user: userId
        });

        // Calculate total budget for the month
  

        // Handle no expenses found
        if (!budgets.length) {
            return res.status(200).json({
                status: true,
                message: "No expenses found for this user.",
                budget: [],
          
            });
        }

        return res.status(200).json({
            status: true,
            message: "Expenses retrieved successfully",
            budget: budgets
        });
    } catch (error) {
        console.error("Error fetching expenses for user:", error);
        return res.status(500).json({ status: false, error: "Internal server error" });
    }
});

// expensesrouter.get("/expenses/date", authenticateToken, async (req, res) => {
//     try {
//         const userId = req.userId;
//         const { date } = req.query; // Expecting 'date' in the format 'YYYY-MM-DD'

//         // Validate user existence
//         const userExists = await User.findById(userId);
//         if (!userExists) {
//             return res.status(400).json({ status: false, error: "Invalid user ID." });
//         }

//         // Fetch expenses on the specific date
//         const expenses = await Expenses.find({
//             user: userId,
//             date: date  // Filters directly by the provided date
//         });

//         // Calculate total budget for the specific date
//         const totalBudget = await Expenses.aggregate([
//             { $match: { 
//                 user: mongoose.Types.ObjectId(userId), 
//                 date: date
//             }},
//             { $group: { _id: null, total: { $sum: "$amount" } }}
//         ]);

//         const total = totalBudget.length > 0 ? totalBudget[0].total : 0;

//         // Handle no expenses found
//         if (!expenses.length) {
//             return res.status(200).json({
//                 status: true,
//                 message: "No expenses found for this user on the specified date.",
//                 expenses: [],
//                 totalBudget: total
//             });
//         }

//         return res.status(200).json({
//             status: true,
//             message: "Expenses retrieved successfully for the specified date",
//             expenses: expenses,
//             totalBudget: total
//         });
//     } catch (error) {
//         console.error("Error fetching expenses for user:", error);
//         return res.status(500).json({ status: false, error: "Internal server error" });
//     }
// });
// //delete expense by id

budgetrouter.delete("/budget/:id", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        // Validate user existence
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(400).json({ status: false, error: "Invalid user ID." });
        }


        // Find the expense by ID and user
        const budget = await Budget.findOneAndDelete({
            _id: id,
            user: userId
        });

        // Handle no expense found

        if (!budget) {
            return res.status(404).json({
                status: true,
                message: "No expense found for this user with the specified ID."
            });
        }

        return res.status(200).json({
            status: true,
            message: "Expense deleted successfully",
            budget: budget
        });

    } catch (error) {
        console.error("Error deleting expense:", error);
        return res.status(500).json({ status: false, error: "Internal server error" });
    }
});



module.exports = budgetrouter;