import React from 'react';
import * as reduxFormHooks from '../../hooks/reduxFormHooks';
import { fireEvent, render } from '../../testUtils/renderTests';
import { PureEditRepoMetadataForm } from './EditRepoMetadataForm';
import { PUBLIC } from './assetVisibilities';

jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  Field: props => (<div>{`Field: ${JSON.stringify(props)}`}</div>),
}));

jest.mock('../../hooks/reduxFormHooks');
reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('value');

describe('EditRepoMetadataForm', () => {
  const initialValues = {
    owners: [],
    projects: [],
    visible: PUBLIC,
    citationString: 'Citation String',
    license: 'OGL',
    publisher: 'EIDC',
  };

  const handleSubmit = jest.fn().mockName('handleSubmit');
  const reset = jest.fn().mockName('reset');
  const onCancel = jest.fn().mockName('onCancel');

  const generateProps = () => ({
    handleSubmit,
    reset,
    pristine: true,
    onCancel,
    editPermissions: {},
    initialValues,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders to match snapshot', () => {
    const props = generateProps();
    const wrapper = render(<PureEditRepoMetadataForm {...props}/>);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('passes the correct fixedOptions when user has no edit permissions', () => {
    const props = generateProps();
    props.initialValues.owners = [{ userId: 'sub' }, { userId: 'other' }];

    const wrapper = render(<PureEditRepoMetadataForm {...props}/>);

    const fields = wrapper.queryAllByText((content, _) => content.startsWith('Field'));
    expect(fields).toMatchSnapshot();
  });

  it('passes the correct fixedOptions when user appears in the existing list', () => {
    const props = generateProps();
    props.initialValues.owners = [{ userId: 'sub' }, { userId: 'other' }];
    props.editPermissions = {
      owners: true,
      ownId: 'sub',
    };

    const wrapper = render(<PureEditRepoMetadataForm {...props}/>);

    const fields = wrapper.queryAllByText((content, _) => content.startsWith('Field'));
    expect(fields).toMatchSnapshot();
  });

  it('passes the correct fixedOptions when user is a data manager', () => {
    const props = generateProps();
    props.initialValues.owners = [{ userId: 'sub' }, { userId: 'other' }];
    props.editPermissions = {
      owners: true,
    };

    const wrapper = render(<PureEditRepoMetadataForm {...props}/>);

    const fields = wrapper.queryAllByText((content, _) => content.startsWith('Field'));
    expect(fields).toMatchSnapshot();
  });

  it('calls correct function when the form is submitted', () => {
    const props = generateProps();

    const wrapper = render(<PureEditRepoMetadataForm {...props}/>);

    fireEvent.submit(wrapper.getByText('Apply'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(reset).toHaveBeenCalledTimes(0);
    expect(onCancel).toHaveBeenCalledTimes(0);
  });

  it('calls correct function when the form is reset', () => {
    const props = generateProps();
    props.pristine = false; // Must not be pristine to clear changes.

    const wrapper = render(<PureEditRepoMetadataForm {...props}/>);

    fireEvent.click(wrapper.getByText('Clear Changes'));
    expect(handleSubmit).toHaveBeenCalledTimes(0);
    expect(reset).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(0);
  });

  it('calls correct function when the form is cancelled', () => {
    const props = generateProps();

    const wrapper = render(<PureEditRepoMetadataForm {...props}/>);

    fireEvent.click(wrapper.getByText('Cancel'));
    expect(handleSubmit).toHaveBeenCalledTimes(0);
    expect(reset).toHaveBeenCalledTimes(0);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
