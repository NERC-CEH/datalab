import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { withStyles } from 'material-ui/styles';
import DatalabModal from './DatalabModal';

function styles(theme) {
  const buttonBaseStyle = {
    margin: theme.spacing.unit,
  };

  return {
    button: {
      ...buttonBaseStyle,
    },
    buttonDanger: {
      ...buttonBaseStyle,
      color: theme.palette.danger,
    },
    icon: {
      marginLeft: theme.spacing.unit,
    },
  };
}

const Confirmation = ({ classes, title, body, onSubmit, onCancel }) => (
  <DatalabModal title={title} body={body}>
    <Button className={classes.button} color="accent" raised onClick={onCancel}>
      No
      <Icon className={classes.icon} children="clear"/>
    </Button>
    <Button className={classes.buttonDanger} raised onClick={onSubmit}>
      Yes
      <Icon className={classes.icon} children="delete"/>
    </Button>
  </DatalabModal>
);

Confirmation.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default withStyles(styles)(Confirmation);
