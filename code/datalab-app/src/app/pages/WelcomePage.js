import React from 'react';
import { Segment } from 'semantic-ui-react';
import NavBar from '../components/welcome/NavBar';
import HeroBar from '../components/welcome/HeroBar';
import DecribeDatalabs from '../components/welcome/DescribeDatalabs';

const WelcomePage = () => (
  <div>
    <Segment inverted vertical textAlign="center">
      <NavBar/>
      <HeroBar/>
    </Segment>
    <DecribeDatalabs/>
  </div>
);

export default WelcomePage;
