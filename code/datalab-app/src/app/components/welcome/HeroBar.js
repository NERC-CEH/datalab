import React from 'react';
import { Button, Container, Header, Icon } from 'semantic-ui-react';
import auth from '../../auth/auth';

const segmentStyle = {
  minHeight: '350px',
};

const headerStyle = {
  paddingTop: '120px',
};

const HeroBar = () => (
  <Container text style={segmentStyle}>
    <Header inverted as="h1" style={headerStyle}>
      Welcome to DataLabs
    </Header>
    <Button primary animated onClick={auth.login}>
      <Button.Content visible>
        Get Started!
      </Button.Content>
      <Button.Content hidden>
        <Icon name="arrow right"/>
        Login
      </Button.Content>
    </Button>
  </Container>
);

export default HeroBar;
