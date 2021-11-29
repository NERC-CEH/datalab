import React from 'react';
import { render } from '@testing-library/react';
import { JUPYTER } from 'common/src/stackTypes';
import { PureCreateNotebookForm } from './CreateNotebookForm';
import * as reduxFormHooks from '../../hooks/reduxFormHooks';

jest.mock('../../hooks/reduxFormHooks');
reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('value');

jest.mock('../common/form/controls', () => ({
  CreateFormControls: props => (<>CreateFormControls Mock {JSON.stringify(props)}</>),
}));
jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  Field: props => (<>Field Mock: {JSON.stringify(props)}</>),
}));
jest.mock('../common/selectShareOptions', () => ({
  notebookSharingOptions: [{ text: 'Private', value: 'private' }, { text: 'Public', value: 'public' }],
}));

describe('CreateNotebookForm', () => {
  function renderComponent(props) {
    return render(<PureCreateNotebookForm {...props} />);
  }

  const onSubmitMock = jest.fn();
  const onCancelMock = jest.fn();

  const generateProps = ({ versionOptions = [] } = {}) => ({
    onSubmit: onSubmitMock,
    cancel: onCancelMock,
    dataStorageOptions: [
      { text: 'First Data Store', value: 'alpha' },
      { text: 'Second Data Store', value: 'beta' },
    ],
    projectKey: 'testproj',
    typeOptions: [
      { text: 'JupyterLab', value: 'JUPYTER_LAB' },
      { text: 'Jupyter', value: 'JUPYTER' },
      { text: 'RStudio', value: 'RSTUDIO' },
      { text: 'Zeppelin', value: 'ZEPPELIN' },
    ],
    versionOptions,
  });

  beforeEach(() => jest.resetAllMocks());

  it('creates correct snapshot for create Notebook Form when there are version options', () => {
    // Arrange
    const versionOptions = [{ text: '0.1.0', value: '0.1.0' }, { text: '0.2.0', value: '0.2.0' }];
    const props = generateProps({ versionOptions });

    // Act
    const wrapper = renderComponent(props);

    // Assert
    expect(wrapper.container).toMatchSnapshot();
  });

  it('creates correct snapshot for create Notebook Form when there are not version options', () => {
    // Arrange
    const props = generateProps();

    // Act
    const wrapper = renderComponent(props);

    // Assert
    expect(wrapper.container).toMatchSnapshot();
  });

  it('creates correct snapshot for create Notebook Form when the type supports single hostname', () => {
    // Arrange
    const props = generateProps();
    reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue(JUPYTER);

    // Act
    const wrapper = renderComponent(props);

    // Assert
    expect(wrapper.container).toMatchSnapshot();
  });
});
