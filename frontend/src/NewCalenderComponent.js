import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography,TextField,IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import dayjs from 'dayjs';
import './calender.css';
import { useNavigate } from 'react-router-dom';
import axios from './baseurl';
// Helper function to get days in a month
function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

// Helper function to get the first day of the month (Sunday = 0, Monday = 1, etc.)
function getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
}

const Calendar = () => {
    const [expenses, setExpenses] = useState({});
    const [currentDate, setCurrentDate] = useState(dayjs()); // Use dayjs for date handling

    useEffect(() => {
        // Simulate fetching expense data for the current month
        axios.get("/allexpenses",{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('Token')}` // assuming token is stored in localStorage
            }
        }).then((res)=>{
            let temp ={}
            const Expenses = res.data.expenses

            Expenses.map((item)=>{
                if(!temp[item.date]){
                  temp[item.date]=item.amount
                }else{
                    temp[item.date]+=item.amount    
                }
            })
            setExpenses(temp)

        })
        // const expenseData = {
        //     '2024-10-01': 120,
        //     '2024-10-02': 90,
        //     '2024-10-15': 200,
        //     '2024-11-03': 50,
        //     '2024-12-25': 130
        // };
        // setExpenses(expenseData);
    }, []);
   const navigate = useNavigate()
    const month = currentDate.month(); // Current month (0-11)
    const year = currentDate.year(); // Current year
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const today = dayjs(); // Current date with dayjs

    const handleDateClick = (date) => {
        console.log("Selected Date: ", date);
        navigate("/view/"+date)

    };

    const handlePrevMonth = () => {
        setCurrentDate((prevDate) => prevDate.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        if (currentDate.isBefore(today, 'month')) {
            setCurrentDate((prevDate) => prevDate.add(1, 'month'));
        }
    };

    const handleMonthYearChange = (newDate) => {
        setCurrentDate(newDate);
    };

    // Generate empty cells for the start of the month
    const emptyCells = [];
    for (let i = 0; i < firstDay; i++) {
        emptyCells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    // Generate cells for each day in the month
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const expenseAmount = expenses[dateKey];

        const isFutureDate = currentDate.date(day).isAfter(today);

        days.push(
            <motion.div
                key={dateKey}
                className={`calendar-cell day ${isFutureDate ? 'disabled' : ''}`}
                onClick={() => !isFutureDate && handleDateClick(dateKey)}
                whileHover={{ scale: !isFutureDate ? 1.05 : 1 }} // Framer Motion hover effect
                whileTap={{ scale: !isFutureDate ? 0.95 : 1 }}   // Framer Motion tap effect
                layout
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    background: isFutureDate?'#B5DBBf':"#6BB77B",
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    minHeight: '100px',
                    pointerEvents: isFutureDate ? 'none' : 'auto'
                }}
            >
                <span className="day-number">{day}</span>
                {expenseAmount && (
                    <span className="expense-amount">${expenseAmount}</span>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div className="calendar-container"
            initial={{ opacity: 0, scale: 0.9 }} // Initial animation
            animate={{ opacity: 1, scale: 1 }}   // Final state
            transition={{ duration: 0.5 }}       // Transition speed
        >
            <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                <Grid item>
                <Grid item>
                    <IconButton
                        onClick={handlePrevMonth}
                        className="calendar-icon-button"
                    >
                     
                        <ArrowBackIcon />
                    </IconButton>
                </Grid>
                </Grid>
                <Grid item>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* MUI DatePicker for selecting month and year */}
                    <DatePicker
                        views={['year', 'month']} // Show only month and year
                        label="Select Month and Year"
                        minDate={dayjs().subtract(25, 'year')}
                        maxDate={today} // Disable future months and years
                        value={currentDate}
                        onChange={handleMonthYearChange}
                        renderInput={(params) => (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                                <TextField {...params} />
                            </motion.div>
                        )}
                    />
                    </LocalizationProvider>
                </Grid>
                <Grid item>
                <IconButton
                        onClick={handleNextMonth}
                        disabled={currentDate.isSame(today, 'month')}
                        className="calendar-icon-button"
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                </Grid>
            </Grid>

            <motion.div className="calendar-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginTop: '20px' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {/* Days of the week */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Typography key={day} variant="h6" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {day}
                    </Typography>
                ))}
                {/* Render empty cells and days */}
                {emptyCells}
                {days}
            </motion.div>
        </motion.div>
    );
};

export default Calendar;