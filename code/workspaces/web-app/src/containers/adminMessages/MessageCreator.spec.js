import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { render, fireEvent, screen, configure } from '../../testUtils/renderTests';
import MessageCreator from './MessageCreator';

jest.mock('../../components/app/Message', () => props => <div>{`Message: ${props.message.message}, AllowDismiss: ${props.allowDismiss.toString()}`}</div>);

const createMessageFn = jest.fn();
const d = new Date('2021/01/01 12:34:56');

describe('MessageCreator', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'id' });
    Date.now = jest.fn(() => d);
  });

  const MessageCreatorWithProvider = () => (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <MessageCreator createMessage={createMessageFn}/>
    </MuiPickersUtilsProvider>
  );

  it('renders correctly', () => {
    const wrapper = render(<MessageCreatorWithProvider />);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('shows preview when clicked', () => {
    const wrapper = render(<MessageCreatorWithProvider />);
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
    const wrapper = render(<MessageCreatorWithProvider />);

    // Expect blank input before 'typing' into message box
    expect(wrapper.queryByText('Message: , AllowDismiss: false')).not.toBeNull();

    const textBox = wrapper.getAllByRole('textbox')[0];
    fireEvent.change(textBox, { target: { value: 'test input value' } });

    // Expect actual input after 'typing' into message box
    expect(wrapper.queryByText('Message: test input value, AllowDismiss: false')).not.toBeNull();
  });
});
