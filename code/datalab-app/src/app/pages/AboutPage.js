import React from 'react';
import { Divider, Header, Image, Segment } from 'semantic-ui-react';
import NavBar from '../components/welcome/NavBar';
import cegLogo from '../../assets/images/ceh_logo.svg';
import nercLogo from '../../assets/images/nerc-logo.svg';
import tessellaLogo from '../../assets/images/tessella_logo.svg';

const AboutPage = () => (
  <div>
    <Segment inverted vertical textAlign="center">
      <NavBar/>
    </Segment>
    <Segment basic >
      <Header as="h1">About DataLabs</Header>
      <p>A project to build a data analysis lab for scientists.</p>
      <Divider/>
      <p>Created by the Centre for Ecology and Hydrology</p>
      <Image src={cegLogo} size="medium"/>
      <Divider hidden/>
      <Image src={nercLogo} size="medium"/>
      <Divider/>
      <p>Developed by Tessella</p>
      <Image src={tessellaLogo} size="medium" />
    </Segment>
  </div>
);

export default AboutPage;
