import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { makeStyles } from '@material-ui/core/styles';
import { fieldStyle, fieldStyleProps, multilineFieldStyleProps } from './controlStyles';
import theme from '../../../theme';
import PrimaryActionButton from '../buttons/PrimaryActionButton';
import SecondaryActionButton from '../buttons/SecondaryActionButton';

const useStyles = makeStyles(injectedTheme => ({
  fromControlContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    margin: `${theme.spacing(2)}px 0`,
  },
  button: {
    '& + &': {
      marginLeft: injectedTheme.spacing(),
    },
  },
}));

export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => <TextField
    style={fieldStyle}
    label={label}
    helperText={touched ? error : ''}
    error={error && touched}
    {...input}
    {...custom}
    {...fieldStyleProps}
  />;

export const renderAdornedTextField = ({ input, label, meta: { touched, error }, startText, endText, ...custom }) => {
  const InputProps = {
    startAdornment: <InputAdornment position="start">{startText}</InputAdornment>,
    endAdornment: <InputAdornment position="end">{endText}</InputAdornment>,
  };

  return (
    <TextField
      label={label}
      style={fieldStyle}
      InputProps={InputProps}
      onChange={(param, data) => input.onChange(data.value)}
      helperText={touched ? error : ''}
      error={error && touched}
      {...input}
      {...custom}
      {...fieldStyleProps}
    />
  );
};

export const renderTextArea = ({ input, label, meta: { touched, error }, ...custom }) => <TextField
    style={fieldStyle}
    label={label}
    helperText={touched ? error : ''}
    error={error && touched}
    multiline
    {...input}
    {...custom}
    {...multilineFieldStyleProps}
  />;

export const renderSelectField = ({ input, label, meta: { touched, error }, options, ...custom }) => (
  <TextField
    select // Select component doesn't respect styling so use TextField with select true
    style={fieldStyle}
    label={label}
    onChange={(param, data) => input.onChange(data.value)}
    helperText={touched ? error : ''}
    error={error && touched}
    {...input}
    {...custom}
    {...fieldStyleProps}
  >
    {
      options.map(({ text, value, additionalText }, idx) => (
        <MenuItem key={idx} value={value}>
          {text}
          {additionalText
            && <span
              style={{ marginLeft: theme.spacing(2), color: theme.typography.colorLight }}
            >
              {additionalText}
            </span>
          }
        </MenuItem>
      ))
    }
  </TextField>
);

// Use this in Field.format and Field.parse for multiSelects, to turn '' into []
// in initialisation and onBlur
export const formatAndParseMultiSelect = val => val || [];

export const renderMultiSelectAutocompleteField = ({
  input, currentValue, setCurrentValue, meta: { touched, error }, options, label, placeholder, getOptionLabel, getOptionSelected, loading, selectedTip, InputLabelProps, ...custom
}) => (
  <Autocomplete
    style={fieldStyle}
    multiple
    options={options}
    getOptionLabel={getOptionLabel}
    getOptionSelected={getOptionSelected}
    autoHighlight
    loading={loading}
    {...input} // onChange and onBlur overridden below
    onChange={(event, newValue) => { setCurrentValue(newValue); input.onChange(newValue); }}
    onBlur={(event, newValue) => { typeof input.onBlur === 'function' && input.onBlur(currentValue); }}
    {...custom}
    renderInput={params => (
      <TextField
        {...params}
        InputLabelProps={InputLabelProps}
        helperText={touched ? error : ''}
        error={error && touched}
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
        {...fieldStyleProps}
      />)}
    renderOption={
      (option, { selected }) => <>
        { getOptionLabel(option) }
        { selected && <Tooltip title={selectedTip} placement="right">
          <CheckCircleRoundedIcon
            titleAccess={selectedTip}
            color="primary"
            fontSize="small"
            style={{ marginLeft: theme.spacing(2) }}
          />
        </Tooltip> }
        </>
    }
  />
);

export const CreateFormControls = ({ onCancel, submitting, fullWidthButtons }) => {
  const classes = useStyles();

  return (
    <div className={classes.fromControlContainer}>
      <PrimaryActionButton
        type="submit"
        disabled={submitting}
        fullWidth={fullWidthButtons}
      >
        Create
      </PrimaryActionButton>
      <SecondaryActionButton
        style={{ marginLeft: theme.spacing(1) }}
        onClick={onCancel}
        fullWidth={fullWidthButtons}
      >
        Cancel
      </SecondaryActionButton>
    </div>
  );
};

export const UpdateFormControls = ({
  submitting, fullWidthButtons,
  onCancel, cancelButtonText = 'Cancel',
  onClearChanges, clearChangesButtonText = 'Clear Changes',
  pristine,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.fromControlContainer}>
      <Tooltip title={pristine ? 'No changes to apply' : ''}>
        <span className={classes.button}>
          <PrimaryActionButton
            type="submit"
            disabled={submitting || pristine}
            fullWidth={fullWidthButtons}
          >
            Apply
          </PrimaryActionButton>
        </span>
      </Tooltip>
      {
        onClearChanges && (
          <Tooltip title={pristine ? 'No changes to clear' : ''}>
            <span className={classes.button}>
              <SecondaryActionButton
                onClick={onClearChanges}
                disabled={pristine}
              >
                {clearChangesButtonText}
              </SecondaryActionButton>
            </span>
          </Tooltip>
        )
      }
      {
        onCancel && (
          <SecondaryActionButton
            onClick={onCancel}
            fullWidth={fullWidthButtons}
            className={classes.button}
          >
            {cancelButtonText}
          </SecondaryActionButton>
        )
      }
    </div>
  );
};
