import notificationsConfig from './notifications';

describe('notificationsConfig', () => {
  it('has expected content', () => {
    expect(notificationsConfig()).toMatchSnapshot();
  });
});
