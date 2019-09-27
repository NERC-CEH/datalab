import React from 'react';
import Typography from '@material-ui/core/Typography';
import { extendSubdomain } from '../core/getDomainInfo';
import Page from './Page';
import theme from '../theme';
import PrimaryActionButton from '../components/common/buttons/PrimaryActionButton';

const DaskPage = () => (
  <Page title="Dask">
    <Typography variant="body1">Dask is a flexible parallel computing library for analytic computing.</Typography>
    <PrimaryActionButton
      style={{ marginTop: theme.spacing(2) }}
      onClick={() => window.open(extendSubdomain('dask'))}
    >
      Dask Status
    </PrimaryActionButton>
  </Page>
);

export default DaskPage;
