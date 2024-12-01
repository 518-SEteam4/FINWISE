const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config()
const cors = require('cors');
const UserInfoRoutesV2 = require('./Routes/User');
const serverless = require('serverless-http');
const expensesrouter = require('./Routes/Expenses');
const budgetrouter = require('./Routes/Budget');
const reminderrouter = require('./Routes/Reminder');
const yodleerouter = require('./Routes/Yodlee');
const goalRoutes = require('./Routes/Goal');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
mongoose.set('strictQuery', true)

app.use(cors({
	origin: ["http://localhost:3000"],
	credentials:true
}))

// mongodb+srv://Careersstudio:<password>@careersstudio.f2dpkbx.mongodb.net/?retryWrites=true&w=majority
const url = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.gmubo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// database details

console.log(url)
// const url = "mongodb+srv://Careersstudio:"+process.env.DB_PASSWORD+"@careersstudio.f2dpkbx.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url, { useNewUrlParser: true }).then(res => {
	console.log("connected successfully to mango db")

})
	.catch(err => {
		console.log(err)
	})
// app.use(function (req, res, next) {
// 	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// 	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
// 	res.setHeader('Access-Control-Allow-Credentials', true);
// 	next();
// });

app.use("/api",UserInfoRoutesV2)
app.use("/api",expensesrouter)
app.use('/api',budgetrouter)
app.use("/api",reminderrouter)
app.use('/api',yodleerouter)

app.use("/api/goals", goalRoutes);


module.exports.handler = serverless(app)
app.listen(3008, () => {
	console.log("server is running on port 3008")
})

// ServerlessHttp(app)