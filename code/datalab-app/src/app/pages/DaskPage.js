import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Segment from '../components/app/Segment';
import { extendSubdomain } from '../core/getDomainInfo';

const DaskPage = () => (
  <Segment>
    <Typography gutterBottom variant="h4">Dask</Typography>
    <p>Dask is a flexible parallel computing library for analytic computing.</p>
    <Button
      color="primary"
      onClick={() => window.open(extendSubdomain('dask'))}
    >
      Dask Status
    </Button>
  </Segment>
);

export default DaskPage;
