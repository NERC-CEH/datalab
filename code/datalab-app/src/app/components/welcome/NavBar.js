import React from 'react';
import { Container, Button, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import auth from '../../auth/auth';

const publicNavLinks = [
  { label: 'DataLabs', path: '/', exact: true },
  { label: 'About', path: '/about', exact: true },
];

const PublicNavBarContent = () => (
  <Container>
    <Menu inverted pointing secondary>
      {publicNavLinks.map(props => (<NavLink className="item" exact={props.exact} key={props.label} to={props.path}>{props.label}</NavLink>))}
      <Menu.Menu position="right">
      <Button primary onClick={auth.login} >Login</Button>
      </Menu.Menu>
    </Menu>
  </Container>
);

export default PublicNavBarContent;
