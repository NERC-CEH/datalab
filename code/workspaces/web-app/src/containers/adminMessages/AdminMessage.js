import React, { useState } from 'react';
import { Grid } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Message from '../../components/app/Message';
import PrimaryActionButton from '../../components/common/buttons/PrimaryActionButton';

const styles = theme => ({
  grid: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing(3)} 0`,
    '&:last-child': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  date: {
    fontSize: 'small',
    alignItems: 'center',
    color: theme.palette.secondary[400],
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});

const AdminMessage = ({ classes, message, deleteMessage }) => {
  const [preview, showPreview] = useState(false);

  const expiryString = `Expires: ${new Date(message.expiry).toUTCString()}`;

  return (
    <Grid container spacing={2} className={classes.grid}>
      <Grid item xs={10}>
        <div>{message.message}</div>
      </Grid>
      <Grid item xs={2}>
        <div className={classes.buttonContainer}>
          <Button onClick={() => showPreview(!preview)} color={'primary'} variant={preview ? 'contained' : 'outlined'}>Preview</Button>
          <PrimaryActionButton onClick={() => deleteMessage(message)}>Delete</PrimaryActionButton>
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.date}>{expiryString}</div>
      </Grid>
      <Grid item xs={12} hidden={!preview} id={'messagePreview'}>
        <Message message={message} allowDismiss={false}/>
      </Grid>
    </Grid>
  );
};

AdminMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.shape({
    id: PropTypes.string,
    message: PropTypes.string.isRequired,
    expiry: PropTypes.string,
    created: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(AdminMessage);
