import { createMuiTheme } from 'material-ui';
import { blueGrey, teal, grey, red } from 'material-ui/colors';

const defaultTheme = createMuiTheme();
const primary = teal;
const secondary = blueGrey;
const backgroundColor = grey[100];
const danger = red[800];

const theme = createMuiTheme({
  palette: {
    primary,
    secondary,
    backgroundColor,
    danger,
  },
  overrides: {
    MuiAppBar: {
      root: {
        padding: 0,
      },
      colorPrimary: {
        backgroundColor,
      },
    },
    MuiTableCell: {
      root: {
        fontSize: defaultTheme.typography.body1.fontSize,
      },
      head: {
        fontSize: defaultTheme.typography.subheading.fontSize,
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
