import { Card ,Box,Button,Typography} from '@mui/material'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breakpoints } from './Breakpoints'
import ButtonCustom from './ButtonCustom'
import Error from './Error'
import Input from './Input'
import Label from './Label'
import SubLabel from './SubLabel'
import { EmailCheckPassword } from '../Functions/Common'
import { SignUpContext } from '../Context/SignupContext'
import { GlobalContext } from '../Context/GlobalContext'

export default function Fp({view, setView,Email,setEmail,setFrom}) {

  const [Err, setErr] = useState("")
 
  const {ForgetPasswordData,setForgetPasswordData}=useContext(SignUpContext)

  const {setSpin,SETSUCCESS,SETERROR} = useContext(GlobalContext)

  const navigate = useNavigate()

  return (
    <Card variant='none' sx={{ display: "flex", flexDirection: "column", width: Breakpoints("100%", 370, 370, 370, 370, 370) }}>
      <Label text={"Forget Password"} mx={0}></Label>
      <SubLabel text={"Recover your password with email"} mx={0}></SubLabel>
      <Input placeholder={"Email"} mt={2} BorderColor={"black"} type="text" mx={0} state={Email} setstate={setEmail}></Input>
      <Error msg={Err} mb={1} mx={0}></Error>
      <ButtonCustom
        text={"Continue"}
        mx={2}
        Click={() => EmailCheckPassword(Email,navigate,setErr,SETERROR,setForgetPasswordData,ForgetPasswordData,view,setView,setFrom)}
      >
      </ButtonCustom>

      <Box sx={{ mx: 0, mt: 1,mb:4 }}>
      <Button fullWidth onClick={()=>setView('default')} sx={{ textDecoration: "none",m:0,p:0,textTransform:"none",justifyContent:'center',display:"flex",alignSelf:"end",textAlign:"end" }}>
        <Typography color={"#0A66C2"} sx={{ fontWeight: "bold",alignSelf:"center",textAlign:"center" }}> Go back </Typography>
      </Button>
    </Box>
    </Card>
  )
}
