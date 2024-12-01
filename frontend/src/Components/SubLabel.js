import { Typography } from '@mui/material'
import React from 'react'

export default function SubLabel({text,mx,my}) {
  return (
   <Typography sx={{fontSize:14,fontWeight:"bold",mx:mx,my:my}}>{text}</Typography>
  )
}
