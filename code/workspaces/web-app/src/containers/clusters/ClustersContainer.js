import PropTypes from 'prop-types';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import { useCurrentUserPermissions } from '../../hooks/authHooks';
import ProjectClustersContainer from './ProjectClustersContainer';

const ClustersContainer = ({ clusterType }) => {
  const { value: projectKey } = useCurrentProjectKey();
  const { value: userPermissions } = useCurrentUserPermissions();
  const showCreateButton = true;
  return ProjectClustersContainer({ clusterType, projectKey, userPermissions, showCreateButton });
};

export default ClustersContainer;

ClustersContainer.propTypes = {
  clusterType: PropTypes.string.isRequired,
};
