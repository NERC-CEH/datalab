import React from 'react';
import { shallow } from 'enzyme';
import { PureCreateNotebookForm, getUrlNameStartEndText } from './CreateNotebookForm';

describe('getUrlNameStartEndText', () => {
  it('returns correct values when on localhost', () => {
    const windowLocation = {
      protocol: 'https:',
      hostname: 'localhost',
    };
    const { startText, endText } = getUrlNameStartEndText(windowLocation);

    expect(startText).toEqual('https://testlab-');
    expect(endText).toEqual('.datalabs.localhost');
  });

  it('returns correct values when on testlab.datalabs.localhost', () => {
    const windowLocation = {
      protocol: 'https:',
      hostname: 'testlab.datalabs.localhost',
    };
    const { startText, endText } = getUrlNameStartEndText(windowLocation);

    expect(startText).toEqual('https://testlab-');
    expect(endText).toEqual('.datalabs.localhost');
  });

  it('returns correct values when on datalab.datalabs.nerc.ac.uk', () => {
    const windowLocation = {
      protocol: 'https:',
      hostname: 'datalab.datalabs.nerc.ac.uk',
    };
    const { startText, endText } = getUrlNameStartEndText(windowLocation);

    expect(startText).toEqual('https://datalab-');
    expect(endText).toEqual('.datalabs.nerc.ac.uk');
  });
});

describe('CreateNotebookForm', () => {
  function shallowRender(props) {
    return shallow(<PureCreateNotebookForm {...props} />);
  }

  const onSubmitMock = jest.fn();
  const onCancelMock = jest.fn();

  const generateProps = () => ({
    onSubmit: onSubmitMock,
    cancel: onCancelMock,
    dataStorageOptions: [
      { text: 'First Data Store', value: 'alpha' },
      { text: 'Second Data Store', value: 'beta' },
    ],
  });

  beforeEach(() => jest.resetAllMocks());

  it('creates correct snapshot for create Notebook Form', () => {
    // Arrange
    const props = generateProps();

    // Act
    const output = shallowRender(props);

    // Assert
    expect(output).toMatchSnapshot();
  });
});
