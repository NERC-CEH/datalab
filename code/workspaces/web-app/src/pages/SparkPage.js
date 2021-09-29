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

export const getPythonMessage = (condaPath, schedulerAddress, maxWorkerMemoryGb) => {
  const pythonVersionString = `${condaPath}/bin/python`;

  // 1GB is reserved, and Spark expects integer values for the executor memory.
  const mem = Math.floor(maxWorkerMemoryGb) - 1;

  return `import os
import pyspark

conf = pyspark.SparkConf()
# The below option can be altered depending on your memory requirement.
# The maximum value is the amount of memory assigned to each worker, minus 1GB.
conf.set('spark.executor.memory', '${mem}g')

os.environ["PYSPARK_PYTHON"] = "${pythonVersionString}"
os.environ["PYSPARK_DRIVER_PYTHON"] = "${pythonVersionString}"

sc = pyspark.SparkContext(master="${schedulerAddress}", conf=conf)
sc
`;
};

const copyPythonSnippet = ({ condaPath, schedulerAddress, maxWorkerMemoryGb }) => {
  const message = getPythonMessage(condaPath, schedulerAddress, maxWorkerMemoryGb);
  try {
    copy(message);
    notify.success('Clipboard contains snippet for notebook cell');
  } catch (error) {
    notify.error('Unable to access clipboard.');
  }
};

export const getRMessage = (schedulerAddress, maxWorkerMemoryGb) => {
  // 1GB is reserved, and Spark expects integer values for the executor memory.
  const mem = Math.floor(maxWorkerMemoryGb) - 1;

  return `library(SparkR)

# The below option can be altered depending on your memory requirement.
# The maximum value is the amount of memory assigned to each worker, minus 1GB.
sparkR.session(master="${schedulerAddress}", sparkConfig=list(spark.executor.memory="${mem}g"))`;
};

const copyRSnippet = ({ schedulerAddress, maxWorkerMemoryGb }) => {
  const message = getRMessage(schedulerAddress, maxWorkerMemoryGb);
  try {
    copy(message);
    notify.success('Clipboard contains snippet for notebook cell');
  } catch (error) {
    notify.error('Unable to access clipboard.');
  }
};

const SparkPage = () => {
  const classes = useStyles();

  const copySnippets = {
    Python: copyPythonSnippet,
    R: copyRSnippet,
  };

  return (
    <Page className={''} title="Spark">
      <Typography variant="body1">
      <ExternalLink href="https://spark.apache.org/">Apache Spark</ExternalLink> is an open-source cluster-computing framework.<br/>
        DataLabs supports usage of Spark via Kubernetes which allows Spark executors
        to be deployed across the cluster.
      </Typography>
      <div className={classes.clusterList}>
        <ClustersContainer clusterType={SPARK_CLUSTER_TYPE} copySnippets={copySnippets} />
      </div>
    </Page>
  );
};

export default SparkPage;
