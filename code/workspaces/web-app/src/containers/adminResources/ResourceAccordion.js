import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

const ResourceAccordion = withStyles({
  root: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
    '&:before': {
      backgroundColor: 'transparent',
    },
  },
  expanded: {},
})(ExpansionPanel);

const ResourceAccordionSummary = withStyles({
  root: {
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 0,
  },
  expanded: {},
})(ExpansionPanelSummary);

const ResourceAccordionDetails = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
})(ExpansionPanelDetails);

export { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails };
