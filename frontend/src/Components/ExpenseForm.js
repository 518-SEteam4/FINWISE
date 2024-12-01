import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function ExpenseForm({ open, handleClose, handleSave,data }) {
    const [expenseData, setExpenseData] = useState({
        ...data,
        date: data.date ? dayjs(data.date) : dayjs()
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (newDate) => {
        setExpenseData(prev => ({ ...prev, date: newDate }));
    };

    const handleSubmit = () => {
        if (!expenseData.date || !expenseData.amount || !expenseData.title || !expenseData.type) {
            alert('Please fill all the fields.');
            return;
        }
        // Format the date in the YYYY-MM-DD format for the API call
        const formattedData = {
            ...expenseData,
            date: expenseData.date.format('YYYY-MM-DD')
        };
        handleSave(formattedData);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogContent>
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date"
                        value={expenseData.date}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider> */}
                <TextField
                    margin="dense"
                    name="amount"
                    label="Amount"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={expenseData.amount}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="title"
                    label="Title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={expenseData.title}
                    onChange={handleChange}
                />
                 <FormControl fullWidth margin="dense">
                 
                        <InputLabel>Type</InputLabel>
                        <Select
                            name="type"
                            value={expenseData.type}
                            onChange={handleChange}
                            label="Type"
                        >
                            <MenuItem value="Groceries">Groceries</MenuItem>
                            <MenuItem value="Utilities">Utilities</MenuItem>
                            <MenuItem value="Transport">Transport</MenuItem>
                            <MenuItem value="Entertainment">Entertainment</MenuItem>
                            <MenuItem value="Healthcare">Healthcare</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                        </Select>
                    </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ExpenseForm;