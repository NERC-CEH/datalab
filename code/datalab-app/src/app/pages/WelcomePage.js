import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import { blueGrey, teal } from 'material-ui/colors';
import NavBar from '../components/welcome/NavBar';
import HeroBar from '../components/welcome/HeroBar';
import DecribeDatalabs from '../components/welcome/DescribeDatalabs';

const theme = createMuiTheme({
  palette: {},
});

const WelcomePage = () => (
  <MuiThemeProvider theme={theme}>
    <div>
      <NavBar/>
      <HeroBar/>
      <DecribeDatalabs/>
    </div>
  </MuiThemeProvider>

);

export default WelcomePage;
