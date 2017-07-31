import zeppelinService from './zeppelinService';

describe('openNotebook', () => {
  it('should set a cookie and open a new tab', () => {
    const url = 'http://datalab-zeppelin.datalabs.nerc.ac.uk';
    const cookie = 'cookie';

    global.open = jest.fn();

    zeppelinService.openNotebook(url, cookie);
    expect(global.open).toBeCalledWith(url);
  });
});
