import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { blueGrey, red } from '@mui/material/colors';

const primary = { main: 'rgba(36, 166, 154, 1.0)' };
const primaryTransparent = 'rgba(36, 166, 154, 0.4)';
const secondary = blueGrey;
const dangerColor = red[800];
const dangerBackgroundColor = red[100];
const dangerBackgroundColorLight = red[50];

// Colours
const backgroundColor = '#F8F8F8';
const backgroundDark = 'rgba(47, 62, 70, 1.0)';
const backgroundDarkTransparent = 'rgba(47, 62, 70, 0.7)';
const backgroundDarkHighTransparent = 'rgba(47, 62, 70, 0.2)';
const sideBarBackground = 'hsl(0, 0%, 95%)';

const highlightMono = 'rgba(248, 248, 248, 1.0)';
const highlightMonoTransparent = 'rgba(248, 248, 248, 0.25)';

const text = backgroundDark;
const textLight = 'hsl(0, 0%, 40%)';

const message = 'rgba(64, 64, 191, 1.0)';
const messageBackground = 'rgba(189, 221, 255, 0.5)';

const warningBackground = '#FDF0E6';

// Lengths
const spacing = 5;
const navBarHeight = 8 * spacing;
const cardImageSize = 13 * spacing;

const theme = createTheme({
  palette: {
    primary,
    primaryTransparent,
    secondary,
    dangerColor,
    dangerBackgroundColor,
    dangerBackgroundColorLight,
    backgroundColor,
    backgroundDark,
    backgroundDarkTransparent,
    backgroundDarkHighTransparent,
    sideBarBackground,
    highlightMono,
    highlightMonoTransparent,
    message,
    messageBackground,
    warningBackground,
  },
  typography: {
    color: text,
    colorLight: textLight,
    h4: {
      color: text,
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
    body1: {
      color: text,
    },
    body2: {
      color: textLight,
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
  cardImageSize,
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: '400',
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export const publicAppTheme = outerTheme => ({
  ...theme,
});

export default theme;
