import React from 'react';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import { getVersion } from '../../config/version';
import logo from '../../assets/images/datalabs-mono.png';
import theme from '../../theme';

const copyrightString = '© Copyright NERC 2017—2019';

const footerStyle = {
  padding: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
};

const styles = injectedTheme => ({
  footer: footerStyle,
  invertFooter: {
    ...footerStyle,
    backgroundColor: injectedTheme.palette.backgroundDarkHighTransparent,
  },
  logoCopyRightContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    width: 140,
    marginBottom: injectedTheme.spacing(2),
  },
});

const Footer = ({ classes, invert }) => (
  <div className={invert ? classes.invertFooter : classes.footer} >
    <div className={classes.logoCopyRightContainer}>
      <img className={classes.logo} src={logo} alt="DataLabs-Logo" />
      <Typography variant="caption">{copyrightString}</Typography>
    </div>
    <Typography variant="body2">{`Version: ${getVersion()}`}</Typography>
  </div>
);

export default withStyles(styles)(Footer);
