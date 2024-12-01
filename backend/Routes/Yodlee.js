const express = require("express");
// Import the Message model
const User = require("../Models/User"); // Import the User model
const jwt = require("jsonwebtoken");
const yodleerouter = express.Router();
const Expenses = require("../Models/Expenses");
const dayjs = require('dayjs');
const mongoose = require('mongoose');
const axios = require('axios')

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
const YODLEE_BASE_URL = process.env.YODLEE_API_BASE_URL;

yodleerouter.post('/getAccessToken',authenticateToken,async (req, res) => {
    try {
        // const res = await axios.post(
        //     `${YODLEE_BASE_URL}/user/register`,
        //     {
        //         loginName: req.userId,
        //         email: 'konakalavamsi@gmail.com',
        //         locale: 'en_US', // Use 'en_US' or your preferred locale
        //     },
        //     {
        //         headers: {
        //             'Api-Version': '1.1',
        //             'Authorization': `Bearer ${accessToken}`,
        //             'Content-Type': 'application/json',
        //         },
        //     }
        // );
        const response = await axios.post(
            `${YODLEE_BASE_URL}/auth/token`,
            {
                "clientId": process.env.YODLEE_CLIENT_ID,
                "secret": process.env.YODLEE_SECRET
              },
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded','Api-Version': '1.1','loginName': "sbMem671e86df3b0ca3" } }
        );
        accessToken = response.data.token.accessToken;
        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting access token');
    }
});

yodleerouter.post('/api/getUserSessionToken', async (req, res) => {
    try {
        const response = await axios.post(
            `${YODLEE_BASE_URL}/user/session`,
            {},
            { headers: { Authorization: `Bearer ${req.body.accessToken}` } }
        );
        const userSession = response.data.user.session;
        res.json({ userSession });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting user session token');
    }
});

// 3. Fetch Linked Accounts
yodleerouter.post('/getLinkedAccounts',authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const response = await axios.get(
            `${YODLEE_BASE_URL}/accounts?providerAccountId=`+req.body.providerAccountId,
            { headers: { Authorization: `Bearer ${req.body.accessToken}`,'Content-Type': 'application/x-www-form-urlencoded','Api-Version': '1.1','loginName': "sbMem671e86df3b0ca1" } }
        );

        user.accounts = response.data.account;
        await user.save();

        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching linked accounts:', error);
        res.status(500).send('Error fetching linked accounts');
    }
});

// 4. Fetch Transactions for the Current Month
yodleerouter.post('/amount', authenticateToken, async (req, res) => {
    try {
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const profile = await User.findById(req.userId);
        const accounts = profile.accounts;
    
        // Step 1: Get Yodlee access token
        const tokenResponse = await axios.post(
          `${YODLEE_BASE_URL}/auth/token`,
          {
            clientId: process.env.YODLEE_CLIENT_ID,
            secret: process.env.YODLEE_SECRET,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Api-Version': '1.1',
              'loginName': "sbMem671e86df3b0ca3",
            },
          }
        );
        const accessToken = tokenResponse.data.token.accessToken;
    
        // Step 2: Prepare Transactions Promise for all accounts
        const transactionsPromise = (async () => {
          let totalIncomingAmount = 0;
    
          for (const account of accounts) {
            const providerAccountId = account.providerAccountId;
    
            // Fetch transactions for each account within date range
            const transactionsResponse = await axios.get(
              `${YODLEE_BASE_URL}/transactions`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Api-Version': '1.1',
                },
                params: {
                  fromDate: startDate,
                  toDate: endDate,
                  accountId:account.id.toString(),
                },
              }
            );
            console.log(transactionsResponse,"transactionsResponse.data.transaction")
    
            // Filter and sum incoming transactions
            if(transactionsResponse.data?.transaction){
            const incomingTransactions = transactionsResponse.data.transaction.filter(
              (transaction) => transaction.amount.amount > 0
            );
    
            const accountIncomingAmount = incomingTransactions.reduce(
              (sum, transaction) => sum + transaction.amount.amount,
              0
            );
    
            totalIncomingAmount += accountIncomingAmount;
        }
          }
    
          return totalIncomingAmount;
        })();
    
        // Step 3: Prepare Expenses Aggregation Promise
        const expensesPromise = Expenses.aggregate([
          {
            $match: {
              user: mongoose.Types.ObjectId(req.userId), // Match user ID
              date: {
                $gte: startDate, // Lexicographical comparison on date strings
                $lte: endDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
        ]);
    
        // Step 4: Run both promises in parallel and wait for both to complete
        const [totalIncomingAmount, expenseResult] = await Promise.all([
          transactionsPromise,
          expensesPromise,
        ]);
    
        // Extract total expenses from the result
        const totalExpenses = expenseResult.length > 0 ? expenseResult[0].totalAmount : 0;
    
        // Step 5: Calculate net income and send response
        const netIncome = totalIncomingAmount - totalExpenses;
        res.json({ netIncome: netIncome>0?netIncome:0 });
    
      } catch (error) {
        console.error('Error fetching transactions or expenses:', error);
        res.status(500).send('Error calculating net income');
      }
    }
    
);
//return all transactions

yodleerouter.post('/transactions',authenticateToken, async (req, res) => {
    try {
        const startDate = req.body.date;
        const endDate = req.body.date;
        const profile = await User.findById(req.userId);
        const accounts = profile.accounts;
    
        // Step 1: Get Yodlee access token
        const tokenResponse = await axios.post(
          `${YODLEE_BASE_URL}/auth/token`,
          {
            clientId: process.env.YODLEE_CLIENT_ID,
            secret: process.env.YODLEE_SECRET,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Api-Version': '1.1',
              'loginName': "sbMem671e86df3b0ca3",
            },
          }
        );
        const accessToken = tokenResponse.data.token.accessToken;
    
        // Step 2: Prepare Transactions Promise for all accounts
        const transactionsPromise = (async () => {
          let transactions=[];
    
          for (const account of accounts) {

            // Fetch transactions for each account within date range
            const transactionsResponse = await axios.get(
              `${YODLEE_BASE_URL}/transactions`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Api-Version': '1.1',
                },
                params: {
                  accountId:account.id.toString(),
                  fromDate: startDate,
                  toDate: endDate,
                },
              }
            );
            console.log(transactionsResponse,"transactionsResponse.data.transaction")
            if(transactionsResponse.data?.transaction){

              transactions = [...transactions,...transactionsResponse.data.transaction]
            }
          }

          return transactions;
        }
        )();

        const transactions = await transactionsPromise;
        res.json({ transactions });

      } catch (error) {
        console.error('Error fetching transactions or expenses:', error);
        res.status(500).send('Error calculating net income');
      }
    }

);
            



module.exports = yodleerouter;
