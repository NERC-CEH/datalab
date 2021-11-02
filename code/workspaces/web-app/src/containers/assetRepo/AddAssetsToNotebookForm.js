import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { useSelector } from 'react-redux';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';
import { UpdateFormControls, formatAndParseMultiSelect, renderSelectField } from '../../components/common/form/controls';
import AssetMultiSelect from '../../components/common/form/AssetMultiSelect';
import validator from './addAssetsToNotebookValidator';

export const FORM_NAME = 'addAssetsToNotebook';
export const PROJECT_FIELD_NAME = 'project';
export const NOTEBOOK_FIELD_NAME = 'notebook';
export const EXISTING_ASSETS_FIELD_NAME = 'existingAssets';
export const ASSETS_FIELD_NAME = 'assets';

const AddAssetsToNotebookFormContent = ({ handleSubmit, projectOptions, notebookOptions, handleClear }) => {
  const selectedProject = useReduxFormValue(FORM_NAME, PROJECT_FIELD_NAME);
  const selectedNotebook = useReduxFormValue(FORM_NAME, NOTEBOOK_FIELD_NAME);
  const notebooks = useSelector(s => s.stacks.value);

  return (
    <div>
      <form onSubmit={handleSubmit} id={'submit'}>
        <div>
          <Field
            name={PROJECT_FIELD_NAME}
            label={'Project'}
            component={renderSelectField}
            options={projectOptions}
          />
        </div>
        <div>
          <Field
            disabled={!selectedProject}
            name={NOTEBOOK_FIELD_NAME}
            label={'Notebook'}
            component={renderSelectField}
            options={notebookOptions}
          />
        </div>
        {selectedNotebook && <div>
          <Field
            disabled
            placeholder={''}
            name={EXISTING_ASSETS_FIELD_NAME}
            label={'Existing Assets on Notebook'}
            component={AssetMultiSelect}
            projectKey={selectedProject}
            format={formatAndParseMultiSelect}
            parse={formatAndParseMultiSelect}
          />
        </div>}
        <div>
          <Field
            disabled={!(selectedProject && selectedNotebook)}
            name={ASSETS_FIELD_NAME}
            label={'Assets'}
            component={AssetMultiSelect}
            projectKey={selectedProject}
            format={formatAndParseMultiSelect}
            parse={formatAndParseMultiSelect}
          />
        </div>
        <UpdateFormControls onCancel={handleClear(notebooks, selectedProject, selectedNotebook)} cancelButtonText={'Reset'}/>
      </form>
    </div>
  );
};

const options = PropTypes.shape({
  text: PropTypes.string,
  value: PropTypes.string,
});

const formPropTypes = {
  projectOptions: PropTypes.arrayOf(options),
  notebookOptions: PropTypes.arrayOf(options),
};

AddAssetsToNotebookFormContent.propTypes = {
  ...formPropTypes,
  handleSubmit: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired,
};

const AddAssetsToNotebookForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(AddAssetsToNotebookFormContent);

AddAssetsToNotebookForm.propTypes = {
  ...formPropTypes,
  onSubmit: PropTypes.func.isRequired,
};

export {
  AddAssetsToNotebookFormContent as PureAddAssetsToNotebookForm,
  AddAssetsToNotebookForm,
};
