import React from 'react';
import PropTypes from 'prop-types';
import { Header, Menu, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import SubMenu from './SubMenu';

const SideBar = ({ topBarStyle }) => (
  <div>
    <Segment basic inverted style={topBarStyle}>
      <Header as="h2" color="teal">DataLabs</Header>
    </Segment>
    <Menu vertical fluid inverted attached>
      <NavLink className="item" to="/" exact>Dashboard</NavLink>
      <SubMenu
        menuTitle="Data"
        menuItems={[
          { Component: Menu.Item,
            props: { onClick: () => window.open('https://datalab-minio.datalabs.nerc.ac.uk/minio/login', '_blank') },
            children: 'Storage' },
        ]}
      />
      <SubMenu
        menuTitle="Notebooks"
        menuItems={[
          { Component: Menu.Item,
            props: { onClick: () => window.open('https://datalab-zeppelin.datalabs.nerc.ac.uk/', '_blank') },
            children: 'Zeppelin Notebooks' },
        ]}
      />
      <Menu.Item
        header
        name="Help"
        onClick={() => window.open('https://datalab-docs.datalabs.nerc.ac.uk/', '_blank')}
      />
    </Menu>
  </div>
);

SideBar.propTypes = {
  topBarStyle: PropTypes.object,
};

export default SideBar;
