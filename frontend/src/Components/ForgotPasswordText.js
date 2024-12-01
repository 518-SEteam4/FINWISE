import { Box, Button, Typography } from '@mui/material'

import React from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordText({ mx ,view,setview}) {
  
  return (
    <Box sx={{ mx: mx, mt: 1,mb:4 }}>
      <Button fullWidth onClick={()=>setview('forgotpassword')} sx={{ textDecoration: "none",m:0,p:0,textTransform:"none",justifyContent:'center',display:"flex",alignSelf:"end",textAlign:"end" }}>
        <Typography color={"#0A66C2"} sx={{ fontWeight: "bold",alignSelf:"center",textAlign:"center" }}> Forgot Password? </Typography>
      </Button>
    </Box>
  )
}
