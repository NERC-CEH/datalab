import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { extendSubdomain } from '../core/getDomainInfo';
import Page from './Page';

const DaskPage = () => (
  <Page title="Dask">
    <Typography variant="body1">Dask is a flexible parallel computing library for analytic computing.</Typography>
    <Button
      color="primary"
      onClick={() => window.open(extendSubdomain('dask'))}
    >
      Dask Status
    </Button>
  </Page>
);

export default DaskPage;
