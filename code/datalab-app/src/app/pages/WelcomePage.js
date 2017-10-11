import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import { blueGrey, teal } from 'material-ui/colors';
import NavBar from '../components/welcome/NavBar';
import HeroBar from '../components/welcome/HeroBar';
import DecribeDatalabs from '../components/welcome/DescribeDatalabs';
import Footer from '../components/welcome/Footer';

const generateTheme = (primary, secondary) => createMuiTheme({
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

const theme = generateTheme(teal, blueGrey);

const WelcomePage = () => (
  <MuiThemeProvider theme={theme}>
    <div>
      <NavBar/>
      <HeroBar/>
      <DecribeDatalabs/>
      <Footer invert/>
    </div>
  </MuiThemeProvider>

);

export default WelcomePage;
