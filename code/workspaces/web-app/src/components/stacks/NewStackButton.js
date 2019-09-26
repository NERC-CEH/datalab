import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PagePrimaryAction from '../common/buttons/PagePrimaryActionButton';

const styles = theme => ({
  button: {
    marginTop: 10,
  },
});

const NewStackButton = ({ classes, onClick, typeName }) => (
  <PagePrimaryAction className={classes.button} aria-label="add" onClick={onClick}>
    {`Create ${typeName}`}
  </PagePrimaryAction>
);

NewStackButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  typeName: PropTypes.string.isRequired,
};

export default withStyles(styles)(NewStackButton);
