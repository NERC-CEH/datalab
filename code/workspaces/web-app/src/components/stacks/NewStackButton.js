import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 10,
  },
  icon: {
    fontSize: 40,
  },
});

const NewStackButton = ({ classes, onClick, typeName }) => (
  <Button className={classes.button} variant="contained" color="primary" aria-label="add" onClick={onClick}>
    {`Create ${typeName}`}
  </Button>
);

NewStackButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  typeName: PropTypes.string.isRequired,
};

export default withStyles(styles)(NewStackButton);
