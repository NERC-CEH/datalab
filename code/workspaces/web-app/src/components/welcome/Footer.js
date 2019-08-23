import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { version } from '../../version';
import logo from '../../assets/images/datalabs-mono.png';

const copyrightString = '© Copyright NERC 2017 - 2019';

const footerStyle = {
  padding: '40px 16px 40px 16px',
};

const styles = theme => ({
  footer: footerStyle,
  invertFooter: {
    ...footerStyle,
    backgroundColor: theme.palette.secondary[50],
  },
  logo: {
    width: 140,
  },
});

const Footer = ({ classes, invert }) => (
  <div className={invert ? classes.invertFooter : classes.footer} >
    <img className={classes.logo} src={logo} alt="DataLabs-Logo" />
    <Typography variant="caption" gutterBottom>{copyrightString}</Typography>
    <Typography variant="body2">{`Version: ${version}`}</Typography>
  </div>
);

export default withStyles(styles)(Footer);
