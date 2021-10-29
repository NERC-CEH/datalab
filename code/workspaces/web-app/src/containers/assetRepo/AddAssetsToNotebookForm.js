import React, { useEffect } from 'react';
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

const AddAssetsToNotebookFormContent = ({ handleSubmit, projectOptions, notebookOptions }) => {
  const projectValue = useReduxFormValue(FORM_NAME, PROJECT_FIELD_NAME);
  const notebookValue = useReduxFormValue(FORM_NAME, NOTEBOOK_FIELD_NAME);
  const dispatch = useDispatch();

  const stacks = useSelector(s => s.stacks.value);

  useEffect(() => {
    // When a notebook in a project is selected, get the assets already on the notebook and display them.
    if (projectValue && notebookValue) {
      const notebook = stacks.find(s => s.projectKey === projectValue && s.name === notebookValue);
      if (notebook) {
        const assetsOnNotebook = notebook.assets;
        dispatch(change(FORM_NAME, EXISTING_ASSETS_FIELD_NAME, assetsOnNotebook));
      }
    }
  }, [dispatch, stacks, projectValue, notebookValue]);

  const clearForm = () => dispatch(reset(FORM_NAME));

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
        <UpdateFormControls onCancel={clearForm}/>
      </form>
    </div>
  );
};

const AddAssetsToNotebookForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: validator,
})(AddAssetsToNotebookFormContent);

export {
  AddAssetsToNotebookFormContent as PureAddAssetsToNotebookForm,
  AddAssetsToNotebookForm,
};
