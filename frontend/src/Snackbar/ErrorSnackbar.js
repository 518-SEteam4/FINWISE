import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { GlobalContext } from '../Context/GlobalContext';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} sx={{width:"100%"}} variant="filled" {...props} />;
});

export default function ErrorSnackbar() {
  const {ERROR,SETERROR} =React.useContext(GlobalContext)
  

  const handleClick = () => {
    SETERROR("");
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    SETERROR("");
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      <Snackbar open={ERROR!==""} autoHideDuration={6000} onClose={handleClose}>
        {/* <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          This is a success message!
        </Alert> */}
        <Alert severity="error" onClose={handleClose} sx={{width:"100%"}} >{ERROR} </Alert>
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </Stack>
  );
}