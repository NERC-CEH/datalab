import React from 'react';
import Typography from '@material-ui/core/Typography';
import Page from './Page';
import theme from '../theme';
import PrimaryActionButton from '../components/common/buttons/PrimaryActionButton';

const SparkPage = () => (
  <Page title="Spark">
    <Typography variant="body1">
      Apache Spark is an open-source cluster-computing framework.<br/>
      DataLabs supports usage of Spark via Kubernetes which allows Spark executors
      to be deployed across the cluster.
    </Typography>
    <PrimaryActionButton
      style={{ marginTop: theme.spacing(2) }}
      onClick={() => window.open('https://spark.apache.org/docs/latest/running-on-kubernetes.html')}
    >
      Spark in DataLabs Documentation
    </PrimaryActionButton>
  </Page>
);

export default SparkPage;
