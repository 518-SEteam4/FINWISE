import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TextField,
  Pagination,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import axios from '../baseurl';
// Dummy Data for example
// const dummyExpenses = [
//   { _id: "1", date: "2024-09-05", title: "Electricity Bill", amount: 30, type: "Utilities" },
//   { _id: "2", date: "2024-09-03", title: "Grocery Shopping", amount: 50, type: "Groceries" },
//   { _id: "3", date: "2024-09-07", title: "Bus Ticket", amount: 15, type: "Transport" },
//   { _id: "4", date: "2024-09-10", title: "Movie Ticket", amount: 20, type: "Entertainment" },
//   { _id: "5", date: "2024-09-11", title: "Doctor Visit", amount: 60, type: "Healthcare" },
//   { _id: "6", date: "2024-08-29", title: "Internet Bill", amount: 40, type: "Utilities" },
//   { _id: "2", date: "2024-09-03", title: "Grocery Shopping", amount: 50, type: "Groceries" },
//   { _id: "2", date: "2024-09-03", title: "Grocery Shopping", amount: 50, type: "Others" },
// ];

// Categories for Pie Chart
const categories = ["Groceries", "Utilities", "Transport", "Entertainment", "Healthcare", "Others"];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

const ExpenseTracker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // For pagination, show 5 items per page
  const [loading, setLoading] = useState(false);
  const [expenseData, setExpenseData] = useState([]); // For the pie chart
  const [dummyExpenses,setdummyExpenses]=useState([])
  const maxDate = dayjs(); // Today's date for validation

  // Handle the Fetch Data button click

  useEffect(() => {
    // Simulate fetching expense data for the current month
    axios.get("/allexpenses",{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}` // assuming token is stored in localStorage
        }
    }).then((res)=>{
        // let temp ={}
        const Expenses = res.data.expenses

        // Expenses.map((item)=>{
        //     if(!temp[item.date]){
        //       temp[item.date]=item.amount
        //     }else{
        //         temp[item.date]+=item.amount    
        //     }
        // })
        setdummyExpenses(Expenses)

    })}, []);
  const fetchData = () => {
    if (startDate && endDate) {
      setLoading(true);
      setTimeout(() => {
        const filtered = dummyExpenses.filter((expense) => {
          const expenseDate = dayjs(expense.date);
          return expenseDate.isBetween(startDate, endDate, null, "[]");
        });
        setFilteredExpenses(filtered);

        // Update pie chart data
        const categoryData = categories.map((category) => {
          const total = filtered
            .filter((expense) => expense.type === category)
            .reduce((sum, exp) => sum + exp.amount, 0);
          return { name: category, value: total };
        });
        setExpenseData(categoryData.filter((entry) => entry.value > 0)); // Only show categories with data

        setLoading(false);
      }, 1000); // Simulate an API call
    }
  };

  // Export expenses to CSV
  const exportToCSV = () => {
    const csvData = filteredExpenses.map((expense) => ({
      Date: expense.date,
      Title: expense.title,
      Amount: expense.amount,
      Category: expense.type,
    }));

    const csvString = [
      ["Date", "Title", "Amount", "Category"],
      ...csvData.map((row) => [row.Date, row.Title, row.Amount, row.Category]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Pagination controls
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Expense Tracker
      </Typography>

      {/* Date Pickers and Buttons */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" gap={2} mt={2} alignItems="center">
          <DatePicker
            label="Start Date"
            value={startDate}
            maxDate={maxDate}
            onChange={(newValue) => {
              setStartDate(newValue);
              setEndDate(null); // Reset end date when start date changes
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            minDate={startDate || null} // End date cannot be before start date
            maxDate={maxDate} // End date cannot be in the future
            disabled={!startDate} // Disable until start date is selected
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: '#487852', // Green
          '&:hover': {
            backgroundColor: '#6bb77b'
          }
            }}
            onClick={fetchData}
            disabled={!startDate || !endDate}
          >
            Fetch Data
          </Button>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: '#487852', // Green
          '&:hover': {
            backgroundColor: '#6bb77b'
          }
            }}
            onClick={exportToCSV}
            disabled={filteredExpenses.length === 0} // Disable if no data to export
            style={{ marginLeft: "10px" }}
          >
            Export to CSV
          </Button>
        </Box>
      </LocalizationProvider>

      {/* Display Data or No Data Message */}
      {loading ? (
        <Typography variant="h6" mt={4}>
          Loading...
        </Typography>
      ) : filteredExpenses.length > 0 ? (
        <>
          <Typography variant="h6" mt={4}>
            Recent Transactions
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>${expense.amount}</TableCell>
                    <TableCell>{expense.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(filteredExpenses.length / itemsPerPage)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Box>

          {/* Pie Chart */}
          <Typography variant="h6" mt={4}>
            Expense Breakdown by Category
          </Typography>
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} md={8}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="h6" mt={4}>
          No data found for selected dates. Please select different dates.
        </Typography>
      )}
    </Box>
  );
};

export default ExpenseTracker;