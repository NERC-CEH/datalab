import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.toggleDraw = this.toggleDraw.bind(this);
  }

  toggleDraw() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div>
        <AppBar title="Data Labs" onLeftIconButtonTouchTap={this.toggleDraw} />
        <Drawer open={this.state.open} docked={false} onRequestChange={this.toggleDraw}>
          <MenuItem>Home</MenuItem>
          <MenuItem>About</MenuItem>
        </Drawer>
      </div>
      );
  }
}

export default Navigation;
