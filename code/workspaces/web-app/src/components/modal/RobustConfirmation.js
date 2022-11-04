import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DangerButton from '../common/buttons/DangerButton';
import SecondaryActionButton from '../common/buttons/SecondaryActionButton';

class RobustConfirmation extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = { name: { value: '', valid: false } };
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: {
        value: event.target.value,
        valid: event.target.value === this.props.confirmField.expectedValue,
      },
    });
  };

  render() {
    const { title, body, onSubmit, onCancel, confirmField } = this.props;

    return (
      <Dialog open={true} maxWidth="md">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{body}</DialogContentText>
          <form>
            <TextField
              id="name"
              label={confirmField.label}
              value={this.state.name.value}
              onChange={this.handleChange('name')}
              variant="outlined"
              margin="dense"
              fullWidth />
          </form>
        </DialogContent>
        <DialogActions>
          <DangerButton onClick={onSubmit} disabled={!this.state.name.valid}>
            Delete
          </DangerButton>
          <SecondaryActionButton onClick={onCancel}>
            Cancel
          </SecondaryActionButton>
        </DialogActions>
      </Dialog>
    );
  }
}

RobustConfirmation.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  confirmField: PropTypes.shape({
    label: PropTypes.string.isRequired,
    expectedValue: PropTypes.string.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RobustConfirmation;
