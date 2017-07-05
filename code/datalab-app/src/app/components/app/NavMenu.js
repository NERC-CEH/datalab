import React from 'react';
import { Button, Container, Menu, Segment } from 'semantic-ui-react';
import NavLink from './NavLink';

const NavMenu = ({ routePathname, routeTo, inverted, isUserLoggedIn, userLoginLogout, ...rest }) => (
  <Segment inverted={inverted}>
    <Container>
      <Menu inverted={inverted} {...rest} >
        <NavLink exact name="Home Page" to="/" routePathname={routePathname} routeTo={routeTo}/>
        <NavLink name="Redux Example Page" to="/example" routePathname={routePathname} routeTo={routeTo}/>
        <NavLink name="API Example Page" to="/apiExample" routePathname={routePathname} routeTo={routeTo}/>
        <NavLink name="Private Content Example Page" to="/private" routePathname={routePathname} routeTo={routeTo}/>
        <Menu.Menu position="right">
          <Button primary={!isUserLoggedIn()} onClick={userLoginLogout} >
            {isUserLoggedIn() ? 'Logout' : 'Login'}
            </Button>
        </Menu.Menu>
      </Menu>
    </Container>
  </Segment>
);

export default NavMenu;
