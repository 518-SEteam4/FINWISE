import { Button } from '@mui/material'
import React from 'react'

export default function ButtonCustom({text, mx, Click, borderRadius=50, mt=2, mb=2}) {
  return (
    <Button 
      variant="contained"  
      sx={{
        mt: mt,
        mb: mb,
        backgroundColor: '#487852', // Base green color
        '&:hover': {
          backgroundColor: '#6bb77b' // Hover green color
        },
        borderRadius: borderRadius,
        textTransform: 'none', // Optional: prevents uppercase text
        boxShadow: 'none', // Optional: removes shadow
      }}
      disableRipple={true} 
      disableElevation 
      onClick={()=>Click()}
    >
      {text}
    </Button>
  )
}