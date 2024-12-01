import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { GlobalContext } from '../Context/GlobalContext';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} sx={{width:"100%"}} variant="filled" {...props} />;
});

export default function SuccessSnackbar() {
  const {SUCCESS,SETSUCCESS} =React.useContext(GlobalContext)
  

  const handleClick = () => {
    SETSUCCESS("");
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    SETSUCCESS("");
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      <Snackbar open={SUCCESS!==""} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {SUCCESS}
        </Alert>
        {/* <Alert severity="error" onClose={handleClose}  >{ERROR} </Alert> */}
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </Stack>
  );
}