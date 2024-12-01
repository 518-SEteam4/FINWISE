import { Typography } from '@mui/material'
import React from 'react'

export default function Label({text,mx,fs=25}) {
  return (
   <Typography sx={{fontSize:fs,mt:2,fontWeight:"bold",mx:mx}}>{text}</Typography>
  )
}
