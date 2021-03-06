import React from 'react';
import { shallow } from 'enzyme';
import { PureCreateNotebookForm } from './CreateNotebookForm';

describe('CreateNotebookForm', () => {
  function shallowRender(props) {
    return shallow(<PureCreateNotebookForm {...props} />);
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
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });

  it('creates correct snapshot for create Notebook Form when there are not version options', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});
