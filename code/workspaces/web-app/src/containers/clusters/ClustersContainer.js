import PropTypes from 'prop-types';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import { useCurrentUserPermissions } from '../../hooks/authHooks';
import ProjectClustersContainer from './ProjectClustersContainer';

const ClustersContainer = ({ clusterType, copySnippets }) => {
  const { value: projectKey } = useCurrentProjectKey();
  const { value: userPermissions } = useCurrentUserPermissions();
  const modifyData = true;
  return ProjectClustersContainer({ clusterType, projectKey, userPermissions, modifyData, copySnippets });
};

export default ClustersContainer;

ClustersContainer.propTypes = {
  clusterType: PropTypes.string.isRequired,
  copySnippets: PropTypes.objectOf(PropTypes.func),
};
