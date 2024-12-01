import React, { useState, useEffect } from "react";
import axios from "../baseurl"; // Ensure this path matches your actual axios setup
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { tr } from "date-fns/locale";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { green, red, blue, grey } from "@mui/material/colors";

function Profile() {
  const [user, setUser] = useState({
    username: "",
    m: "", // Assuming 'm' is the email
    mobile: "",
  });

  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [totalIncoming, setTotalIncoming] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const getAccessToken = async () => {
    const response = await axios.post(
      `/getAccessToken`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      }
    );
    return response.data.accessToken;
  };
  const fetchLinkedAccounts = async (accessToken, providerAccountId) => {
    const response = await axios.post(
      `/getLinkedAccounts`,
      {
        providerAccountId: providerAccountId,
        accessToken: accessToken,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      }
    );
    return response.data;
  };
  const getStatusIcon = (status) => {
    return status === "ACTIVE" ? (
      <CheckCircleIcon sx={{ color: green[500] }} />
    ) : (
      <CancelIcon sx={{ color: red[500] }} />
    );
  };

  const getAccountIcon = (container) => {
    return container === "creditCard" ? (
      <CreditCardIcon sx={{ color: blue[500] }} />
    ) : (
      <AccountBalanceWalletIcon sx={{ color: grey[600] }} />
    );
  };
  const initializeFastLink = async () => {
    try {
      setIsModalOpen(true);
      const token = await getAccessToken();
      // const userSession = await getUserSessionToken(token);

      window.fastlink.open(
        {
          fastLinkURL:
            "https://fl4.sandbox.yodlee.com/authenticate/restserver/fastlink",
          accessToken: token,
          params: {
            configName: "Aggregation",
          },
          onSuccess: async (data) => {
            console.log("Account linked:", data);

            // Fetch all linked accounts

            // setIsModalOpen(false)
            // setLinkedAccounts(accounts.account || []);

            // // Calculate total incoming transactions for the first linked account
            // if (accounts.account.length > 0) {
            //     const incomingTotal = await fetchMonthlyIncomingTransactions(accounts.account[0].id);
            //     setTotalIncoming(incomingTotal);
            // }
          },
          onError: function (data) {
            // will be called on error. For list of possible message, refer to onError(data) Method.
            console.log(data, "onError");
          },
          onClose: async function (data) {
            if (data.sites && data.sites.length > 0) {
              const lastSite = data.sites[data.sites.length - 1];
              if (lastSite.status === "SUCCESS") {
                await fetchLinkedAccounts(token, lastSite.providerAccountId);
              }
            }
            // will be called called to close FastLink. For list of possible message, refer to onClose(data) Method.
            console.log(data, "onClose");
            setIsModalOpen(false);
          },
          onEvent: function (data) {
            // will be called on intermittent status update.
            console.log(data, "onEvent");
          },
        },
        "container-fastlink"
      );
    } catch (error) {
      console.error("Error initializing FastLink:", error);
    }
  };
  useEffect(() => {
    axios
      .get("/getuserinfo", {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then((response) => {
        setUser(response.data);
        setAccounts(response.data.accounts);
      })
      .catch((error) => console.error("Failed to fetch profile:", error));
  }, []);

  const handleOpenPasswordModal = () => {
    setOpenPasswordModal(true);
    setPasswords({ password: "", confirmPassword: "" });
    setPasswordErrors({ password: "", confirmPassword: "" });
  };
  const handleClosePasswordModal = () => setOpenPasswordModal(false);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    // Optionally re-fetch the user data to reset any unsaved changes
  };

  const handleSave = () => {
    axios
      .post("/editprofile", user, {
        headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
      })
      .then(() => {
        console.log("Profile updated successfully");
        setEditMode(false);
      })
      .catch((error) => console.error("Failed to update profile:", error));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const validatePasswords = () => {
    let isValid = true;
    let errors = { password: "", confirmPassword: "" };

    if (!passwords.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (passwords.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (!passwords.confirmPassword) {
      errors.confirmPassword = "Confirming password is required";
      isValid = false;
    } else if (passwords.password !== passwords.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChangePassword = () => {
    if (validatePasswords()) {
      console.log("Updating password...");
      // Implement password update logic here
      setOpenPasswordModal(false);
      //make api call to update password
      axios
        .post(
          "/changepassword",
          {
            p: passwords.password,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        )
        .then((response) => {
          // Reset passwords and errors after successful update
          setPasswords({ password: "", confirmPassword: "" });
          setPasswordErrors({ password: "", confirmPassword: "" });
        })
        .catch((error) => console.error("Failed to update password:", error));
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <TextField
        fullWidth
        label="Username"
        margin="normal"
        name="username"
        value={user.username}
        onChange={handleChange}
        disabled={!editMode}
      />
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        name="m"
        value={user.m}
        onChange={handleChange}
        disabled={!editMode}
      />
      <TextField
        fullWidth
        label="Mobile"
        margin="normal"
        name="mobile"
        value={user.mobile}
        onChange={handleChange}
        disabled={!editMode}
      />
      {editMode ? (
        <>
          <Button
            variant="contained"
            sx={{
              marginRight: '10px',
              mt: 2,
              backgroundColor: '#487852', // Green
          '&:hover': {
            backgroundColor: '#6bb77b'
          }
            }}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant="contained"
            sx={{
              marginRight: '10px',
              border: 'none',
              color: 'white',
              mt: 2,
              backgroundColor: '#487852', // Green
          '&:hover': {
            backgroundColor: '#6bb77b'
          }
            }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          sx={{
            marginRight: '10px',
            border: 'none',
            color: 'white',
            mt: 2,
            backgroundColor: '#487852', // Green
            '&:hover': {
              backgroundColor: '#6bb77b'
            }
          }}
          onClick={handleEdit}
        >
          Edit Profile
        </Button>
      )}
      <Button
        variant="contained"
        sx={{
          border: 'none',
          color: 'white',
          mt: 2,
          backgroundColor: '#487852', // Green
          '&:hover': {
            backgroundColor: '#6bb77b'
          }
        }}
        onClick={handleOpenPasswordModal}
      >
        Change Password
      </Button>

      {/* Password Change Modal */}
      <Dialog open={openPasswordModal} onClose={handleClosePasswordModal}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="password"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwords.password}
            onChange={handlePasswordChange}
            error={!!passwordErrors.password}
            helperText={passwordErrors.password}
          />
          <TextField
            margin="dense"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.confirmPassword}
            helperText={passwordErrors.confirmPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button className="btncolor" onClick={handleChangePassword}>Save</Button>
          <Button className="btncolor" onClick={handleClosePasswordModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
      

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="fastlink-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="fastlink-modal" variant="h6" component="h2">
            Link Your Bank Account
          </Typography>
          <div id="container-fastlink"></div> {/* FastLink will render here */}
        </Box>
      </Modal>

      <Grid container spacing={3} sx={{mt:2}}>
        {accounts.map((account, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3,display: "flex",
              flexDirection: "column",
              height: "100%", }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: blue[100], mr: 2 }}>
                    {getAccountIcon(account.container)}
                  </Avatar>
                  <Typography variant="h6">{account.accountName}</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Account Number: {account.accountNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Account Type: {account.accountType}
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  {getStatusIcon(account.accountStatus)}
                  <Typography
                    variant="body2"
                    color={
                      account.accountStatus === "ACTIVE"
                        ? "success.main"
                        : "error.main"
                    }
                    ml={1}
                  >
                    {account.accountStatus}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        sx={{
          marginRight: '10px',
          border: 'none',
          color: 'white',
          mt: 2,
          backgroundColor: '#487852', // Green
          '&:hover': {
            backgroundColor: '#6bb77b'
          }
        }}
        variant="contained"
        onClick={() => {
          initializeFastLink();
        }}
      >
        Link Accounts
      </Button>
    </Box>
  );
}

export default Profile;
