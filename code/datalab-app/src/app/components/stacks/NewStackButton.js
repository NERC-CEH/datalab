import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
  },
  button: {
    margin: 20,
  },
  icon: {
    fontSize: 40,
  },
});

const NewStackButton = ({ classes, onClick, typeName }) =>
  <Card className={classes.card} elevation={0}>
    <div className={classes.buttonContainer}>
      <Tooltip title={`Create ${typeName}`}>
        <Button className={classes.button} fab color="primary" aria-label="add" onClick={onClick}>
          <Icon className={classes.icon} children="add" />
        </Button>
      </Tooltip>
    </div>
  </Card>;

NewStackButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  typeName: PropTypes.string.isRequired,
};

export default withStyles(styles)(NewStackButton);
