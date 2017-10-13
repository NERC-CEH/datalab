import { createMuiTheme } from 'material-ui';
import { blueGrey, teal } from 'material-ui/colors';

const primary = teal;
const secondary = blueGrey;
const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    primary,
    secondary,
  },
  overrides: {
    MuiAppBar: {
      root: {
        padding: 0,
      },
      colorPrimary: {
        backgroundColor: defaultTheme.palette.grey[100],
      },
    },
  },
});

export const publicAppTheme = outerTheme => ({
  ...theme,
  overrides: {
    ...theme.overrides,
    MuiAppBar: {
      ...theme.overrides.MuiAppBar,
      colorPrimary: {
        ...theme.overrides.MuiAppBar.colorPrimary,
        backgroundColor: secondary[900],
      },
    },
  },
});

export default theme;
