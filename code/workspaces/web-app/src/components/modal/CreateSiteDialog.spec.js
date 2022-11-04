import React from 'react';
import { render, fireEvent, screen, within } from '../../testUtils/renderTests';
import CreateSiteDialog from './CreateSiteDialog';
import { getSiteInfo } from '../../config/images';

jest.mock('../../hooks/reduxFormHooks');
jest.mock('../../config/images');
jest.mock('../sites/CreateSiteForm', () => props => (<div>CreateSiteForm mock {JSON.stringify(props)}</div>));

describe('Site dialog', () => {
  function shallowRender(props) {
    return render(<CreateSiteDialog {...props} />);
  }

  const onSubmitMock = jest.fn();
  const onCancelMock = jest.fn();

  const generateProps = () => ({
    title: 'Title',
    onSubmit: onSubmitMock,
    onCancel: onCancelMock,
    dataStorageOptions: [
      { value: 'value' },
      { value: 'another value' },
    ],
    fileField: true,
    condaField: true,
  });

  beforeEach(() => {
    getSiteInfo.mockReturnValue({
      nbviewer: {
        displayName: 'NBViewer',
      },
    });
  });

  it('creates correct snapshot', () => {
    // Arrange
    const props = generateProps();

    // Act
    shallowRender(props);

    // Assert
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });
});
