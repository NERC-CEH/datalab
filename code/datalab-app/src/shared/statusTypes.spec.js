import { getStatusTypes, getStatusKeys, getStatusProps } from './statusTypes';

describe('StatusTypes', () => {
  it('generates expected types', () =>
    expect(getStatusTypes()).toMatchSnapshot());

  it('generates expected keys', () =>
    expect(getStatusKeys()).toMatchSnapshot());

  it('getStatusProps extracts status', () =>
    expect(getStatusProps('ready')).toMatchSnapshot());
});
