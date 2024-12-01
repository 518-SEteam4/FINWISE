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
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {  LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "../baseurl"; // Update the axios base URL as necessary

const initialFormState = {
  _id: null,
  recurring: false,
  title: "",
  description: "",
  dateTime: dayjs(),
};

function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [fetchData, setFetchData] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
  };

  // Fetch reminders from the server when the page loads
  useEffect(() => {
    axios
      .get("/reminders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then((response) => {
        setReminders(response.data.reminders);
      })
      .catch((error) => console.error("Failed to fetch reminders", error));
  }, [fetchData]);

  // Handle form changes (input fields)
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateTimeChange = (newDate) => {
    setFormData({ ...formData, dateTime: newDate });
  };

  // Add or edit reminder
  const addOrEditReminder = (event) => {
    event.preventDefault();
    
    if (formData._id === null) {
      // Adding a new reminder
      axios
        .post("/addreminder", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
        })
        .then(() => {
          setFetchData(!fetchData); // Re-fetch reminders
        })
        .catch((error) => console.error("Failed to add reminder:", error));
    } else {
      // Editing an existing reminder
      axios
        .post(`/addreminder`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
        })
        .then(() => {
          setFetchData(!fetchData); // Re-fetch reminders
        })
        .catch((error) => console.error("Failed to update reminder:", error));
    }

    handleClose();
  };

  // Populate form for editing
  const editReminder = (reminder) => {
    reminder.dateTime=dayjs(reminder.dateTime)
    setFormData(reminder);
    handleOpen();
  };

  // Delete reminder
  const deleteReminder = (id) => {
    axios
      .delete(`/reminder/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then(() => {
        setReminders(reminders.filter((reminder) => reminder._id !== id));
      })
      .catch((error) => console.error("Failed to delete reminder:", error));
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
        Add Reminder
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date & Time</TableCell>
              {/* <TableCell>Recurring</TableCell> */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reminders.map((reminder) => (
              <TableRow key={reminder._id}>
                <TableCell>{reminder.title}</TableCell>
                <TableCell>{reminder.description}</TableCell>
                
                <TableCell>
                  {dayjs(reminder.dateTime).format("DD/MM/YYYY HH:mm")}
                </TableCell>
                {/* <TableCell>{reminder.recurring ? "Yes" : "No"}</TableCell> */}
                <TableCell>
                  <Button onClick={() => editReminder(reminder)}>Edit</Button>
                  <Button onClick={() => deleteReminder(reminder._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reminder Form Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {formData.id ? "Edit Reminder" : "Add Reminder"}
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
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleFormChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
           timeSteps={{ minutes: 1 }}
           minutesStep={1}
           sx={{mt:3}}
           views={["year", "month", "day", "hours", "minutes"]}
            label="Date & Time"
            value={formData.dateTime}
            onChange={handleDateTimeChange}

            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          </LocalizationProvider>

            <FormControlLabel
            control={
              <Checkbox
              checked={formData.recurring}
              onChange={(event) =>
                setFormData({ ...formData, recurring: event.target.checked })
              }
              name="recurring"
              color="primary"
              />
            }
            label="Recurring"
            sx={{ ml:3,mt:3 }}
            />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addOrEditReminder}>
            {formData.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReminderPage;