import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '../common/control/IconButton';

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
    const {
      title, body, onSubmit, onCancel, confirmField,
    } = this.props;

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
              margin="normal"
              fullWidth />
          </form>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={onCancel} icon="clear">
            Cancel
          </IconButton>
          <IconButton danger onClick={onSubmit} icon="delete" disabled={!this.state.name.valid}>
            Confirm Deletion
          </IconButton>
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
