import React from 'react';
import { Grid, Header, Icon, Reveal } from 'semantic-ui-react';

const DescribeElement = ({ iconName, title, description, secondColor }) => (
  <Grid.Column>
    <Reveal animated="small fade">
      <Reveal.Content visible>
        <Icon name={iconName} size="massive" />
      </Reveal.Content>
      <Reveal.Content hidden>
        <Icon name={iconName} size="massive" color={secondColor} />
      </Reveal.Content>
    </Reveal>
    <Header content={title} as="h3" />
    {description}
  </Grid.Column>
);

export default DescribeElement;
