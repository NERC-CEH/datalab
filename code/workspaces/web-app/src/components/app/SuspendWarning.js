import React, { useState } from 'react';
import { Link, Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import ReactMarkdown from 'react-markdown/react-markdown.min';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PropTypes from 'prop-types';
import { extendSubdomain } from '../../core/getDomainInfo';

const styles = theme => ({
  message: {
    display: 'flex',
    margin: '15px',
    alignItems: 'center',
    backgroundColor: theme.palette.warningBackground,
    borderRadius: theme.shape.borderRadius,
  },
  text: {
    flexGrow: 1,
  },
  icon: {
    padding: '10px',
  },
  info: {
    padding: '5px',
  },
  hide: {
    padding: 0,
  },
});

const SuspendWarning = ({ classes, message, docId }) => {
  const [showMessage, setShowMessage] = useState(true);
  const onHide = () => setShowMessage(false);
  return (
    <div>
      { showMessage ? <div className={classes.message}>
        <ErrorOutlinedIcon className={classes.icon}/>
        <div className={classes.text}>
          <ReactMarkdown>
            {message}
          </ReactMarkdown>
        </div>
        <div className={classes.info}>
          <Button color="inherit">
            <Link
                style={{ textDecoration: 'none' }}
                target="_blank"
                color="inherit"
                href={`${extendSubdomain('docs')}/howto/${docId}`}
            >
              MORE
            </Link>
          </Button>
        </div>
        { showMessage ? <div className={classes.info}>
            <Button color="inherit" onClick={onHide}>
              <CloseOutlinedIcon className={classes.hide} />
            </Button>
          </div> : null
        }
      </div> : null
      }
    </div>
  );
};

SuspendWarning.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  docId: PropTypes.string.isRequired,
};

export default withStyles(styles)(SuspendWarning);
