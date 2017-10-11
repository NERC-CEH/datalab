import { createMuiTheme } from 'material-ui';
import { blueGrey, teal } from 'material-ui/colors';

const primary = teal;
const secondary = blueGrey;

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
        backgroundColor: secondary[900],
      },
    },
  },
});

export default theme;
