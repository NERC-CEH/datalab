import React from 'react';
import { matchPath } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const NavLink = ({ name, to, exact, routePathname, routeTo }) => {
  const onClick = () => routeTo(to);
  const isActive = matchPath(routePathname, { path: to, exact });

  return (
  <Menu.Item name={name} active={isActive !== null} onClick={onClick} />
  );
};

export default NavLink;
