import React from 'react';
import { render, fireEvent, screen, configure } from '@testing-library/react';
import AdminMessage from './AdminMessage';
import Message from '../../components/app/Message';

configure({ testIdAttribute: 'id' });

jest.mock('../../components/app/Message', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<>Message</>),
}));

const message = {
  message: 'some message',
  id: '1234',
  expiry: '2021/12/25',
  created: '2021/10/31',
};

describe('AdminMessage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders correctly', () => {
    const wrapper = render(<AdminMessage message={message}/>);

    expect(wrapper.container).toMatchSnapshot();
    expect(Message).toHaveBeenCalledTimes(1);
    expect(Message).toHaveBeenCalledWith({ message, allowDismiss: false }, {});
  });

  it('shows preview when clicked', () => {
    const wrapper = render(<AdminMessage message={message}/>);
    const previewedMessage = screen.getByTestId('messagePreview');
    const buttons = screen.getAllByRole('button');

    expect(previewedMessage.hidden).toBeTruthy();
    expect(buttons[0].className).not.toEqual(expect.stringContaining('contained'));
    expect(buttons[0].className).toEqual(expect.stringContaining('outlined'));

    // "Click" the preview button
    fireEvent.click(wrapper.getByText('Preview'));

    expect(previewedMessage.hidden).toBeFalsy();
    expect(buttons[0].className).toEqual(expect.stringContaining('contained'));
    expect(buttons[0].className).not.toEqual(expect.stringContaining('outlined'));
  });
});
