import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import theme from '../../theme';

const useStyles = makeStyles(() => ({
  pageNumberInput: {
    maxWidth: '3em',
    margin: 0,
  },
}));

const PaginationControlTextField = (
  { pageInputValue, setPageInputValue, changePageToUserInput },
) => {
  const classes = useStyles();

  return (
    <TextField
      className={classes.pageNumberInput}
      inputProps={{
        style: {
          textAlign: 'center',
          padding: theme.spacing(1),
        },
      }}
      variant="outlined" margin="dense" size="small"
      value={pageInputValue}
      onChange={event => setPageInputValue(event.target.value)}
      onBlur={() => changePageToUserInput()}
      onKeyPress={event => event.key === 'Enter' && changePageToUserInput()}
    />
  );
};

PaginationControlTextField.propTypes = {
  pageInputValue: PropTypes.oneOfType(
    [PropTypes.number, PropTypes.string],
  ).isRequired,
  setPageInputValue: PropTypes.func.isRequired,
  changePageToUserInput: PropTypes.func.isRequired,
};

export default PaginationControlTextField;
