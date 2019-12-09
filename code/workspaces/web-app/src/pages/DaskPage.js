import React from 'react';
import Typography from '@material-ui/core/Typography';
import Page from './Page';
import theme from '../theme';
import PrimaryActionButton from '../components/common/buttons/PrimaryActionButton';

const DaskPage = () => (
  <Page title="Dask">
    <Typography variant="body1">
      Dask is a flexible parallel computing library for analytic computing.<br/>
      DataLabs supports usage of Dask-Kubernetes which allows workers to be
      scheduled across the cluster. This is tightly integrated with Jupyter.
    </Typography>
    <PrimaryActionButton
      style={{ marginTop: theme.spacing(2) }}
      onClick={() => window.open('https://kubernetes.dask.org/en/latest/')}
    >
      Dask on Kubernetes Documentation
    </PrimaryActionButton>
  </Page>
);

export default DaskPage;
