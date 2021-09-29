import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import copy from 'copy-to-clipboard';
import Page from './Page';
import ClustersContainer from '../containers/clusters/ClustersContainer';
import ExternalLink from '../components/common/ExternalLink';
import { DASK_CLUSTER_TYPE } from '../containers/clusters/clusterTypeName';
import notify from '../components/common/notify';

const useStyles = makeStyles(theme => ({
  clusterList: {
    marginTop: theme.spacing(5),
  },
}));

const copyPythonSnippet = ({ schedulerAddress }) => {
  const proxyAddress = schedulerAddress.replace('tcp://', 'proxy/').replace('8786', '8787');
  const message = `# Paste this into your notebook cell
# Note that the Dask scheduler can be accessed from the Dask JupyterLab extension with address
# ${proxyAddress}
from dask.distributed import Client
c = Client("${schedulerAddress}")
c
`;
  try {
    copy(message);
    notify.success('Clipboard contains snippet for notebook cell');
  } catch (error) {
    notify.error('Unable to access clipboard.');
  }
};

const DaskPage = () => {
  const classes = useStyles();

  const copySnippets = {
    Python: copyPythonSnippet,
  };

  return (
    <Page className={''} title="Dask">
      <Typography variant="body1">
        <ExternalLink href="https://dask.org/">Dask</ExternalLink> is a flexible parallel computing library for analytic computing in Python.
        DataLabs allows users to create Dask clusters for use within projects.
        These clusters can be utilised from notebooks using the <ExternalLink href="https://kubernetes.dask.org/en/latest/">Dask Kubernetes</ExternalLink> package when configured to use the specified scheduler address for the cluster.
        Dask can only be used with Python.
      </Typography>
      <div className={classes.clusterList}>
        <ClustersContainer clusterType={DASK_CLUSTER_TYPE} copySnippets={copySnippets} />
      </div>
    </Page>
  );
};

export default DaskPage;
