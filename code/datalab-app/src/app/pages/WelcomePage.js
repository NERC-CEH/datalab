import React from 'react';
import NavBar from '../components/welcome/NavBar';
import HeroBar from '../components/welcome/HeroBar';
import DecribeDatalabs from '../components/welcome/DescribeDatalabs';
import Footer from '../components/welcome/Footer';

const WelcomePage = () => (
  <div>
    <NavBar/>
    <HeroBar/>
    <DecribeDatalabs/>
    <Footer invert/>
  </div>
);

export default WelcomePage;
