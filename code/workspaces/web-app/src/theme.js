import { createMuiTheme } from '@material-ui/core/styles';
import { blueGrey, teal, red } from '@material-ui/core/colors';

const primary = teal;
const secondary = blueGrey;
const dangerColor = red[800];
const dangerBackgroundColor = red[100];

// Colours
const text = '#263238';

const backgroundColor = '#F8F8F8';
const backgroundDark = 'rgba(38, 50, 56, 1.0)';
const backgroundDarkTransparent = 'rgba(38, 50, 56, 0.6)';
const backgroundDarkHighTransparent = 'rgba(38, 50, 56, 0.2)';

const highlightMono = 'rgba(248, 248, 248, 1.0)';
const highlightMonoTransparent = 'rgba(248, 248, 248, 0.25)';

// Lengths
const spacing = 5;
const navBarHeight = 8 * spacing;

const theme = createMuiTheme({
  palette: {
    primary,
    secondary,
    dangerColor,
    dangerBackgroundColor,
    backgroundColor,
    backgroundDark,
    backgroundDarkTransparent,
    backgroundDarkHighTransparent,
    highlightMono,
    highlightMonoTransparent,
  },
  typography: {
    color: text,
    h4: {
      color: text,
    },
    h6: {
      color: text,
      textTransform: 'uppercase',
      fontSize: '1em',
      letterSpacing: '0.05em',
    },
  },
  shape: {
    topBarHeight: navBarHeight,
    topBarContentHeight: navBarHeight - 2 * spacing,
    topBarPaddingTopBottom: spacing,
    topBarPaddingLeftRight: 2 * spacing,
    borderRadius: 5,
  },
  spacing,
});

export const publicAppTheme = outerTheme => ({
  ...theme,
});

export default theme;
