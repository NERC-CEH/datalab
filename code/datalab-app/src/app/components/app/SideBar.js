import React from 'react';
import { Header, Menu, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const SideBar = ({ topBarStyle }) => (
  <div>
    <Segment basic inverted style={topBarStyle}>
      <Header as="h2" color="teal">DataLabs</Header>
    </Segment>
    <Menu vertical fluid inverted attached>
      <NavLink className="item" to="/" exact>Dashboard</NavLink>
      <Menu.Item>
        <Menu.Header>Data</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="Storage"
            onClick={() => window.open('https://datalab-minio.datalabs.nerc.ac.uk/minio/login', '_blank')}
          />
        </Menu.Menu>
      </Menu.Item>
      <Menu.Item>
        <Menu.Header>Analysis</Menu.Header>
        <Menu.Menu>
          <Menu.Item
            name="Zeppelin Notebook"
            onClick={() => window.open('https://datalab-zeppelin.datalabs.nerc.ac.uk/', '_blank')}
          />
        </Menu.Menu>
      </Menu.Item>
      <Menu.Item
        header
        name="Help"
        onClick={() => window.open('https://datalab-docs.datalabs.nerc.ac.uk/', '_blank')}
      />
    </Menu>
  </div>
);

export default SideBar;
