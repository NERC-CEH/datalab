import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '../common/control/IconButton';

const InfoDialog = ({ title, body, onClick, okText = 'OK', okIcon = 'done' }) => (
  <Dialog open={true} maxWidth="md">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{body}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <IconButton icon={okIcon} onClick={onClick}>{okText}</IconButton>
    </DialogActions>
  </Dialog>
);

InfoDialog.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  okText: PropTypes.string,
  okIcon: PropTypes.string,
};

export default InfoDialog;
