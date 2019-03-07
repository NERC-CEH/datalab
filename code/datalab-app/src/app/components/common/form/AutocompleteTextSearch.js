import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Downshift from 'downshift';
import { find } from 'lodash';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    height: 250,
  },
  paper: {
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    maxHeight: '75%',
    overflow: 'auto',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

class DownshiftMultiple extends Component {
  state = { inputValue: '' };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  handleChange = (label) => {
    this.props.addItem(find(this.props.suggestions, { label }));
    this.setState({ inputValue: '' });
  };

  handleDelete = item => () => {
    this.props.removeItem(item);
  };

  render() {
    const { classes, suggestions, selectedItems } = this.props;
    const { inputValue } = this.state;

    return (
      <Downshift inputValue={inputValue} onChange={this.handleChange} selectedItem={selectedItems}>
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: searchValue,
          selectedItem: currentlySelectedItems,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                startAdornment: selectedItems.map(item => (
                    <Chip
                      key={item.value}
                      tabIndex={-1}
                      label={item.label}
                      className={classes.chip}
                      onDelete={this.props.removeItem && this.handleDelete(item)}
                    />
                  )),
                onChange: this.handleInputChange,
                placeholder: this.props.placeholder,
              }),
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(searchValue, suggestions).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItems: currentlySelectedItems,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

DownshiftMultiple.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  addItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
};

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItems }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItems.map(({ value }) => value).includes(suggestion.value);

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.value}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

function getSuggestions(searchValue, suggestions) {
  let count = 0;

  return suggestions.filter((suggestion) => {
    const keep =
      (!searchValue || suggestion.label.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) &&
      count < 5;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}

export default withStyles(styles)(DownshiftMultiple);
