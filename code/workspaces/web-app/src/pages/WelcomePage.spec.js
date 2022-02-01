import React from 'react';
import { render } from '../testUtils/renderTests';
import WelcomePage from './WelcomePage';

jest.mock('../components/welcome/NavBar', () => () => (<div>NavBar mock</div>));
jest.mock('../components/welcome/HeroBar', () => () => (<div>HeroBar mock</div>));
jest.mock('../components/welcome/DescribeDatalabs', () => () => (<div>DescribeDatalabs mock</div>));
jest.mock('../components/welcome/Footer', () => props => (<div>Footer mock {JSON.stringify(props)}</div>));

describe('WelcomePage', () => {
  it('renders correct snapshot', () => {
    expect(render(<WelcomePage />).container).toMatchSnapshot();
  });
});
