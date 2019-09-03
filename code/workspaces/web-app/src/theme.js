import { createMuiTheme } from '@material-ui/core/styles';
import { blueGrey, teal, red } from '@material-ui/core/colors';

const primary = teal;
const secondary = blueGrey;
const dangerColor = red[800];
const dangerBackgroundColor = red[100];

// Colours
const backgroundColor = '#F8F8F8';
const backgroundDark = 'rgba(47, 62, 70, 1.0)';
const backgroundDarkTransparent = 'rgba(47, 62, 70, 0.7)';
const backgroundDarkHighTransparent = 'rgba(47, 62, 70, 0.2)';
const sideBarBackground = 'hsl(0, 0%, 95%)';

const highlightMono = 'rgba(248, 248, 248, 1.0)';
const highlightMonoTransparent = 'rgba(248, 248, 248, 0.25)';

const text = backgroundDark;

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
    sideBarBackground,
    highlightMono,
    highlightMonoTransparent,
  },
  typography: {
    color: text,
    h4: {
      color: text,
      margin: `${spacing * 4}px 0`,
    },
    h5: {
      color: text,
      marginTop: spacing * 4,
      marginBottom: spacing * 2,
    },
    h6: {
      color: text,
      textTransform: 'uppercase',
      fontSize: '1em',
      letterSpacing: '0.05em',
    },
    body2: {
      color: 'hsl(0, 0%, 40%)',
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
