import React from 'react';
// import { render, fireEvent, configure } from '@testing-library/react';
import * as redux from 'react-redux';
import { render, fireEvent, configure } from '../../testUtils/renderTests';
import { PureAddAssetsToNotebookForm } from './AddAssetsToNotebookForm';
import * as reduxFormHooks from '../../hooks/reduxFormHooks';

jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  Field: props => (<div>{`Field: ${JSON.stringify(props)}`}</div>),
}));

describe('AddAssetsToNotebookForm', () => {
  const dispatchMock = jest.fn().mockName('dispatch');
  const clearFn = jest.fn();
  const handleClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    configure({ testIdAttribute: 'id' });
    jest.mock('react-redux');
    jest.mock('../../hooks/reduxFormHooks');

    redux.useDispatch = jest.fn().mockReturnValue(dispatchMock);
    redux.useSelector = jest.fn().mockReturnValue([]);
    reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('dummyValue');
    handleClear.mockReturnValue(clearFn);
  });

  const handleSubmit = jest.fn();

  const generateProps = () => ({
    handleSubmit,
    handleClear,
    projectOptions: [{ text: 'project1', value: 'project1' }, { text: 'project2', value: 'project2' }],
    notebookOptions: [{ text: 'notebook1', value: 'notebook1' }, { text: 'notebook2', value: 'notebook2' }],
    assetInfo: 'assetInfo',
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

  it('calls handleClear when form is cleared', () => {
    const props = generateProps();

    const wrapper = render(<PureAddAssetsToNotebookForm {...props}/>);

    fireEvent.click(wrapper.getByText('Reset'));
    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(handleClear).toHaveBeenCalledWith([], 'dummyValue', 'dummyValue');
    expect(clearFn).toHaveBeenCalledTimes(1);
  });

  it('calls submit function when the form is submitted', () => {
    const props = generateProps();

    const wrapper = render(<PureAddAssetsToNotebookForm {...props}/>);

    expect(handleSubmit).toHaveBeenCalledTimes(0);
    fireEvent.submit(wrapper.getByTestId('submit'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
