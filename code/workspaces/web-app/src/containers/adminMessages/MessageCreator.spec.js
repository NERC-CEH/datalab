import React from 'react';
import { render, fireEvent, screen, configure } from '@testing-library/react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import MessageCreator from './MessageCreator';
import Message from '../../components/app/Message';

configure({ testIdAttribute: 'id' });

jest.mock('../../components/app/Message', () => jest.fn(() => <>Message</>));

const createMessageFn = jest.fn();
const d = new Date('2021/01/01 12:34:56');

describe('MessageCreator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Date.now = jest.fn(() => d);
  });

  const MessageCreatorWithProvider = () => (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <MessageCreator createMessage={createMessageFn}/>
    </MuiPickersUtilsProvider>
  );

  it('renders correctly', () => {
    const wrapper = render(MessageCreatorWithProvider());

    expect(wrapper.container).toMatchSnapshot();
    expect(Message).toHaveBeenCalledWith({ message: { message: '' }, allowDismiss: false }, {});
  });

  it('shows preview when clicked', () => {
    const wrapper = render(MessageCreatorWithProvider());
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

  it('Updates the Message preview when input box is typed in', () => {
    const wrapper = render(MessageCreatorWithProvider());

    // Expect blank input before 'typing' into message box
    expect(Message).toHaveBeenCalledWith({ message: { message: '' }, allowDismiss: false }, {});

    const textBox = wrapper.getAllByRole('textbox')[0];
    fireEvent.change(textBox, { target: { value: 'test input value' } });

    // Expect actual input after 'typing' into message box
    expect(Message).toHaveBeenCalledWith({ message: { message: 'test input value' }, allowDismiss: false }, {});
  });
});
