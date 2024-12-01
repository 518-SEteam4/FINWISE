import { Box, Card,Button,Typography } from '@mui/material'
import React, {  useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breakpoints } from './Breakpoints'
import ButtonCustom from './ButtonCustom'

import Input from './Input'
import Label from './Label'
import { SendOtp } from '../Functions/Registration'
import { useContext } from 'react'
import { GlobalContext } from '../Context/GlobalContext'
import axios from '../baseurl'

import { SignUpContext } from '../Context/SignupContext'

export default function VerifyOtp({Email,from,setView}) {
  const navigate = useNavigate()
  const [response, setresponse] = useState({})
  const [OtpEntered, setOtpEntered] = useState("")
  const { Spin, setSpin, SETSUCCESS, SETERROR } = useContext(GlobalContext)
  const { SigninData, setSigninData, setSignUpData, SignUpData } = useContext(SignUpContext)



  const SendotpToVerify = () => SendOtp(Email, setresponse, setSpin, SETSUCCESS, SETERROR)

  return (

          <Card variant='none' sx={{ display: "flex", flexDirection: "column", width: Breakpoints("100%", 370, 370, 370, 370, 370) }}>
            <Label text={("Enter 4 digit otp sent to " + Email)} fs={16} mx={0}></Label>
            <Input placeholder={"Enter 4 digit otp"} mt={2} BorderColor={"black"} type="text" mx={0} state={OtpEntered} setstate={setOtpEntered}></Input>
            <ButtonCustom
              text={"Resend otp"}
              mx={0}
              Click={() => {
                SendotpToVerify()
              }}
            ></ButtonCustom>
            <ButtonCustom
              text={"Verify Otp"}
              mx={0}
              Click={async () => {
                const mail = Email
                setSpin(true)
                
                await axios.post("/verifyotp", {
                  m:mail,
                  otp: OtpEntered
                },{ withCredentials: true }).then((res) => {
                  setSpin(false)
                  if (res.data.verified) {
                    SETSUCCESS("otp verified successfully")
                    if(from!=="forgotpassword"){
                      localStorage.setItem('Token', res.data.Token);
                      setSignUpData({})
                    setSigninData({})
                    navigate("/home")
                    }else{
                      setView("enternewpassword")
                    }
                    

                  } else {
                    SETERROR("Please Enter valid otp sent to mail")
                  }

                }).catch((err) => {
                  setSpin(false)
                  SETERROR("Network Error")
                })
                // const encrypted=encryptRsa.decryptStringWithRsaPrivateKey({ 
                //   text: response.otp,
                //   privateKey:response.privateKey

                // });
                // if(Number(encrypted)===Number(OtpEntered)){
                //   if(SignUpData.m!==""){
                //    await PostSignupDetails({...SignUpData}).then(()=>{
                //      setSpin(false)
                //      SETSUCCESS("Successfully Created account")

                //      navigate("/")

                //    }).catch(()=>{
                //     setSpin(false)
                //     SETERROR("Unable to signup try again")
                //    })
                //   }else if (SigninData.m!==""){

                //     await ReceiveCookie(SigninData.id).then(()=>{
                //       setSpin(false)
                //       navigate('/')
                //       SETSUCCESS("Successfully logged in")
                //     }).catch(()=>{
                //       setSpin(false)
                //       SETERROR("unable to sign in Try again")
                //     })
                //   }
                // }else{
                //   setSpin(false)
                //   SETERROR("Please Enter valid otp sent to mail")
                // }
              }}
            ></ButtonCustom>

<Box sx={{ mx: 0, mt: 1,mb:4 }}>
      <Button fullWidth onClick={()=>setView('forgotpassword')} sx={{ textDecoration: "none",m:0,p:0,textTransform:"none",justifyContent:'center',display:"flex",alignSelf:"end",textAlign:"end" }}>
        <Typography color={"#0A66C2"} sx={{ fontWeight: "bold",alignSelf:"center",textAlign:"center" }}> Go back </Typography>
      </Button>
    </Box>

          </Card>
       
  )
}
