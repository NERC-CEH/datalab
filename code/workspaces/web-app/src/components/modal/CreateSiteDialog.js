import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CreateSiteForm, { FORM_NAME, TYPE_FIELD_NAME, VERSION_FIELD_NAME } from '../sites/CreateSiteForm';
import { getSiteInfo } from '../../config/images';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';
import { getTypeOptions, getVersionOptions, updateVersionOnTypeChange, getCanChooseFile, getCanChooseConda } from '../stacks/typeAndVersionFormUtils';

const CreateSiteDialog = ({ title, onSubmit, onCancel, dataStorageOptions, projectKey }) => {
  const siteTypeValue = useReduxFormValue(FORM_NAME, TYPE_FIELD_NAME);
  const versionOptions = getVersionOptions(getSiteInfo(), siteTypeValue);

  return (
    <Dialog open={true} maxWidth="md">
      <div>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <CreateSiteForm
            onSubmit={onSubmit}
            cancel={onCancel}
            dataStorageOptions={dataStorageOptions}
            projectKey={projectKey}
            typeOptions={getTypeOptions(getSiteInfo())}
            versionOptions={versionOptions}
            onChange={updateVersionOnTypeChange(FORM_NAME, TYPE_FIELD_NAME, VERSION_FIELD_NAME, versionOptions)}
            fileField={getCanChooseFile(getSiteInfo(), siteTypeValue)}
            condaField={getCanChooseConda(getSiteInfo(), siteTypeValue)}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
};

CreateSiteDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  dataStorageOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CreateSiteDialog;
