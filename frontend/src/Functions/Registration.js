import axios from "../baseurl";

import { CheckForEmpty, EmailValidate, PasswordValidate, PostSignupDetails, SignInCall, SignUpCall } from "./Common";




export const Signin = async (Email, Password, Checked, Error, navigate, SigninData, setSigninData, setSignUpData, SignUpData, setSpin, SETERROR, SETSUCCESS,view,setView,from='signin',username,mobile) => {
    setSpin(true)
    Error("")
     if(from!=="signin" && CheckForEmpty(username)){
            Error("Username is required")
            setSpin(false)
            return
     }

    if (!CheckForEmpty(Email) && (!CheckForEmpty(Password) )){
        if (EmailValidate(Email)) {
            if(PasswordValidate(Password)){
                await SignInCall({
                    m:Email.toLowerCase(),
                    p:Password,
                    username:username,
                    mobile:mobile
                }).then(async (res) => {
                      if(from==="signin"){
                        if (res.data.status ) {

                            if(res.data.navigate==="login"){
                                SETSUCCESS("Successfully logged in")
                                localStorage.setItem('Token', res.data.Token)
                                navigate('/home')
                            }else{
                                Error("Please Enter the Valid Mail and Password")
                            }
                            // setSignUpData({ ...SignUpData, m: "" })
                            // setSigninData({ ...SigninData, m: Email.toLowerCase(), id: IsUserAvailable.data.id })
                            
                            
                        } else {
                            Error("Please Enter the Valid Mail and Password")
                           
                        }
                    }else{
                           console.log(res.data)
                            if(res.data.navigate==="login"){
                                Error("Alredy have an Account with this mail")
                            }else{
                                setView('otp')
                            }
                        
                    }
    
                    }).catch(() => {
                    Error("Network Error try again")
                })
            }else{
                Error("Password Should be atleast 6 Characters")
            }
            


        } else {
            console.log("invalid")
            Error("Mail you have Entered is Invalid , Please Enter the mail own by you")
        }
    } else {
        console.log("required")
        Error("Email and password  are required to signin")
    }
    setSpin(false)
}

export const AgreeAndJoin = async (Email, Password, Error, navigate, setSignUpData, SignUpData,setSpin,setView) => {
    setSpin(true)
    if (!CheckForEmpty(Email) && !CheckForEmpty(Password)) {
        if (EmailValidate(Email)) {
            await SignUpCall({
                m:Email.toLowerCase(),
                p:Password
            
            }).then((IsUserAvailable) => {
                if (IsUserAvailable.data?.error) {
                    setSpin(false)
                    Error("Mail is already registered with Careersstudio")
                } else {
                    if (PasswordValidate(Password)) {
                        setSignUpData({ ...SignUpData, m: Email.toLowerCase(), p: Password })
                        setSpin(false)
                        navigate("/verify-otp")
                    } else {
                        setSpin(false)
                        Error("Password Should be atleast 6 Characters")
                    }
                }
            }).catch(() => {
                setSpin(false)
                Error("Error while signing up Try again")
            })

        }
        else {
            setSpin(false)
            Error("Mail you have Entered is Invalid , Please Enter the mail own by you")
        }

    }
    else {
        setSpin(false)
        Error("Email and password are required")
    }


}
export const ForgetPassword = async (otp, password, Error, Sentotp, ForgetPasswordData, navigate, SETERROR, SETSUCCESS,setView,Email) => {
    if (!CheckForEmpty(password)) {
        if(PasswordValidate(password)){
       
                await axios.post( "/updatepassword", {
                    m: Email,
                    p: password
                }).then((res) => {
                    SETSUCCESS("Successfully updated Password")
                    setView("default")
                }).catch((err) => {
                    console.log(err)
                    SETERROR("unable to update passord try again")
                    
                })
                
    }
    else{
        Error("Password Should be atleast 6 Characters")
    }
        
    } else {
        Error("Password is required")
    }
}
export const SendOtp = async (email, setresponse, setSpin, SETSUCCESS, SETERROR) => {
    setSpin(true)
    await axios.post("/Sendmail", { m: email })
        .then((res) => {
            setresponse(res.data)
            setSpin(false)
            SETSUCCESS("Otp sent successfully")
            return res.data
        }).catch((err) => {
            setSpin(false)
            SETERROR("unable to sent otp try again")
            return err
        })
}


export const CheckLocation = (Location, Error, navigate, setSignUpData, SignUpData) => {

    if (Location === null) {
        Error("Please Select The Location")
    } else {
        setSignUpData({ ...SignUpData, l: Location.description })
        navigate("/enter-details")
    }
}
export const CheckDetails = async (FirstName, LastName, dob, setErr, setSignUpData, SignUpData, navigate, SigninData, setSigninData) => {

    setErr("")
    if (!CheckForEmpty(FirstName) && !CheckForEmpty(LastName) && Object.keys(dob).length) {
        setSignUpData({ ...SignUpData, fn: FirstName, ln: LastName, dob: dob.$d })
        setSigninData({ ...SigninData, m: "" })
        await PostSignupDetails({
            fn: FirstName,
            ln: LastName,
            dob: dob.$d,
            m: SignUpData.m,
            p: SignUpData.p,
            l: SignUpData.l
        }).then(() => {
            navigate("/verify-otp")
        }).catch((err) => {
            console.log(err)
        })
    } else {
        setErr("Firstname,Lastname and dob are required")
    }
}