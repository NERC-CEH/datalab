import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { ANALYSIS, PUBLISH } from 'common/src/stackTypes';
import { useUsers } from '../../hooks/usersHooks';
import { useOtherUserRoles } from '../../hooks/otherUserRolesHooks';
import { useProjectsArray } from '../../hooks/projectsHooks';
import UserMultiSelect from './UserMultiSelect';
import userActions from '../../actions/userActions';
import sortByName from '../adminResources/sortByName';
import otherUserRolesActions from '../../actions/otherUserRolesActions';
import filterUserByRoles from './filterUserByRoles';
import UserResources from './UserResources';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import Pagination from '../../components/stacks/Pagination';
import projectActions from '../../actions/projectActions';
import dataStoreActions from '../../actions/dataStorageActions';
import stackActions from '../../actions/stackActions';

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
    projectAdmin: false,
    projectUser: false,
    projectViewer: false,
    siteOwner: false,
    notebookOwner: false,
    storageAccess: false,
  });
  const classes = useStyles();
  const users = useUsers();
  const projects = useProjectsArray();
  const otherUserRoles = useOtherUserRoles();

  // get list of users and projects
  useEffect(() => {
    dispatch(userActions.listUsers());
    dispatch(projectActions.loadProjects());
  }, [dispatch]);

  // get roles for users
  useEffect(() => {
    // (sort by name, so gets data in same order as being shown)
    sortByName(users.value).forEach((user) => {
      dispatch(otherUserRolesActions.getOtherUserRoles(user.userId));
    });
  }, [dispatch, users.value]);

  // get resources for projects
  useEffect(() => {
    projects.value.forEach((project) => {
      dispatch(dataStoreActions.loadDataStorage(project.key));
      dispatch(stackActions.loadStacksByCategory(project.key, ANALYSIS));
      dispatch(stackActions.loadStacksByCategory(project.key, PUBLISH));
    });
  }, [dispatch, projects.value]);

  // the users before applying the checkbox filters
  const preFilteredUsers = (selectedUsers && selectedUsers.length > 0) ? selectedUsers : sortByName(users.value);

  // the users after applying the checkbox filters
  const filteredUsers = preFilteredUsers.filter(user => filterUserByRoles(user.userId, filters, otherUserRoles.value));

  const renderedUsers = filteredUsers && filteredUsers.length > 0
    ? filteredUsers.map(user => <UserResources key={user.userId} user={user} filters={filters} roles={otherUserRoles.value[user.userId]} />)
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
      <UserMultiSelect selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
      <div className={classes.filterControls}>
        <div className={classes.filterColumn}>
          <span className={classes.filterText}>Filter</span>
        </div>
        <div className={classes.filterColumn}>
          <FilterCheckBox label="Instance admin" checked={filters.instanceAdmin} name="instanceAdmin" />
        </div>
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
      </div>
      <div>
        <PromisedContentWrapper fetchingClassName={classes.placeholderCard} promise={otherUserRoles}>
          <Pagination items={renderedUsers} itemsPerPage={5} itemsName="Users" />
        </PromisedContentWrapper>
      </div>
    </>
  );
}

export default AdminUsersContainer;
