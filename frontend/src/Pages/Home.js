import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import axios from "../baseurl"
import ResponsiveDrawer from "../Components/Sidebar";
import CalendarView from "../Components/CalenderView";
import Calendar from "../NewCalenderComponent";

const AppHeader = ({ email, handleLogout }) => {
  return (
    //rgb(60, 0, 97)
    <AppBar position="static" sx={{background: '#4169e1'}}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <MailIcon sx={{ marginRight: 1 }} />
          <Typography variant="h6">{email}</Typography>
        </Box>
        <Button color="inherit" onClick={handleLogout} sx={{fontWeight:'bold'}}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default function Home() {
  const navigate = useNavigate();

  const [Email, setEmail] = React.useState("");
  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/");
  };

  useEffect(() => {
    const verifyUser = async () => {
      const Token = localStorage.getItem("Token");
      if (!Token) {
        navigate("/");
      } else {
        axios
          .post("/VerifyUser/" + Token, {}, { withCredentials: true })
          .then((res) => {
            if(res.data.status){
                setEmail(res.data.username)
            }else{
                localStorage.removeItem("Token");
                navigate("/")
            }
          });
      }
    };
    verifyUser();
  }, [navigate]);

  return (
    <>
      {/* <AppHeader email={Email} handleLogout={handleLogout} /> */}
      <ResponsiveDrawer header={<AppHeader email={Email} handleLogout={handleLogout} />} children={<Calendar/>}/>
      {/* <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="60vh"
        >
          <Typography variant="h4" gutterBottom>
            Welcome to the Dashboard
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection={"column"}
            gap={2}
            mt={4}
          >
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: 5,
                color: "black",
                fontWeight: "bold",
              }}
              size="large"
              onClick={() => navigate("/chat")}
            >
              Find My Right Career
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                textTransform: "none",
                borderRadius: 5,
                color: "black",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/chat")}
            >
              Take ME to Next Career Level
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                textTransform: "none",
                borderRadius: 5,
                color: "black",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/test")}
            >
              Take Test
            </Button>
          </Box>
        </Box>
      </Container> */}
    </>
  );
}
