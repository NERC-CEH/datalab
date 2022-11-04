import React, { useState } from 'react';
import { Grid, TextField } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { DateTimePicker } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import moment from 'moment';
import Message from '../../components/app/Message';
import PagePrimaryActionButton from '../../components/common/buttons/PagePrimaryActionButton';

const styles = theme => ({
  creator: {
    padding: `${theme.spacing(4)} 0`,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export const getSevenDaysFromNow = () => moment().startOf('day').add(7, 'days').toDate();
export const tomorrow = () => moment().startOf('day').add(1, 'days').toDate();

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
            minDate={tomorrow()}
            label={'Expiry'}
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={props => (
              <TextField {...props}/>
            )}
            ampm={false}
          />
        </Grid>
        <Grid item xs={2}>
          <div className={classes.buttonContainer}>
            <Button
              onClick={() => showPreview(!preview)}
              color={'primary'}
              variant={preview ? 'contained' : 'outlined'}
              >
              Preview
            </Button>
            <PagePrimaryActionButton
              onClick={() => createMessage(messageText, selectedDate, clearMessage)}
              disabled={!messageText}
              >
              Create
            </PagePrimaryActionButton>
            </div>
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
