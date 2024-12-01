import { Card,Box,Button,Typography} from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breakpoints } from './Breakpoints'
import ButtonCustom from './ButtonCustom'

import Error from './Error'

import Input from './Input'
import Label from './Label'

import { ForgetPassword } from '../Functions/Registration'
import { SignUpContext } from '../Context/SignupContext'
import { GlobalContext } from '../Context/GlobalContext'
export default function NewPassword({ Email, setView }) {

  const [otp, setotp] = useState("")
  const [checked, setchecked] = useState(false)
  const [password, setpassword] = useState("")
  const [password2, setpassword2] = useState("")
  const [Err, setErr] = useState("")


  const { ForgetPasswordData, setForgetPasswordData } = useContext(SignUpContext)

  const { setSpin, SETSUCCESS, SETERROR } = useContext(GlobalContext)

  const [response, setresponse] = useState()

  const navigate = useNavigate()

  // useEffect(() => {

  //   if(ForgetPasswordData.m===""){
  //     navigate("/forgotpassword")
  //   }else{
  //     SendotpToVerify()

  //   }

  // }, [])
  var SentOtp = ""


  console.log(SentOtp)
  return (

    <Card variant='none' sx={{ display: "flex", flexDirection: "column", width: Breakpoints("100%", 370, 370, 370, 370, 370) }}>
      <Label text={"Reset passsword"} mx={0}></Label>

      <Error msg={Err} mb={1} mx={0}></Error>
      <Input placeholder={"Password"} BorderColor={"black"} mt={2} type="password" mx={0} disabled={checked} state={password} setstate={setpassword}></Input>
      {/* <Error msg={true?"Coundn't Find the Careersstudio account associated with this email":""} mb={1} mx={2}></Error> */}
      <Input placeholder={"Re Enter Password"} BorderColor={"black"} mt={2} type="password" mx={0} disabled={checked} state={password2} setstate={setpassword2}></Input>


      <ButtonCustom
        text={"Reset Password"}
        mx={0}
        Click={() => {
          if (password === password2) {
            ForgetPassword(otp, password, setErr, SentOtp, ForgetPasswordData, navigate, SETERROR, SETSUCCESS, setView, Email)
          } else {
            setErr("Password doesn't match")
          }

        }}
      >

      </ButtonCustom>
      <Box sx={{ mx: 0, mt: 1,mb:4 }}>
      <Button fullWidth onClick={()=>setView('forgotpassword')} sx={{ textDecoration: "none",m:0,p:0,textTransform:"none",justifyContent:'center',display:"flex",alignSelf:"end",textAlign:"end" }}>
        <Typography color={"#0A66C2"} sx={{ fontWeight: "bold",alignSelf:"center",textAlign:"center" }}> Go back </Typography>
      </Button>
    </Box>
      
    </Card>

  )
}
