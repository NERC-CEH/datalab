import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import theme from '../../theme';

const ResourceAccordion = withStyles({
  root: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
    '&:before': {
      backgroundColor: 'transparent',
    },
    '&$expanded': {
      margin: `0, 0, ${theme.spacing(6)}, 0`,
    },
    margin: `0, 0, ${theme.spacing(1)}, 0`,
  },
  expanded: {
  },
})(ExpansionPanel);

const ResourceAccordionSummary = withStyles({
  root: {
    justifyContent: 'flex-start',
    margin: `${theme.spacing(1)}, 0`,
    padding: 0,
    minHeight: 0,
    '&$expanded': {
      margin: `${theme.spacing(1)}, 0`,
      minHeight: 0,
    },
  },
  expandIcon: {
    padding: 0,
    marginLeft: '15px',
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
