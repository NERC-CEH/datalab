import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, change, reset } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';
import { UpdateFormControls, formatAndParseMultiSelect, renderSelectField } from '../../components/common/form/controls';
import AssetMultiSelect from '../../components/common/form/AssetMultiSelect';
import validator from './addAssetsToNotebookValidator';

export const FORM_NAME = 'addAssetsToNotebook';
export const PROJECT_FIELD_NAME = 'project';
export const NOTEBOOK_FIELD_NAME = 'notebook';
export const EXISTING_ASSETS_FIELD_NAME = 'existingAssets';
export const ASSETS_FIELD_NAME = 'assets';

const getExistingAssets = (dispatch, stacks, projectValue, notebookValue) => {
  // When a notebook in a project is selected, get the assets already on the notebook and display them.
  if (projectValue && notebookValue) {
    const notebook = stacks.find(s => s.projectKey === projectValue && s.name === notebookValue);
    if (notebook) {
      const assetsOnNotebook = notebook.assets;
      dispatch(change(FORM_NAME, EXISTING_ASSETS_FIELD_NAME, assetsOnNotebook));
    }
  }
};

const AddAssetsToNotebookFormContent = ({ handleSubmit, projectOptions, notebookOptions }) => {
  const projectValue = useReduxFormValue(FORM_NAME, PROJECT_FIELD_NAME);
  const notebookValue = useReduxFormValue(FORM_NAME, NOTEBOOK_FIELD_NAME);
  const dispatch = useDispatch();

  const stacks = useSelector(s => s.stacks.value);

  useEffect(() => {
    getExistingAssets(dispatch, stacks, projectValue, notebookValue);
  }, [dispatch, stacks, projectValue, notebookValue]);

  const clearForm = () => {
    // "reset" will retain any prefilled project/notebook/asset values from the URL,
    //  but we have to make sure the existing assets are still there if necessary.
    dispatch(reset(FORM_NAME));
    getExistingAssets(dispatch, stacks, projectValue, notebookValue);
  };

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
            name={NOTEBOOK_FIELD_NAME}
            label={'Notebook'}
            component={renderSelectField}
            options={notebookOptions}
          />
        </div>
        {notebookValue && <div>
          <Field
            disabled
            placeholder={''}
            name={EXISTING_ASSETS_FIELD_NAME}
            label={'Existing Assets on Notebook'}
            component={AssetMultiSelect}
            projectKey={projectValue}
            format={formatAndParseMultiSelect}
            parse={formatAndParseMultiSelect}
          />
        </div>}
        <div>
          <Field
            name={ASSETS_FIELD_NAME}
            label={'Assets'}
            component={AssetMultiSelect}
            projectKey={projectValue}
            format={formatAndParseMultiSelect}
            parse={formatAndParseMultiSelect}
          />
        </div>
        <UpdateFormControls onCancel={clearForm} cancelButtonText={'Reset'}/>
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
};

const AddAssetsToNotebookForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: validator,
})(AddAssetsToNotebookFormContent);

AddAssetsToNotebookForm.propTypes = {
  ...formPropTypes,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    project: PropTypes.string,
    notebook: PropTypes.string,
    assets: PropTypes.array,
  }),
};

export {
  AddAssetsToNotebookFormContent as PureAddAssetsToNotebookForm,
  AddAssetsToNotebookForm,
};
