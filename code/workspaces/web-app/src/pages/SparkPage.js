import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import copy from 'copy-to-clipboard';
import Page from './Page';
import ClustersContainer from '../containers/clusters/ClustersContainer';
import ExternalLink from '../components/common/ExternalLink';
import { SPARK_CLUSTER_TYPE } from '../containers/clusters/clusterTypeName';
import notify from '../components/common/notify';

const useStyles = makeStyles(theme => ({
  clusterList: {
    marginTop: theme.spacing(5),
  },
}));

const copySnippet = () => {
  const message = 'Unimplemented';
  try {
    copy(message);
    notify.success('Clipboard contains snippet for notebook cell');
  } catch (error) {
    notify.error('Unable to access clipboard.');
  }
};

const SparkPage = () => {
  const classes = useStyles();

  return (
    <Page className={''} title="Spark">
      <Typography variant="body1">
      <ExternalLink href="https://spark.apache.org/">Apache Spark</ExternalLink> is an open-source cluster-computing framework.<br/>
        DataLabs supports usage of Spark via Kubernetes which allows Spark executors
        to be deployed across the cluster.
      </Typography>
      <div className={classes.clusterList}>
        <ClustersContainer clusterType={SPARK_CLUSTER_TYPE} copySnippet={copySnippet} />
      </div>
    </Page>
  );
};

export default SparkPage;
