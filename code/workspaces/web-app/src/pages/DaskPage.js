import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import Page from './Page';
import PagePrimaryActionButton from '../components/common/buttons/PagePrimaryActionButton';
import modalDialogActions from '../actions/modalDialogActions';
import { MODAL_TYPE_CREATE_CLUSTER } from '../constants/modaltypes';
import { getClusterMaxWorkers, getWorkerCpuMax, getWorkerMemoryMax } from '../config/clusters';
import { useCurrentUserId } from '../hooks/authHooks';
import { useCurrentProjectKey } from '../hooks/currentProjectHooks';
import { useDataStorageForUserInProject } from '../hooks/dataStorageHooks';
import dataStorageActions from '../actions/dataStorageActions';
import clusterActions from '../actions/clusterActions';

const useStyles = makeStyles(theme => ({
  createButton: {
    marginTop: theme.spacing(2),
  },
}));

const CLUSTER_TYPE = 'DASK';

const DaskPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentUserId = useCurrentUserId();
  const { value: currentProjectKey } = useCurrentProjectKey();
  const { value: dataStores } = useDataStorageForUserInProject(currentUserId, currentProjectKey);

  useEffect(() => {
    if (currentProjectKey) dispatch(dataStorageActions.loadDataStorage(currentProjectKey));
  }, [dispatch, currentProjectKey]);

  const createDaskClusterDialogProps = {
    title: 'Create Dask Cluster',
    onSubmit: (cluster) => {
      dispatch(modalDialogActions.closeModalDialog());
      dispatch(clusterActions.createCluster({
        type: CLUSTER_TYPE,
        projectKey: currentProjectKey,
        ...cluster,
      }));
    },
    onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
    clusterMaxWorkers: getClusterMaxWorkers(CLUSTER_TYPE),
    workerMaxMemory: getWorkerMemoryMax(CLUSTER_TYPE),
    workerMaxCpu: getWorkerCpuMax(CLUSTER_TYPE),
    dataStorageOptions: dataStores.map(store => ({ text: store.displayName, value: store.name })),
  };

  return (
    <Page title="Dask">
      <Typography variant="body1">
        Dask is a flexible parallel computing library for analytic computing.
      </Typography>
      <Typography variant="body1">
        DataLabs supports usage of <a href="https://kubernetes.dask.org/en/latest/">Dask-Kubernetes</a> which allows workers to be
        scheduled across the cluster. This is tightly integrated with Jupyter.
      </Typography>
      <PagePrimaryActionButton
        id="create-button"
        className={classes.createButton}
        onClick={() => dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CREATE_CLUSTER, createDaskClusterDialogProps))}
      >
        Create Dask Cluster
      </PagePrimaryActionButton>
    </Page>
  );
};

export default DaskPage;
