import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import UserMenu from './UserMenu';

const styles = theme => ({
  avatar: {
    width: theme.shape.topBarContentHeight,
    height: theme.shape.topBarContentHeight,
    cursor: 'pointer',
  },
});

class UserIcon extends Component {
  constructor(props, context) {
    super(props, context);
    this.closeOnClick = this.closeOnClick.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.state = {
      open: false,
      anchorEl: null,
    };
  }

  togglePopup = () => {
    this.setState({
      open: !this.state.open,
      anchorEl: this.state.open ? null : findDOMNode(this.userImage),
    });
  };

  closeOnClick = next => () => {
    this.setState({ open: false });
    next();
  };

  render() {
    return (
      <div>
        <Avatar
          className={this.props.classes.avatar}
          ref={(node) => { this.userImage = node; }}
          onClick={this.togglePopup}
          src={this.props.identity.picture}
        />
        <Popover
          open={this.state.open}
          onClose={this.togglePopup}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <UserMenu identity={this.props.identity} closePopover={this.closeOnClick} />
        </Popover>
      </div>
    );
  }
}

UserIcon.propTypes = {
  identity: PropTypes.shape({
    picture: PropTypes.string.isRequired,
  }),
};

export default withStyles(styles)(UserIcon);
