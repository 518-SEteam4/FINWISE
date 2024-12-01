import "./App.css";
import { GlobalContextProvider } from "./Context/GlobalContext";
import { SignUpContextProvider } from "./Context/SignupContext";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Continue from "./Pages/Continue";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import ErrorSnackbar from "./Snackbar/ErrorSnackbar";
import SuccessSnackbar from "./Snackbar/SuccessSnackbar";
import Profile from "./Pages/Profile";
import Budget from "./Pages/Budget";
import LandingPage from "./Pages/LandingPage";
import Calendar from "./NewCalenderComponent";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import CalendarView from "./Components/CalenderView";
import View from "./Components/VIew";
import Tracker from "./Pages/Tracker";
import ExpenseTracker from "./Components/ExpenseTracker";
import Reminder from "./Pages/Reminder";
import Goals from "./Pages/Goals";
// import Signup from './Components/Signup';
function App() {
  const theme = createTheme({
    breakpoints: {
      values: {
        xxs: 0,
        xs: 414,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
    <GlobalContextProvider>
      <SignUpContextProvider>
        <ErrorSnackbar/>
        <SuccessSnackbar/>
        <Router>
          <Routes>
            <Route path="/" element={< LandingPage/>} />
            <Route exact path="/continue" element={<Continue />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/view/:date" element={<View/>}/>
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/reminder" element={<Reminder/>}/>
            <Route path="/goals" element={<Goals/>}/>
            {/* <Route path="/Signup" element={x<Signup/>} /> */}

            {/* <Route path="/landingpage" element={<Budget />} /> */}
          </Routes>
        </Router>
      </SignUpContextProvider>
    </GlobalContextProvider>
    </ThemeProvider>
  );
}

export default App;
