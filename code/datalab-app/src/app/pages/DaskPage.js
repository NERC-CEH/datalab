import React from 'react';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Segment from '../components/app/Segment';

const DaskPage = () => (
  <Segment>
    <Typography gutterBottom type="display1">Dask</Typography>
    <p>Dask is a flexible parallel computing library for analytic computing.</p>
    <Button raised color="primary" onClick={() => window.open('https://datalab-dask.datalabs.nerc.ac.uk/')}>
      Dask Status
    </Button>
  </Segment>
);

export default DaskPage;
