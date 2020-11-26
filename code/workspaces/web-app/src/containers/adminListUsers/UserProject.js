import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../adminResources/ResourceAccordion';
import { useProjectsArray } from '../../hooks/projectsHooks';
import { useStacksArray } from '../../hooks/stacksHooks';
import { useDataStorageArray } from '../../hooks/dataStorageHooks';
import Projects from './Projects';
import Sites from './Sites';
import Notebooks from './Notebooks';
import DataStores from './DataStores';
import allFiltersOff from './allFiltersOff';
import cardsToShow from './cardsToShow';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(10),
  },
  resources: {
    marginLeft: theme.spacing(8),
  },
  heading: {
    margin: [[theme.spacing(2), 0]],
  },
  projectRoles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default function UserProject({ userId, projectKey, filters, roles }) {
  const allDataStorage = useDataStorageArray();
  const allProjects = useProjectsArray();
  const allStacks = useStacksArray();
  const classes = useStyles();
  const filtersOff = allFiltersOff(filters);

  const userProject = allProjects.value
    .filter(proj => proj.key === projectKey)[0];
  if (!userProject) {
    return (
      <Typography variant="h5" className={classes.heading}>No project matching {projectKey}</Typography>
    );
  }

  const projectKeys = cardsToShow.projectCardsToShow(roles, projectKey);
  const projects = allProjects.value
    .filter(proj => projectKeys.includes(proj.key));
  const siteNames = cardsToShow.siteCardsToShow(roles, projectKey);
  const sites = allStacks.value
    .filter(stack => siteNames.includes(stack.name));
  const notebookNames = cardsToShow.notebookCardsToShow(roles, projectKey);
  const notebooks = allStacks.value
    .filter(stack => notebookNames.includes(stack.name));
  const dataStorageNames = cardsToShow.dataStorageCardsToShow(roles, projectKey);
  const dataStores = allDataStorage.value
    .filter(store => dataStorageNames.includes(store.name));

  const ProjectCheckbox = ({ label, checked, name }) => {
    const id = `project-checkbox-${userId}-${projectKey}-${name}`;
    return (
    <>
      <Typography id={id} variant="body1">{label}</Typography>
      <Checkbox checked={checked} name={name} color="primary" disabled aria-labelledby={id} />
    </>
    );
  };

  return (
    <div className={classes.container}>
      <ResourceAccordion defaultExpanded>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className={classes.heading}>{userProject.name}</Typography>
        </ResourceAccordionSummary>
        <ResourceAccordionDetails>
          <div className={classes.resources}>
            {(filtersOff || filters.projectAdmin || filters.projectUser || filters.projectViewer) && projects.length > 0 && (
              <>
                <div className={classes.projectRoles}>
                  <ProjectCheckbox label="Project admin" checked={roles.projectAdmin.includes(projectKey)} name="projectAdmin" />
                  <ProjectCheckbox label="Project user" checked={roles.projectUser.includes(projectKey)} name="projectUser" />
                  <ProjectCheckbox label="Project viewer" checked={roles.projectViewer.includes(projectKey)} name="projectViewer" />
                </div>
                <Projects projects={projects}/>
               </>
            )}
            {(filtersOff || filters.siteOwner) && sites.length > 0 && (
              <Sites sites={sites} />
            )}
            {(filtersOff || filters.notebookOwner) && notebooks.length > 0 && (
              <Notebooks notebooks={notebooks} />
            )}
            {(filtersOff || filters.storageAccess) && dataStores.length > 0 && (
              <DataStores dataStores={dataStores} />
            )}
          </div>
        </ResourceAccordionDetails>
      </ResourceAccordion>
    </div>
  );
}
