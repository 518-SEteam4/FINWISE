import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpenseForm from "./ExpenseForm";
import ExpensesTable from "./ExpenseTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import axios from "../baseurl";
import { useNavigate } from "react-router-dom";

function CalendarView({ date }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [isFormOpen, setFormOpen] = useState(false);
  const [EditFormOpen, setEditFormOpen] = useState(false);
  const [EditData, setEditData] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [fetchData, setFetchData] = useState(true);
  const navigate = useNavigate();

  const fetchMonthlyEarnings = async (month, year) => {
    try {
      const response = await axios.get(
        `/expenses?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`, // assuming token is stored in localStorage
          },
        }
      );
      if (response.data.status) {
        setMonthlyEarnings(response.data.totalBudget);
      } else {
        console.log("No expenses found:", response.data.message);
        setMonthlyEarnings(0);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setMonthlyEarnings(0);
    } // Simulates variable earnings
  };

  const fetchDayExpense = async (date) => {
    const datelocal = date;
    try {
      const transactions = await axios.post(`/transactions`,{
        date:datelocal
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`, // assuming token is stored in localStorage
        },
      });



      const getWithdrawals = (transactions) => {
        return transactions
            .filter(transaction => transaction.description.original.toLowerCase().includes("bill payment") || 
                                   transaction.description.original.toLowerCase().includes("tax") || 
                                   transaction.description.original.toLowerCase().includes("storage"))
            .map(transaction => ({
                type: 'auto',
                amount: transaction.amount.amount,
                title: transaction.description.original,
            }));
    };
    
    // Get withdrawals
      const withdrawals = getWithdrawals(transactions.data.transactions);
      
    
      const response = await axios.get(`/expenses/date?date=${datelocal}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`, // assuming token is stored in localStorage
        },
      });
      if (response.data.status) {
        setExpenses([...response.data.expenses,...withdrawals]);
      } else {
        console.log("No expenses found:", response.data.message);
        setExpenses([]);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    } // Simulates variable earnings
  };

  const handleDeleteExpense = async (id) => {
    // Implement deletion logic
    const response = await axios.delete("/expenses/" + id, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`, // assuming token is stored in localStorage
      },
    });

    if (response.status === 200) {
      //remove expense from the list

      let newExpenses = expenses.filter((expense) => expense._id != id);
      setFetchData(!fetchData);
      // setExpenses(newExpenses)
    }
    console.log("Delete expense with ID:", id);
  };

  const handleEditExpense = (expense) => {
    // Implement edit logic
    setEditData(expense);
    setEditFormOpen(true);
    console.log("Edit expense with ID:", expense);
  };
  // Fetch monthly earnings whenever the currentMonth changes
  useEffect(() => {
    const month = dayjs(selectedDate).month() + 1;
    const year = dayjs(selectedDate).year();
    fetchMonthlyEarnings(month, year);
  }, [selectedDate.month(), selectedDate.year(), fetchData]);

  useEffect(() => {
    fetchDayExpense(date);
    // fetchDayExpense(date)
  }, [selectedDate, fetchData]);
  const handleOpenForm = () => setFormOpen(true);
  const handleCloseForm = () => setFormOpen(false);

  const handleSaveExpense = (expenseData) => {
    console.log("Saving Expense:", expenseData);
    axios
      .post("/addExpense", expenseData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      })
      .then((res) => {
        setFetchData(!fetchData);
      });
  };

  const handleDateChange = (date) => {
    const newMonth = date.format("YYYY-MM");
    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
    }
    setSelectedDate(date);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3} sx={{ p: 3 }}>
        {/* <Grid item xs={12} md={8}>
                    <Card raised sx={{ minHeight: 360 }}>
                        <CardContent>
                            <StaticDatePicker
                                displayStaticWrapperAs="desktop"
                                openTo="day"
                                value={selectedDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <Typography {...params} variant="h6" />}
                            />
                        </CardContent>
                    </Card>
                </Grid> */}
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => {
              navigate("/home");
            }}
            className="calendar-icon-button"
          >
            <ArrowBackIcon />
          </IconButton>
          {formatDate(date)}
          <Button variant="contained" 
          sx={{
            marginRight: '10px',
            mt: 2,
            backgroundColor: '#487852', // Green
        '&:hover': {
          backgroundColor: '#6bb77b'
        }
          }}
          onClick={handleOpenForm}>
            Add Expense
          </Button>
        </Grid>

        <Grid item xs={12}>
          <ExpensesTable
            expenses={expenses}
            onDelete={handleDeleteExpense}
            onEdit={handleEditExpense}
          />
        </Grid>
        {/* <Grid item xs={12}>
                    <Button variant="contained" onClick={handleOpenForm}>Add Expense</Button>
                </Grid> */}
      </Grid>
      <ExpenseForm
        open={isFormOpen}
        handleClose={handleCloseForm}
        handleSave={handleSaveExpense}
        data={{
          date: date, // This maintains a dayjs object for compatibility with DatePicker
          amount: "",
          title: "",
          type: "",
        }}
      />


      {Object.keys(EditData).length > 0 && (
        <ExpenseForm
          open={EditFormOpen}
          handleClose={() => setEditFormOpen(false)}
          handleSave={handleSaveExpense}
          data={EditData}
        />
      )}
    </LocalizationProvider>
  );
}

export default CalendarView;
