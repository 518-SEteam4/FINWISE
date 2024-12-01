import { Typography } from '@mui/material'
import React from 'react'

export default function Error({msg,mb,mx}) {
  return (
    <Typography sx={{color:"#D11124",fontSize:14,fontWeight:"bold",mb:mb,mx:mx}}>{msg}</Typography>
  )
}
