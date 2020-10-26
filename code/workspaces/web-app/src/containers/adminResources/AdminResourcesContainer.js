import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { useProjectsArray } from '../../hooks/projectsHooks';
import ProjectMultiSelect from './ProjectMultiSelect';
import projectsActions from '../../actions/projectActions';
import sortByName from './sortByName';
import ProjectResources from './ProjectResources';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import Pagination from '../../components/stacks/Pagination';

const useStyles = makeStyles(theme => ({
  showControls: {
    display: 'flex',
    alignItems: 'center',
  },
  showText: {
    fontWeight: '400',
    marginRight: theme.spacing(4),
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

function AdminResourcesContainer({ userPermissions }) {
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

  const renderedProjects = shownProjects && shownProjects.length > 0
    ? shownProjects.map(project => <ProjectResources userPermissions={userPermissions} project={project} show={show} />)
    : [<div className={classes.placeholderCard} key={'placeholder-card'}>
        <Typography variant="body1">No projects to display.</Typography>
      </div>];

  return (
    <>
      <ProjectMultiSelect selectedProjects={selectedProjects} setSelectedProjects={setSelectedProjects} />
      <div className={classes.showControls}>
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
      <PromisedContentWrapper fetchingClassName={classes.placeholderCard} promise={projects}>
        <Pagination items={renderedProjects} itemsPerPage={5} itemsName="Projects"/>
      </PromisedContentWrapper>
      </div>
    </>
  );
}

export default AdminResourcesContainer;
