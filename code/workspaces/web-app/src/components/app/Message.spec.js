import React from 'react';
import { useDispatch } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import Message from './Message';
import messagesActions from '../../actions/messagesActions';

jest.mock('react-markdown', () => props => (<>{`React Markdown: ${props.children}`}</>));

jest.mock('react-redux');
jest.mock('../../actions/messagesActions');
jest.mock('@mui/icons-material/ErrorOutline', () => () => (<div>ErrorOutlineIconMock</div>));

const message = {
  id: 'id1',
  message: 'Test message',
  expiry: '2021-12-25',
  created: '2021-10-31',
};

beforeEach(() => {
  useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
});

describe('Message', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders correct snapshot', () => {
    const wrapper = render(<Message message={message}/>);

    expect(wrapper.container).toMatchSnapshot();
    expect(messagesActions.dismissMessage).toHaveBeenCalledTimes(0);
    expect(wrapper.queryByText('Dismiss')).not.toBeNull();
  });

  it('renders correct snapshot when dismiss is disabled', () => {
    const wrapper = render(<Message message={message} allowDismiss={false}/>);

    expect(wrapper.queryByText('Dismiss')).toBeNull();
  });

  it('dispatches dismiss action when button is clicked', () => {
    const wrapper = render(<Message message={message}/>);
    fireEvent.click(wrapper.getByText('Dismiss'));

    expect(messagesActions.dismissMessage).toHaveBeenCalledTimes(1);
    expect(messagesActions.dismissMessage).toHaveBeenCalledWith('id1');
  });
});
