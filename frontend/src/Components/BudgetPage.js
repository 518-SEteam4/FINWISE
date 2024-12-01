import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
} from "@mui/material";
import axios from "../baseurl";
const initialFormState = { id: null, title: "", amount: "", type: "" };

function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [fetchData, setFetchData] = useState(false);
  const [Expenses, setExpenses] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
  };

  useEffect(() => {
    axios
      .get("/budgets", {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then((response) => {
        setBudgets(response.data.budget);
      })
      .catch((error) => console.error("Failed to fetch budgets", error));
  }, [fetchData]);

  useEffect(() => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = currentDate;

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    axios
      .post("/expenses/month", {
        startDate:formattedStartDate,
        endDate:formattedEndDate
      },{
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then((response) => {
        
        setExpenses(response.data);
      })
      .catch((error) => console.error("Failed to fetch budgets", error));
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const addOrEditBudget = (event) => {
    event.preventDefault();

    axios
      .post("/addbudget", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then((response) => {
        console.log(response.data);
        setFetchData(!fetchData);
        // setBudgets([...budgets, response.data.budjet]);
      })
      .catch((error) => console.error("Failed to add budget:", error));

    // if (formData.id === null) {
    //     // Add new budget
    //     setBudgets([...budgets, { ...formData, id: budgets.length + 1 }]);
    // } else {
    //     // Edit existing budget
    //     setBudgets(budgets.map(budget => (budget.id === formData.id ? formData : budget)));
    // }
    handleClose();
  };

  const editBudget = (budget) => {
    setFormData(budget);
    handleOpen();
  };

  const deleteBudget = (id) => {
    axios
      .delete(`/budget/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then((response) => {

        setBudgets(budgets.filter((budget) => budget._id !== id));
      })
      .catch((error) => console.error("Failed to delete budget:", error));
  };
  
  return (
    <Box sx={{ margin: 4 }}>
      <Button variant="contained" 
      sx={{
        marginRight: '10px',
        mt: 2,
        backgroundColor: '#487852', // Green
        '&:hover': {
      backgroundColor: '#6bb77b'
    }
      }}
      onClick={handleOpen}>
        Add Budget
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Spent</TableCell>
              <TableCell>Remaining</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell>{budget.title}</TableCell>
                <TableCell>${budget.amount}</TableCell>
                <TableCell>{budget.type}</TableCell>
                <TableCell>
                  ${Expenses.find((item) => item.type === budget.type).totalAmount}
                </TableCell>
                <TableCell>
                ${budget.amount - Expenses.filter((item) => item.type === budget.type).reduce((acc, item) => acc + item.totalAmount, 0)}
                </TableCell>
                <TableCell>
                  <Button onClick={() => editBudget(budget)}>Edit</Button>
                  <Button onClick={() => deleteBudget(budget._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Budget Form Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.id ? "Edit Budget" : "Add Budget"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.amount}
            onChange={handleFormChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleFormChange}
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
          <Button onClick={addOrEditBudget}>
            {formData.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BudgetPage;
