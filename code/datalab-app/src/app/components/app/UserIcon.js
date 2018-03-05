import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import auth from '../../auth/auth';

class UserIcon extends React.Component {
  state = {
    open: false,
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  togglePopup = () => {
    this.setState({ open: !this.state.open });
  };

  closePopup = () => {
    if (!this.state.open) {
      return;
    }

    // setTimeout to ensure a close event comes after a target click event
    this.timeout = setTimeout(() => {
      this.setState({ open: false });
    });
  };

  closeOnClick = next => () => {
    this.closePopup();
    next();
  };

  render() {
    return (
      <Manager>
        <Target>
          <Avatar
            aria-owns={this.state.open ? 'menu-list' : null}
            aria-haspopup="true"
            onClick={this.togglePopup}
            src={this.props.identity.picture}
          />
        </Target>
        <Popper
          placement="bottom-start"
          eventsEnabled={this.state.open}
        >
          <ClickAwayListener onClickAway={this.closePopup}>
            <Grow in={this.state.open} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
              <Paper>
                <Button color="primary" raised onClick={this.closeOnClick(auth.logout)}>
                  Logout
                </Button>
              </Paper>
            </Grow>
          </ClickAwayListener>
        </Popper>
      </Manager>
    );
  }
}

UserIcon.propTypes = {
  identity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    sub: PropTypes.string.isRequired,
  }),
};

export default UserIcon;
