import React, { useState } from 'react'
import InputBase from '@mui/material/InputBase';
import { IconButton, Typography, useTheme } from '@mui/material';


export default function Input({ placeholder, mt, mb, BorderColor, type,mx,disabled=false,state,setstate}) {
  const theme=useTheme()
  const [showPassword, setshowPassword] = useState(false)

  const ChangeHideorShow = () => {
    setshowPassword(!showPassword)
  }
  return (
    <InputBase
      size="medium"
      value={state}
      disabled={disabled}
      type={type === "password" ? !showPassword ? "password" : "text" : "text"}
      variant="filled"
      sx={{ border: "2px solid " +theme.palette.divider, px: 1, borderRadius: 1, py: type==="text"?0.7:0.1, mt: mt, mb: mb,mx:mx }}
      placeholder={placeholder}
      endAdornment={type === "password" ?
        <IconButton onClick={() => ChangeHideorShow()}>
          <Typography>{showPassword ? "Hide" : "Show"}</Typography>
        </IconButton> : ""
      }
      onChange={(e)=>{
        setstate(e.target.value)
      }}
      
    />
  )
}
