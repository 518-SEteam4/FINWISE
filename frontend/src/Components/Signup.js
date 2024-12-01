import { Card, Typography ,Box,Divider} from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breakpoints } from "./Breakpoints";
import ButtonCustom from "./ButtonCustom";
import Error from "./Error";
import ForgotPasswordText from "./ForgotPasswordText";
import Input from "./Input";
import { Signin } from "../Functions/Registration";
import { SignUpContext } from "../Context/SignupContext";
import { GlobalContext } from "../Context/GlobalContext";
import Label from "./Label";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import axios from '../baseurl'
export default function Signup({
  view,
  setView,
  Email,
  setEmail,
  password,
  setpassword,
  username,
  setUsername,
  mobile,
  setMobile,
}) {
  const [checked, setchecked] = useState(false);

  const [confirmPassword,setConfirmPassword]=useState("")

  const [Err, setErr] = useState("");
  const { SigninData, setSigninData, setSignUpData, SignUpData } =
    useContext(SignUpContext);
  const { setSpin, SETSUCCESS, SETERROR } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleSuccess = (response) => {
    console.log("Login Success:", response.credential);
    const credential = response.credential; // Get the JWT token
    const decodedToken = jwtDecode(credential); 
    console.log(decodedToken)
    axios.post("/auth",{
      m:decodedToken.email,
      p:"Change143",
      username:decodedToken.name,
      mobile:""
    }).then((res)=>{
      localStorage.setItem('Token', res.data.Token)
      navigate("/home")
    })
    // You can decode the JWT for user information if needed
    // Example: jwt_decode(response.credential)
  };

  const handleError = () => {
    console.error("Login Failed");
  };

  return (
    <Card
      variant="none"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: Breakpoints("100%", 370, 370, 370, 370, 370),
        borderRadius: 3,
      }}
    >
      <div  style={{
        padding:'10px',
      }}>
      <GoogleOAuthProvider
        clientId={
          "485317002576-gact7fta5a7tp74t4bsieucnl7rbr580.apps.googleusercontent.com"
        }
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          
        />
      </GoogleOAuthProvider>
      </div>

      <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        my: 2, // Margin on top and bottom
      }}
    >
      <Divider sx={{ flexGrow: 1 ,borderWidth: "1px" }}  />
      <Typography
        variant="body1"
        sx={{
          mx: 2, // Margin left and right
          whiteSpace: "nowrap", // Prevent text wrapping
        }}
      >
        or
      </Typography>
      <Divider sx={{ flexGrow: 1 ,borderWidth: "1px"}} />
    </Box>

      <Error msg={Err} mb={1} mx={0}></Error>

      {/* <form>
                      <p>Please login to your account</p>

                      <div data-mdb-input-init class="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example11"
                          class="form-control"
                          placeholder="Phone number or email address"
                        />
                        <label class="form-label" for="form2Example11">
                          Username
                        </label>
                      </div>

                      <div data-mdb-input-init class="form-outline mb-4">
                        <input
                          type="password"
                          id="form2Example22"
                          class="form-control"
                        />
                        <label class="form-label" for="form2Example22">
                          Password
                        </label>
                      </div>

                      <div class="text-center pt-1 mb-5 pb-1">
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          class="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                          type="button"
                        >
                          Log in
                        </button>
                        <a class="text-muted" href="#!">
                          Forgot password?
                        </a>
                      </div>

                      <div class="d-flex align-items-center justify-content-center pb-4">
                        <p class="mb-0 me-2">Don't have an account?</p>
                        <button
                          type="button"
                          data-mdb-button-init
                          data-mdb-ripple-init
                          class="btn btn-outline-danger"
                        >
                          Create new
                        </button>
                      </div>
                    </form> */}
      {/* <Label text={"Sign in / Sign up"} ></Label> */}
      <Typography sx={{ mt: 0 }} fontFamily={"sans-serif"}>
        Username
      </Typography>
      <Input
        placeholder={"username"}
        mt={0.1}
        BorderColor={"black"}
        type="text"
        mx={0}
        state={username}
        setstate={setUsername}
      ></Input>
  
      <Typography sx={{ mt: 0 }} fontFamily={"sans-serif"}>
        Mobile Number
      </Typography>
      <Input
        placeholder={"Mobile Number"}
        mt={0.1}
        BorderColor={"black"}
        type="text"
        mx={0}
        state={mobile}
        setstate={setMobile}
      ></Input>
      <Typography sx={{ mt: 0 }} fontFamily={"sans-serif"}>
        Email address
      </Typography>
      <Input
        placeholder={"Email"}
        mt={0.1}
        BorderColor={"black"}
        type="text"
        mx={0}
        state={Email}
        setstate={setEmail}
      ></Input>
      {/* <Error msg={Err} mb={1} mx={0}></Error> */}
      {/* <CheckBoxCustom
        checked={checked}
        text={"Signin with otp"}
        onChangeChecked={() => ToggleTrueFalse(checked, setchecked)}
      >
      </CheckBoxCustom> */}
      <Typography>Password</Typography>
      <Input
        placeholder={"Password"}
        BorderColor={"black"}
        mt={0.1}
        type="password"
        mx={0}
        disabled={checked}
        state={password}
        setstate={setpassword}
      ></Input>
       <Typography>Confirm password</Typography>
       <Input
        placeholder={"Re Enter Password"}
        BorderColor={"black"}
        mt={0.1}
        type="password"
        mx={0}
        disabled={checked}
        state={confirmPassword}
        setstate={setConfirmPassword}
      ></Input>
      {/* <Error msg={true?"Coundn't Find the Careersstudio account associated with this email":""} mb={1} mx={2}></Error> */}

      <ButtonCustom
        text={"Signup"}
        borderRadius={1}
        mx={0}
        my={2}
        mt={3}
        mb={4}
        Click={() =>
          Signin(
            Email,
            password,
            checked,
            setErr,
            navigate,
            SigninData,
            setSigninData,
            setSignUpData,
            SignUpData,
            setSpin,
            SETERROR,
            SETSUCCESS,
            view,
            setView,
            "signup",
            username,
            mobile,
            confirmPassword
          )
        }
      ></ButtonCustom>
      <div class="d-flex align-items-center justify-content-center pb-4">
        <p class="mb-0 me-2">Already have an Account ?</p>
        <button
          type="button"
          data-mdb-button-init
          data-mdb-ripple-init
          class="btn btn-outline-danger"
          onClick={() => setView("default")}
        >
          Signin
        </button>
      </div>
      {/* <Typography sx={{ fontWeight: "bold", color: "blue", textAlign: "center", }}>New to Careersstudio? <Link style={{ textDecoration: "none" }} to="/sign-up">Join now</Link></Typography> */}
    </Card>
  );
}