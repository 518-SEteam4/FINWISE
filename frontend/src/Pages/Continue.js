import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Components/Login";
import BlackLogo from "../assets/logo.jpeg";
import Fp from "../Components/Fp";
import VerifyOtp from "../Components/VerifyOtp";
import NewPassword from "../Components/NewPassword";
import "./continue.css";
import Signup from "../Components/Signup";
export default function Continue() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [view, setView] = React.useState("default");
  const [from, setFrom] = useState("");
  const [username,setUsername]=useState("")
  const [mobile,setMobile]=useState("")
//   useEffect(() => {
//     setEmail("");
//     setpassword("");
//     setUsername("")
//   }, [view]);

  useEffect(() => {
   
    //get params
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("to");
    if (myParam==="signup") {
       setView("Signup");
    
        
    }

    const verifyUser = async () => {
      const Token = localStorage.getItem("Token");
      if (Token) {
        navigate("/home");
      }
    };
    verifyUser();
  }, [navigate]);
  return (
    <section class="h-100 gradient-form" >
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-xl-10">
            <div class="card rounded-3 text-black">
              <div class="row g-0">
                <div class="col-lg-6">
                  <div class="card-body p-md-5 mx-md-4">
                    <div class="text-center">
                      <img
                        src={BlackLogo}
                        style={{ width: "185px" }}
                        alt="logo"
                      />
                      <h4 class="mt-1 mb-4 pb-1">Welcome to Finwise</h4>
                    </div>

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

                    {view === "default" && (
                      <Login
                        view={view}
                        setView={setView}
                        Email={Email}
                        setEmail={setEmail}
                        password={password}
                        setpassword={setpassword}
                      >
                        {" "}
                      </Login>
                    )}
                    {view === "Signup" && (
                      <Signup
                        view={view}
                        setView={setView}
                        Email={Email}
                        setEmail={setEmail}
                        password={password}
                        setpassword={setpassword}
                        username={username}
                        setUsername={setUsername}
                        mobile={mobile}
                        setMobile={setMobile}
                      >
                        {" "}
                      </Signup>
                    )}
                    {view === "forgotpassword" && (
                      <Fp
                        view={view}
                        setView={setView}
                        Email={Email}
                        setEmail={setEmail}
                        setFrom={setFrom}
                      ></Fp>
                    )}
                    {view === "otp" && (
                      <VerifyOtp from={from} Email={Email} setView={setView} />
                    )}
                    {view === "enternewpassword" && (
                      <NewPassword
                        from={from}
                        Email={Email}
                        setView={setView}
                      />
                    )}
                  </div>
                </div>
                <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 class="mb-4">We are more than just a company</h4>
                    <p class="small mb-0">
                        FINWISE helps you take control of your financial life. Our powerful tools make it simple to:
                    </p>
                    <ul class="mt-3">
                        <li>Track all your expenses effortlessly</li>
                        <li>Set and manage personalized budgets</li>
                        <li>Create and monitor saving goals</li>
                        <li>Get reminders for upcoming payments</li>
                    </ul>
                    <p class="mt-3">
                        Start your journey to financial wisdom today with FINWISE!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
