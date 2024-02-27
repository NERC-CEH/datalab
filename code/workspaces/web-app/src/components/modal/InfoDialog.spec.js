import { render, screen, fireEvent } from '../../testUtils/renderTests';
import InfoDialog from './InfoDialog';

const shallowRender = props => render(<InfoDialog {...props} />).container;

describe('InfoDialog', () => {
  const onClickMock = jest.fn();

  const generateProps = () => ({
    title: 'Title',
    body: 'Body',
    onClick: onClickMock,
  });

  beforeEach(jest.resetAllMocks);

  it('creates correct snapshot for info dialog', () => {
    const props = generateProps();

    shallowRender(props);

    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });

  it('wires up onClick function properly', () => {
    const props = generateProps();

    shallowRender(props);
    fireEvent.click(screen.getByText('OK'));

    expect(onClickMock).toHaveBeenCalled();
  });
});
