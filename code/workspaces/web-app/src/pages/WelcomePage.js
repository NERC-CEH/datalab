import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import NavBar from '../components/welcome/NavBar';
import HeroBar from '../components/welcome/HeroBar';
import DecribeDatalabs from '../components/welcome/DescribeDatalabs';
import Footer from '../components/welcome/Footer';

const styles = theme => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.backgroundColor,
  },
});

const WelcomePage = ({ classes }) => (
  <div className={classes.page}>
    <HeroBar/>
    <NavBar/>
    <DecribeDatalabs/>
    <Footer invert/>
  </div>
);

export default withStyles(styles)(WelcomePage);
