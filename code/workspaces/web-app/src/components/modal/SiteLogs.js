import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import PromisedContentWrapper from '../common/PromisedContentWrapper';

class Logs extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      logs: { fetching: true },
    };
  }

  async componentDidMount() {
    let logs = await this.props.getLogs(this.props.projectName, this.props.stackName);
    if (logs.value === '') {
      logs = { value: 'ERROR: Unable to retrieve logs.' };
    }
    this.setState({
      logs: { fetching: false, ...logs },
    });
  }

  render() {
    const { title, onCancel } = this.props;

    return (
      <Dialog open={true} onClose={onCancel} maxWidth="md">
        <DialogTitle>{title}</DialogTitle>
        <PromisedContentWrapper promise={this.state.logs}>
          <DialogContent>
            <DialogContentText style={{ whiteSpace: 'pre' }}>{this.state.logs.value}</DialogContentText>
          </DialogContent>
        </PromisedContentWrapper>
        <DialogActions>
          <PrimaryActionButton onClick={onCancel}>Close</PrimaryActionButton>
        </DialogActions>
      </Dialog>
    );
  }
}

Logs.propTypes = {
  title: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  getLogs: PropTypes.func.isRequired,
  stackName: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
};

export default Logs;
