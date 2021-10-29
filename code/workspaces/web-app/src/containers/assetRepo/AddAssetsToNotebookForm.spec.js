import React from 'react';
import { render, fireEvent, configure } from '@testing-library/react';
import { change, reset } from 'redux-form';
import * as redux from 'react-redux';
import { PureAddAssetsToNotebookForm, FORM_NAME, EXISTING_ASSETS_FIELD_NAME } from './AddAssetsToNotebookForm';
import * as reduxFormHooks from '../../hooks/reduxFormHooks';

jest.mock('redux-form', () => ({
  reduxForm: jest.fn(() => jest.fn()),
  Field: props => (<div>{`Field: ${JSON.stringify(props)}`}</div>),
  change: jest.fn(),
  reset: jest.fn(),
}));

describe('AddAssetsToNotebookForm', () => {
  const dispatchMock = jest.fn().mockName('dispatch');

  beforeEach(() => {
    jest.clearAllMocks();
    configure({ testIdAttribute: 'id' });
    jest.mock('react-redux');
    jest.mock('../../hooks/reduxFormHooks');

    redux.useDispatch = jest.fn().mockReturnValue(dispatchMock);
    redux.useSelector = jest.fn().mockReturnValue([]);
    reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('dummyValue');
  });

  const handleSubmit = jest.fn();

  const generateProps = () => ({
    handleSubmit,
    projectOptions: ['project1', 'project2'],
    notebookOptions: ['notebook1', 'notebook2'],
  });

  it('renders correctly when a project and notebook have been selected', () => {
    const props = generateProps();

    reduxFormHooks.useReduxFormValue = jest.fn()
      .mockReturnValueOnce('project1')
      .mockReturnValueOnce('notebook1');

    const wrapper = render(<PureAddAssetsToNotebookForm {...props}/>);

    expect(wrapper.container).toMatchSnapshot();
    expect(wrapper.queryAllByText('Field', { exact: false })).toHaveLength(4);
  });

  it('renders correctly when a no notebook has been selected', () => {
    const props = generateProps();

    reduxFormHooks.useReduxFormValue = jest.fn()
      .mockReturnValueOnce('project1')
      .mockReturnValueOnce();

    const wrapper = render(<PureAddAssetsToNotebookForm {...props}/>);

    expect(wrapper.container).toMatchSnapshot();
    expect(wrapper.queryAllByText('Field', { exact: false })).toHaveLength(3);
  });

  it('dispatches reset when form is cleared', () => {
    const props = generateProps();
    const resetDispatch = jest.fn();
    reset.mockReturnValueOnce(resetDispatch);

    const wrapper = render(<PureAddAssetsToNotebookForm {...props}/>);

    fireEvent.click(wrapper.getByText('Cancel'));
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(resetDispatch);
    expect(reset).toHaveBeenCalledTimes(1);
    expect(reset).toHaveBeenCalledWith(FORM_NAME);
  });

  it('calls submit function when the form is submitted', () => {
    const props = generateProps();

    const wrapper = render(<PureAddAssetsToNotebookForm {...props}/>);

    expect(handleSubmit).toHaveBeenCalledTimes(0);
    fireEvent.submit(wrapper.getByTestId('submit'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('displays existing assets when a notebook is selected', () => {
    const props = generateProps();
    reduxFormHooks.useReduxFormValue = jest.fn()
      .mockReturnValueOnce('project1')
      .mockReturnValueOnce('notebook1');
    const changeDispatch = jest.fn();
    change.mockReturnValueOnce(changeDispatch);

    const assets = ['existing asset1', 'existing asset2'];
    const stacks = [
      {
        projectKey: 'otherProject',
        name: 'notebook1',
        assets: ['not this asset'],
      },
      {
        projectKey: 'project1',
        name: 'notebook2',
        assets: ['or this asset'],
      },
      {
        projectKey: 'project1',
        name: 'notebook1',
        assets,
      },
    ];
    redux.useSelector = jest.fn().mockReturnValue(stacks);

    render(<PureAddAssetsToNotebookForm {...props}/>);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(changeDispatch);
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith(FORM_NAME, EXISTING_ASSETS_FIELD_NAME, assets);
  });
});
