import React from 'react';
import { render } from '@testing-library/react';
import UserSelect, { Input, Option } from './UserSelect';
import { useUsersSortedByName } from '../../../hooks/usersHooks';

jest.mock('../../../hooks/usersHooks');
jest.mock('@material-ui/lab/Autocomplete', () => props => (<div>Autocomplete mock {JSON.stringify(props)}</div>));
jest.mock('@material-ui/core/CircularProgress', () => props => (<div>CircularProgress mock {JSON.stringify(props)}</div>));

jest.mock('@material-ui/core/TextField/TextField', () => props => (<div>TextField mock {`label=${props.label}`} {`placeholder=${props.placeholder}`}</div>));

const userOne = { name: 'User One', userId: 'user-one-id' };
const userTwo = { name: 'User Two', userId: 'user-two-id' };
const users = [userOne, userTwo];

const setSelectedUsersMock = jest.fn().mockName('setSelectedUser');

beforeEach(() => {
  useUsersSortedByName.mockReturnValue({ fetching: false, value: users });
});

describe('UserSelect', () => {
  const shallowRender = ({
    selectedUsers = null,
    setSelectedUsers = setSelectedUsersMock,
    ...additionalProps
  } = {}) => render(
    <UserSelect selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} {...additionalProps} />,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards className to child component', () => {
    const className = 'expected-class-name';
    const wrapper = shallowRender({ className });
    expect(wrapper.getByText('"className":"expected-class-name"', { exact: false })).not.toBeNull();
  });

  describe('multiselect prop', () => {
    it('forwards correctly to child', () => {
      const wrapper = shallowRender({ multiselect: true, selectedUsers: [] });
      expect(wrapper.getByText('"multiple":true', { exact: false })).not.toBeNull();
    });

    it('defaults to false when not provided', () => {
      const wrapper = shallowRender({});
      expect(wrapper.getByText('"multiple":false', { exact: false })).not.toBeNull();
    });
  });

  it('passes the list of users as the options for the child component', () => {
    const wrapper = shallowRender({});
    expect(wrapper.getByText(`"options":${JSON.stringify(users)}`, { exact: false })).not.toBeNull();
  });

  it('passes the selected users as the value of the child component', () => {
    const selectedUsers = userOne;
    const wrapper = shallowRender({ selectedUsers });
    expect(wrapper.getByText(`"value":${JSON.stringify(selectedUsers)}`, { exact: false })).not.toBeNull();
  });

  [false, true].forEach((fetching) => {
    it(`passes the value of fetching from the users object to the loading prop of the child component when fetching is ${fetching}`, () => {
      useUsersSortedByName.mockReturnValueOnce({ value: users, fetching });
      const wrapper = shallowRender({});
      expect(wrapper.getByText(`"loading":${fetching}`, { exact: false })).not.toBeNull();
    });
  });
});

describe('Input', () => {
  const shallowRender = ({
    params = { fromParams: 'expected-value', InputProps: { fromParamsInputProps: 'expected-value', endAdornment: 'expected-endAdornment' } },
    label = 'expected-label',
    placeholder = 'expected-placeholder',
    loading = false,
  } = {}) => render(<Input {...{ params, label, placeholder, loading }} />).container;

  it('renders to match snapshot when not loading', () => {
    expect(shallowRender({ loading: false })).toMatchSnapshot();
  });

  it('renders to match snapshot when loading', () => {
    expect(shallowRender({ loading: true })).toMatchSnapshot();
  });
});

describe('Option', () => {
  const shallowRender = ({
    option,
    selected,
    userSelectedToolTip = 'User selected',
  }) => render(<Option {...{ option, selected, userSelectedToolTip }} />).container;

  it('renders to match snapshot when user is not selected', () => {
    expect(shallowRender({ option: userOne, selected: false })).toMatchSnapshot();
  });

  it('renders to match snapshot when user is selected', () => {
    expect(shallowRender({ option: userOne, selected: true })).toMatchSnapshot();
  });
});
