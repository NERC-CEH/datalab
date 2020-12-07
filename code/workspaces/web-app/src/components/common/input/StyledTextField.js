import React from 'react';
import TextField from '@material-ui/core/TextField';

const StyledTextField = props => (
  <TextField
    margin="dense"
    variant="outlined"
    {...props}
  />
);

export default StyledTextField;
