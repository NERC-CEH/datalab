import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import DescribeElement from './DescribeElement';

const DescribeDatalabs = () => (
  <Segment vertical padded="very">
    <Grid textAlign="center">
      <Grid columns={3}>
        <DescribeElement
          title="Access to Datasets"
          iconName="cube"
          secondColor="blue"
          description="Datalabs provides you with access to a large number of datasets."
        />
        <DescribeElement
          title="Access to JASMIN Services"
          iconName="computer"
          secondColor="blue"
          description="Datalabs provides you with access to JASMIN services."
        />
        <DescribeElement
          title="Access to Notebooks"
          iconName="book"
          secondColor="blue"
          description="Datalabs provides you with access to Zeppelin notebooks."
        />
      </Grid>
    </Grid>
  </Segment>
);

export default DescribeDatalabs;
