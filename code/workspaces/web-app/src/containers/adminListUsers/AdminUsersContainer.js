import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { useUsers } from '../../hooks/usersHooks';
import { useRoles } from '../../hooks/rolesHooks';
import { useStacksArray } from '../../hooks/stacksHooks';
import { useDataStorageArray } from '../../hooks/dataStorageHooks';
import { useProjectsArray } from '../../hooks/projectsHooks';
import { useCatalogueAvailable } from '../../hooks/catalogueConfigHooks';
import sortByName from '../../components/common/sortByName';
import filterUserByRoles from './filterUserByRoles';
import UserResources from './UserResources';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import Pagination from '../../components/stacks/Pagination';
import roleActions from '../../actions/roleActions';
import projectActions from '../../actions/projectActions';
import createUserRoles from './createUserRoles';
import UserSelect from '../../components/common/input/UserSelect';
import PromisedContentSkeletonWrapper from '../../components/common/PromisedContentSkeletonWrapper';
import catalogueConfigActions from '../../actions/catalogueConfigActions';

const useStyles = makeStyles(theme => ({
  filterControls: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  filterColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterText: {
    fontWeight: '400',
    marginRight: theme.spacing(4),
    paddingTop: theme.spacing(2),
  },
  skeletonFilterItem: {
    margin: [[theme.spacing(1), theme.spacing(2)]],
  },
  placeholderCard: {
    width: '100%',
    height: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

function AdminUsersContainer() {
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    instanceAdmin: false,
    catalogueAdmin: false,
    cataloguePublisher: false,
    catalogueEditor: false,
    projectAdmin: false,
    projectUser: false,
    projectViewer: false,
    siteOwner: false,
    notebookOwner: false,
    storageAccess: false,
  });
  const catalogueAvailable = useCatalogueAvailable();
  const classes = useStyles();
  const users = useUsers();
  const projects = useProjectsArray();

  const roles = useRoles();
  const stacksArray = useStacksArray();
  const dataStorageArray = useDataStorageArray();
  const userRoles = createUserRoles(roles, stacksArray, dataStorageArray);

  // get everything we need
  useEffect(() => {
    dispatch(roleActions.getAllUsersAndRoles());
    dispatch(projectActions.getAllProjectsAndResources());
    dispatch(catalogueConfigActions.loadCatalogueConfig());
  }, [dispatch]);

  // the users before applying the checkbox filters
  const preFilteredUsers = (selectedUsers && selectedUsers.length > 0) ? selectedUsers : sortByName(users.value);

  // the users after applying the checkbox filters
  const filteredUsers = preFilteredUsers.filter(user => filterUserByRoles(user.userId, filters, userRoles));

  const renderedUsers = filteredUsers && filteredUsers.length > 0
    ? filteredUsers.map(user => <UserResources key={user.userId} user={user} filters={filters} roles={userRoles[user.userId]} />)
    : [<div className={classes.placeholderCard} key={'placeholder-card'}>
      <Typography variant="body1">No users to display.</Typography>
    </div>];

  const handleCheckboxChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.checked });
  };

  const FilterCheckBox = ({ label, checked, name }) => (
    <FormControlLabel label={label} control={
      <Checkbox checked={checked} onChange={handleCheckboxChange} name={name} color="primary" />
    } />
  );

  return (
    <>
      <UserSelect multiselect selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} label="Users" placeholder="Filter by user" />
      <div className={classes.filterControls}>
        <div className={classes.filterColumn}>
          <span className={classes.filterText}>Filter</span>
        </div>
        <PromisedContentSkeletonWrapper
          promises={catalogueAvailable}
          skeletonComponent={FilterSkeleton}
          skeletonProps={{ rows: 3, columns: 4 }}
        >
          <div className={classes.filterColumn}>
            <FilterCheckBox label="Instance admin" checked={filters.instanceAdmin} name="instanceAdmin" />
          </div>
          {catalogueAvailable.value && <div className={classes.filterColumn}>
            <FilterCheckBox label="Catalogue admin" checked={filters.catalogueAdmin} name="catalogueAdmin" />
            <FilterCheckBox label="Catalogue publisher" checked={filters.cataloguePublisher} name="cataloguePublisher" />
            <FilterCheckBox label="Catalogue editor" checked={filters.catalogueEditor} name="catalogueEditor" />
          </div>}
          <div className={classes.filterColumn}>
            <FilterCheckBox label="Project admin" checked={filters.projectAdmin} name="projectAdmin" />
            <FilterCheckBox label="Project user" checked={filters.projectUser} name="projectUser" />
            <FilterCheckBox label="Project viewer" checked={filters.projectViewer} name="projectViewer" />
          </div>
          <div className={classes.filterColumn}>
            <FilterCheckBox label="Site owner" checked={filters.siteOwner} name="siteOwner" />
            <FilterCheckBox label="Notebook owner" checked={filters.notebookOwner} name="notebookOwner" />
            <FilterCheckBox label="Storage access" checked={filters.storageAccess} name="storageAccess" />
          </div>
        </PromisedContentSkeletonWrapper>
      </div>
      <div>
        <PromisedContentWrapper fetchingClassName={classes.placeholderCard} promise={[roles, projects]}>
          <Pagination items={renderedUsers} itemsPerPage={5} itemsName="Users" />
        </PromisedContentWrapper>
      </div>
    </>
  );
}

const FilterSkeleton = ({ rows = 3, columns = 3 }) => {
  const classes = useStyles();

  const columnItems = [];
  for (let i = 0; i < rows; i++) {
    columnItems.push(
      <Skeleton className={classes.skeletonFilterItem} key={i} variant="text">
        <Typography>Text to infer size from.</Typography>
      </Skeleton>,
    );
  }

  const output = [];
  for (let i = 0; i < columns; i++) {
    output.push(<div key={i} className={classes.filterColumn}>{columnItems}</div>);
  }

  return <>{output}</>;
};

export default AdminUsersContainer;
