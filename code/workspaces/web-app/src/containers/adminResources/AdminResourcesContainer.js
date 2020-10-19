import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useProjectsArray } from '../../hooks/projectsHooks';
import ProjectMultiSelect from './ProjectMultiSelect';
import projectsActions from '../../actions/projectActions';
import sortByName from './sortByName';
import ProjectResources from './ProjectResources';

const useStyles = makeStyles(theme => ({
  showText: {
    fontWeight: '400',
    marginRight: theme.spacing(4),
  },
}));

function AdminResourcesContainer(props) {
  const { userPermissions } = props;
  const dispatch = useDispatch();
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [show, setShow] = useState({
    notebooks: true,
    sites: true,
    storage: true,
  });
  const classes = useStyles();
  const projects = useProjectsArray();
  const shownProjects = (selectedProjects && selectedProjects.length > 0) ? selectedProjects : sortByName(projects.value);

  useEffect(() => {
    dispatch(projectsActions.loadProjects());
  }, [dispatch]);

  const handleCheckboxChange = (event) => {
    setShow({ ...show, [event.target.name]: event.target.checked });
  };

  return (
    <>
      <ProjectMultiSelect selectedProjects={selectedProjects} setSelectedProjects={setSelectedProjects}></ProjectMultiSelect>
      <div>
        <span className={classes.showText}>Show</span>
        <FormControlLabel label="Notebooks" control={
          <Checkbox checked={show.notebooks} onChange={handleCheckboxChange} name="notebooks" color="primary" />
        } />
        <FormControlLabel label="Sites" control={
          <Checkbox checked={show.sites} onChange={handleCheckboxChange} name="sites" color="primary" />
        } />
        <FormControlLabel label="Storage" control={
          <Checkbox checked={show.storage} onChange={handleCheckboxChange} name="storage" color="primary" />
        } />
      </div>
      <div>
        {shownProjects.map(project => ProjectResources({ userPermissions, project, show }))}
      </div>
    </>
  );
}

export default AdminResourcesContainer;
