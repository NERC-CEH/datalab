import React from 'react';
import { shallow } from 'enzyme';
import UserSelect, { Input, Option } from './UserSelect';
import { useUsersSortedByName } from '../../../hooks/usersHooks';

jest.mock('../../../hooks/usersHooks');

const userOne = { name: 'User One', userId: 'user-one-id' };
const userTwo = { name: 'User Two', userId: 'user-two-id' };
const users = [userOne, userTwo];
useUsersSortedByName.mockReturnValue({ fetching: false, value: users });

const setSelectedUsersMock = jest.fn().mockName('setSelectedUser');

describe('UserSelect', () => {
  const shallowRender = ({
    selectedUsers = null,
    setSelectedUsers = setSelectedUsersMock,
    ...additionalProps
  } = {}) => shallow(
    <UserSelect selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} {...additionalProps} />,
  );

  const renderAndGetProp = (inputProps, renderedPropName) => {
    const wrapper = shallowRender(inputProps);
    return wrapper.prop(renderedPropName);
  };

  const expectRenderedPropToEqual = (inputProps, renderedPropName, expectedValue) => {
    expect(renderAndGetProp(inputProps, renderedPropName)).toEqual(expectedValue);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards className to child component', () => {
    const className = 'expected-class-name';
    expectRenderedPropToEqual({ className }, 'className', className);
  });

  describe('multiselect prop', () => {
    const childPropName = 'multiple';

    it('forwards correctly to child', () => {
      expectRenderedPropToEqual({ multiselect: true, selectedUsers: [] }, childPropName, true);
    });

    it('defaults to false when not provided', () => {
      expectRenderedPropToEqual({}, childPropName, false);
    });
  });

  it('passes the list of users as the options for the child component', () => {
    expectRenderedPropToEqual({}, 'options', users);
  });

  describe('correctly determines whether user is selected', () => {
    const getOptionSelectedFunction = (props = {}) => renderAndGetProp(props, 'getOptionSelected');

    describe('when multiselect is false', () => {
      it('and no user is selected', () => {
        const selectedFn = getOptionSelectedFunction({ multiselect: false, selectedUsers: null });
        expect(selectedFn(userOne)).toBeFalsy();
        expect(selectedFn(userTwo)).toBeFalsy();
      });

      it('and a user is selected', () => {
        const selectedFn = getOptionSelectedFunction({ multiselect: false, selectedUsers: userOne });
        // this user is selected
        expect(selectedFn(userOne)).toBeTruthy();
        // this user is not selected
        expect(selectedFn(userTwo)).toBeFalsy();
      });
    });

    describe('when multiselect is true', () => {
      it('and no user is selected', () => {
        const selectedFn = getOptionSelectedFunction({ multiselect: true, selectedUsers: [] });
        expect(selectedFn(userOne)).toBeFalsy();
        expect(selectedFn(userTwo)).toBeFalsy();
      });

      it('and a single user is selected', () => {
        const selectedFn = getOptionSelectedFunction({ multiselect: true, selectedUsers: [userOne] });
        // this user is selected
        expect(selectedFn(userOne)).toBeTruthy();
        // this user is not selected
        expect(selectedFn(userTwo)).toBeFalsy();
      });

      it('and multiple users are selected', () => {
        const selectedFn = getOptionSelectedFunction({ multiselect: true, selectedUsers: [userOne, userTwo] });
        expect(selectedFn(userOne)).toBeTruthy();
        expect(selectedFn(userTwo)).toBeTruthy();
      });
    });
  });

  it('passes the selected users as the value of the child component', () => {
    const selectedUsers = userOne;
    expectRenderedPropToEqual({ selectedUsers }, 'value', selectedUsers);
  });

  it('updates selectedUsers with new value when value changed', () => {
    const eventMock = jest.fn().mockName('event');
    expect(setSelectedUsersMock).not.toHaveBeenCalled();
    const onChangeFn = renderAndGetProp({ setSelectedUsers: setSelectedUsersMock }, 'onChange');

    onChangeFn(eventMock, userOne);

    expect(setSelectedUsersMock).toHaveBeenCalledWith(userOne);
  });

  [false, true].forEach((fetching) => {
    it(`passes the value of fetching from the users object to the loading prop of the child component when fetching is ${fetching}`, () => {
      useUsersSortedByName.mockReturnValueOnce({ value: users, fetching });
      expectRenderedPropToEqual({}, 'loading', fetching);
    });
  });

  it('renders input component to match snapshot forwarding required props', () => {
    const injectedParams = 'expected-params';
    const props = {
      label: 'expected-label',
      placeholder: 'expected-placeholder',
    };
    const renderInput = renderAndGetProp(props, 'renderInput');
    expect(renderInput(injectedParams)).toMatchSnapshot();
  });

  it('renders option component to match snapshot forwarding required props', () => {
    const renderOption = renderAndGetProp({}, 'renderOption');
    expect(renderOption(userOne, { selected: true })).toMatchSnapshot();
  });
});

describe('Input', () => {
  const shallowRender = ({
    params = { fromParams: 'expected-value', InputProps: { fromParamsInputProps: 'expected-value', endAdornment: 'expected-endAdornment' } },
    label = 'expected-label',
    placeholder = 'expected-placeholder',
    loading = false,
  } = {}) => shallow(<Input {...{ params, label, placeholder, loading }} />);

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
  }) => shallow(<Option {...{ option, selected, userSelectedToolTip }} />);

  it('renders to match snapshot when user is not selected', () => {
    expect(shallowRender({ option: userOne, selected: false })).toMatchSnapshot();
  });

  it('renders to match snapshot when user is selected', () => {
    expect(shallowRender({ option: userOne, selected: true })).toMatchSnapshot();
  });
});
