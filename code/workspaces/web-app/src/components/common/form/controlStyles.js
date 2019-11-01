import theme from '../../../theme';

export const fieldStyle = {
  minWidth: 250,
  marginBottom: theme.spacing(2),
};

export const fieldStyleProps = {
  margin: 'dense',
  variant: 'outlined',
  fullWidth: true,
};

export const multilineFieldStyleProps = {
  ...fieldStyleProps,
  InputProps: {
    rows: 3,
    rowsMax: 10,
  },
};
