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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "../baseurl"; // Adjust base URL as necessary

const initialFormState = {
  _id: null,
  title: "",
  amount: 0,
};

function GoalPage() {
  const [goals, setGoals] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [totalAmount, setTotalAmount] = useState(0); // Example variable for total distribution amount
  const [loader,setloader] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
  };

  // Fetch goals from the server
  useEffect(() => {
    axios
      .get("/goals", {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then((response) => {
        setGoals(response.data.goals);
      })
      .catch((error) => console.error("Failed to fetch goals", error));
  }, []);

  useEffect(() => {
    
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = currentDate;

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    axios
      .post("/amount", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then((response) => {
        setloader(false);
        setTotalAmount(response.data.netIncome);
      })
      .catch((error) => console.error("Failed to fetch goals", error));
  }, []);

  // Handle form changes
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or edit goal
  const addOrEditGoal = (event) => {
    event.preventDefault();

    if (formData._id === null) {
      // Adding a new goal
      axios
        .post("/goals", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
        })
        .then((res) => {
          setGoals([...goals, {...res.data}]); // Temporary ID, replace with response ID
        })
        .catch((error) => console.error("Failed to add goal:", error));
    } else {
      // Editing an existing goal
      axios
        .put(`/goals/${formData._id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
        })
        .then(() => {
          setGoals(
            goals.map((goal) =>
              goal._id === formData._id ? { ...goal, ...formData } : goal
            )
          );
        })
        .catch((error) => console.error("Failed to update goal:", error));
    }

    handleClose();
  };

  // Populate form for editing
  const editGoal = (goal) => {
    setFormData(goal);
    handleOpen();
  };

  // Delete goal
  const deleteGoal = (id) => {
    axios
      .delete(`/goals/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then(() => {
        setGoals(goals.filter((goal) => goal._id !== id));
      })
      .catch((error) => console.error("Failed to delete goal:", error));
  };

  // Calculate split amount and achieved percentage
  const splitAmount = totalAmount / goals.length;
  const calculateAchievedPercentage = (goalAmount) => {
    const achievedPercentage = (splitAmount / goalAmount) * 0;
    return achievedPercentage >= 100 ? 100 : achievedPercentage;
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
        Add Goal
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Achieved (%)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loader?<Box sx={{width:"100%",display:"flex",alignItems:"center",justifyContent:'center',alignContent:"center",ml:'100%',p:5}}><CircularProgress sx={{alignSelf:'center'}}/></Box>:goals.map((goal) => (
              <TableRow key={goal.id}>
                <TableCell>{goal.title}</TableCell>
                <TableCell>{goal.amount}</TableCell>
                
                <TableCell>
                  <Box position="relative" display="inline-flex" alignItems="center" justifyContent={"center"}>
                    <CircularProgress
                      variant="determinate"
                      value={calculateAchievedPercentage(goal.amount)}
                      sx={{
                        color:
                          calculateAchievedPercentage(goal.amount) === 100
                            ? "green"
                            : "red",
                      }}
                    />
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      sx={{
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Typography variant="caption" component="div" color="textSecondary">
                        {`${Math.round(calculateAchievedPercentage(goal.amount))}%`}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button onClick={() => editGoal(goal)}>Edit</Button>
                  <Button onClick={() => deleteGoal(goal._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Goal Form Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {formData._id ? "Edit Goal" : "Add Goal"}
        </DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addOrEditGoal}>
            {formData.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GoalPage;