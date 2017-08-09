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
          { Component: NavLink,
            props: { className: 'item', to: '/storage', exact: true },
            children: 'Storage' },
        ]}
      />
      <SubMenu
        menuTitle="Analysis"
        menuItems={[
          { Component: NavLink,
            props: { className: 'item', to: '/notebooks', exact: true },
            children: 'Notebooks' },
          { Component: Menu.Item,
            props: { name: 'Dask', onClick: () => window.open('https://datalab-dask.datalabs.nerc.ac.uk/') } },
          { Component: Menu.Item,
            props: { name: 'Spark', onClick: () => window.open('https://datalab-spark.datalabs.nerc.ac.uk/') } },
        ]}
      />
      <Menu.Item
        header
        name="Help"
        onClick={() => window.open('https://datalab-docs.datalabs.nerc.ac.uk/')}
      />
    </Menu>
  </div>
);

SideBar.propTypes = {
  topBarStyle: PropTypes.object,
};

export default SideBar;
