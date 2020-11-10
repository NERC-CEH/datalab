import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CreateSiteForm, { FORM_NAME, TYPE_FIELD_NAME, VERSION_FIELD_NAME } from '../sites/CreateSiteForm';
import { getSiteInfo } from '../../config/images';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';
import { getTypeOptions, getVersionOptions, updateVersionOnTypeChange } from '../stacks/typeAndVersionFormUtils';

const CreateSiteDialog = ({ title, onSubmit, onCancel, dataStorageOptions, projectKey }) => {
  const [siteOptions, setSiteOptions] = useState({});

  useEffect(() => {
    async function getSiteOptions() {
      const options = await getSiteInfo();
      setSiteOptions(options);
    }
    getSiteOptions();
  }, []);

  const siteTypeValue = useReduxFormValue(FORM_NAME, TYPE_FIELD_NAME);
  const versionOptions = getVersionOptions(siteOptions, siteTypeValue);

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
            typeOptions={getTypeOptions(siteOptions)}
            versionOptions={versionOptions}
            onChange={updateVersionOnTypeChange(FORM_NAME, TYPE_FIELD_NAME, VERSION_FIELD_NAME, versionOptions)}
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
