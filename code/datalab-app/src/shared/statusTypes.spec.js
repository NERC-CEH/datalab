import { getStatusTypes, getStatusKeys } from './statusTypes';

describe('StatusTypes', () => {
  it('generates expected types', () =>
    expect(getStatusTypes()).toMatchSnapshot());

  it('generates expected keys', () =>
    expect(getStatusKeys()).toMatchSnapshot());
});
