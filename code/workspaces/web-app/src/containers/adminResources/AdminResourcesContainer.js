import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { useProjectsArray } from '../../hooks/projectsHooks';
import ProjectMultiSelect from '../../components/common/form/ProjectMultiSelect';
import projectActions from '../../actions/projectActions';
import userActions from '../../actions/userActions';
import sortByName from '../../components/common/sortByName';
import ProjectResources from './ProjectResources';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import Pagination from '../../components/stacks/Pagination';

const useShowControlsStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const useShowTextStyles = makeStyles(theme => ({
  root: {
    fontWeight: 400,
    marginRight: theme.spacing(4),
  },
}));

const usePlaceholderCardStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

function AdminResourcesContainer({ userPermissions }) {
  const dispatch = useDispatch();
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [show, setShow] = useState({
    notebooks: true,
    sites: true,
    clusters: true,
    storage: true,
  });
  const classesShowControls = useShowControlsStyles();
  const classesShowText = useShowTextStyles();
  const classesPlaceholderCard = usePlaceholderCardStyles();
  const projects = useProjectsArray();
  const shownProjects = (selectedProjects && selectedProjects.length > 0) ? selectedProjects : sortByName(projects.value);

  useEffect(() => {
    dispatch(projectActions.getAllProjectsAndResources());
    dispatch(userActions.listUsers());
  }, [dispatch]);

  const handleCheckboxChange = (event) => {
    setShow({ ...show, [event.target.name]: event.target.checked });
  };

  const renderedProjects = shownProjects && shownProjects.length > 0
    ? shownProjects.map(project => <ProjectResources key={project.key} userPermissions={userPermissions} project={project} show={show} />)
    : [<div className={classesPlaceholderCard.root} key={'placeholder-card'}>
        <Typography variant="body1">No projects to display.</Typography>
      </div>];

  const projectsInput = {
    onChange: (val) => { setSelectedProjects(val); },
    value: selectedProjects,
  };

  return (
    <>
      <ProjectMultiSelect input={projectsInput} />
      <div className={classesShowControls.root}>
        <span className={classesShowText.root}>Show</span>
        <FormControlLabel label="Notebooks" control={
          <Checkbox checked={show.notebooks} onChange={handleCheckboxChange} name="notebooks" color="primary" />
        } />
        <FormControlLabel label="Sites" control={
          <Checkbox checked={show.sites} onChange={handleCheckboxChange} name="sites" color="primary" />
        } />
        <FormControlLabel label="Clusters" control={
          <Checkbox checked={show.clusters} onChange={handleCheckboxChange} name="clusters" color="primary" />
        } />
        <FormControlLabel label="Storage" control={
          <Checkbox checked={show.storage} onChange={handleCheckboxChange} name="storage" color="primary" />
        } />
      </div>
      <div>
        <PromisedContentWrapper fetchingClassName={classesPlaceholderCard.root} promise={projects}>
          <Pagination items={renderedProjects} itemsPerPage={5} itemsName="Projects"/>
        </PromisedContentWrapper>
      </div>
    </>
  );
}

export default AdminResourcesContainer;
