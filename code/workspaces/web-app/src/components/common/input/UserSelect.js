import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { makeStyles } from '@material-ui/core/styles';
import { useUsersSortedByName } from '../../../hooks/usersHooks';
import StyledTextField from './StyledTextField';

const useStyles = makeStyles(theme => ({
  userSelectedIcon: {
    marginLeft: theme.spacing(2),
  },
}));

const UserSelect = ({ selectedUsers, setSelectedUsers, label, placeholder, multiselect = false, userSelectedToolTip = 'User Selected', ...otherProps }) => {
  const { value: users, fetching: loading } = useUsersSortedByName();

  return (
    <Autocomplete
      {...otherProps}
      multiple={multiselect}
      options={users}
      getOptionLabel={getOptionLabel}
      getOptionSelected={val => (multiselect ? selectedUsers.includes(val) : selectedUsers === val)}
      value={selectedUsers}
      onChange={(event, newValue) => setSelectedUsers(newValue)}
      loading={loading}
      autoHighlight
      renderInput={params => <Input params={params} label={label} placeholder={placeholder} loading={loading} />}
      renderOption={(option, { selected }) => <Option option={option} selected={selected} userSelectedToolTip={userSelectedToolTip} />}
    />
  );
};

UserSelect.propTypes = {
  selectedUsers: validateSelectedUsers,
  setSelectedUsers: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  multiselect: PropTypes.bool,
  userSelectedToolTip: PropTypes.string,
};

export const Input = ({ params, label, placeholder, loading }) => (
  <StyledTextField
    {...params}
    label={label}
    placeholder={placeholder}
    InputProps={{
      ...params.InputProps,
      endAdornment: (
        <>
          {loading && <CircularProgress size={30}/>}
          {params.InputProps.endAdornment}
        </>
      ),
    }}
    fullWidth
  />
);

export const Option = ({ option, selected, userSelectedToolTip }) => {
  const classes = useStyles();
  return (
    <>
      {getOptionLabel(option)}
      {selected
      && <Tooltip title={userSelectedToolTip} placement="right">
        <CheckCircleRoundedIcon
          className={classes.userSelectedIcon}
          titleAccess={userSelectedToolTip}
          color="primary"
          fontSize="small"
        />
      </Tooltip>
      }
    </>
  );
};

const getOptionLabel = user => user.name || '';

function validateSelectedUsers(props, propName, componentName) {
  const multiselectName = 'multiselect';
  const multiselect = props[multiselectName];
  const value = props[propName];

  if (multiselect) {
    if (!Array.isArray(value)) {
      return new Error(
        `Invalid prop '${propName}' supplied to '${componentName}'. When '${multiselectName}' prop is truthy, `
        + `'${propName}' should either be an empty array when no user selected or an array of objects with keys 'name' and 'userId', not ${value}.`,
      );
    }
  } else {
    const isNull = value === null;
    const hasCorrectKeys = value && value.name && value.userId;
    if (!isNull && !hasCorrectKeys) {
      return new Error(
        `Invalid prop '${propName}' supplied to '${componentName}'. When '${multiselectName}' prop is falsey, `
        + `'${propName}' should either be null when no user selected or object with keys 'name' and 'userId', not ${value}.`,
      );
    }
  }

  return null;
}

export default UserSelect;
