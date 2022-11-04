import withStyles from '@mui/styles/withStyles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
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
})(Accordion);

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
})(AccordionSummary);

const ResourceAccordionDetails = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },
})(AccordionDetails);

export { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails };
