import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';
import { getAuth } from '../../config/auth';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.backgroundColor,
  },
  identity: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  userImage: {
    height: 96,
    width: 96,
  },
  userInfo: {
    marginLeft: 10,
  },
});

const UserMenu = ({ classes, identity, closePopover }) => (
  <div className={classes.container}>
    <div className={classes.identity}>
      <Avatar className={classes.userImage} src={identity.picture} />
      <div className={classes.userInfo}>
        <Typography variant="body1">{identity.nickname}</Typography>
        <Typography variant="body1">{identity.name}</Typography>
      </div>
    </div>
    <Button
      color="primary"
      onClick={closePopover(getAuth().logout)}
    >
      Logout
    </Button>
  </div>
);

UserMenu.propTypes = {
  identity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }),
  closePopover: PropTypes.func.isRequired,
};

export default withStyles(styles)(UserMenu);
