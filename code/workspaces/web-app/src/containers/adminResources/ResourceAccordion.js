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
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {
  },
})(ExpansionPanel);

const ResourceAccordionSummary = withStyles({
  root: {
    justifyContent: 'flex-start',
    margin: '10px 0 0 0',
    minHeight: 0,
    '&$expanded': {
      margin: '10px 0 0 0',
      minHeight: 0,
    },
  },
  expandIcon: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  expanded: {
  },
  content: {
    flexGrow: 0,
    margin: 0,
    '&$expanded': {
      margin: 0,
    },
  },
})(ExpansionPanelSummary);

const ResourceAccordionDetails = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },
})(ExpansionPanelDetails);

export { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails };
