import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { PUBLISH, getCategoryFromTypeName, ANALYSIS } from 'common/src/stackTypes';
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

export default function UserProject(props) {
  const allDataStorage = useDataStorageArray();
  const allProjects = useProjectsArray();
  const allStacks = useStacksArray();
  const classes = useStyles();
  const { projectKey, filters, roles } = props;
  const filtersOff = allFiltersOff(filters);

  const userProject = allProjects.value
    .filter(proj => proj.key === projectKey)[0];
  const projectKeys = cardsToShow.projectCardsToShow(roles, projectKey);
  const projects = allProjects.value
    .filter(proj => projectKeys.includes(proj.key));
  const siteNames = cardsToShow.siteCardsToShow(roles, projectKey);
  const sites = allStacks.value
    .filter(stack => getCategoryFromTypeName(stack.type) === PUBLISH)
    .filter(stack => siteNames.includes(stack.name));
  const notebookNames = cardsToShow.notebookCardsToShow(roles, projectKey);
  const notebooks = allStacks.value
    .filter(stack => getCategoryFromTypeName(stack.type) === ANALYSIS)
    .filter(stack => notebookNames.includes(stack.name));
  const dataStorageNames = cardsToShow.dataStorageCardsToShow(roles, projectKey);
  const dataStores = allDataStorage.value
    .filter(store => dataStorageNames.includes(store.name));

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
                  <Typography variant="body1">Project admin</Typography>
                  <Checkbox checked={roles.projectAdmin.includes(projectKey)} name="projectAdmin" color="primary" disabled />
                  <Typography variant="body1">Project user</Typography>
                  <Checkbox checked={roles.projectUser.includes(projectKey)} name="projectUser" color="primary" disabled />
                  <Typography variant="body1">Project viewer</Typography>
                  <Checkbox checked={roles.projectViewer.includes(projectKey)} name="projectViewer" color="primary" disabled />
                </div>
                <Projects projects={ projects }/>
               </>
            )}
            {(filtersOff || filters.siteOwner) && sites.length > 0 && Sites({ sites })}
            {(filtersOff || filters.notebookOwner) && notebooks.length > 0 && Notebooks({ notebooks })}
            {(filtersOff || filters.storageAccess) && dataStores.length > 0 && DataStores({ dataStores })}
          </div>
        </ResourceAccordionDetails>
      </ResourceAccordion>
    </div>
  );
}
