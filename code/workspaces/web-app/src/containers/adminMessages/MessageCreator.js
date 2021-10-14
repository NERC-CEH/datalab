import React, { useState } from 'react';
import { Grid, TextField, withStyles } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import moment from 'moment';
import Message from '../../components/app/Message';
import PagePrimaryActionButton from '../../components/common/buttons/PagePrimaryActionButton';

const styles = theme => ({
  creator: {
    padding: `${theme.spacing(4)}px 0`,
  },
});

export const getSevenDaysFromNow = () => moment().startOf('day').add(7, 'days').toDate();

const MessageCreator = ({ classes, createMessage }) => {
  const [preview, showPreview] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedDate, handleDateChange] = useState(getSevenDaysFromNow());

  const clearMessage = () => {
    // Reset values upon successful message creation.
    setMessageText('');
    handleDateChange(getSevenDaysFromNow());
  };

  return (
    <div className={classes.creator}>
      <Typography variant='h5'>Create New Message</Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label={'Message'}
            value={messageText}
            onChange={event => setMessageText(event.target.value)}
            multiline
          />
        </Grid>
        <Grid item xs={2}>
          <DateTimePicker
            variant="inline"
            label={'Expiry'}
            value={selectedDate}
            onChange={handleDateChange}
            ampm={false}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            onClick={() => showPreview(!preview)}
            color={'primary'}
            variant={preview ? 'contained' : 'outlined'}
          >
            Preview
          </Button>
        </Grid>
        <Grid item xs={1}>
          <PagePrimaryActionButton
            onClick={() => createMessage(messageText, selectedDate, clearMessage)}
            disabled={!messageText}
          >
            Create
          </PagePrimaryActionButton>
        </Grid>
        <Grid item xs={12} hidden={!preview} id={'messagePreview'}>
          <Message message={{ message: messageText }} allowDismiss={false} />
        </Grid>
      </Grid>
    </div>
  );
};

MessageCreator.propTypes = {
  classes: PropTypes.object.isRequired,
  createMessage: PropTypes.func.isRequired,
};

export default withStyles(styles)(MessageCreator);
