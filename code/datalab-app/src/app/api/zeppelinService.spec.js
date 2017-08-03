import zeppelinService from './zeppelinService';

describe('openNotebook', () => {
  it('should set a cookie', () => {
    const url = 'http://datalab-zeppelin.datalabs.nerc.ac.uk';
    const cookie = 'cookie';

    zeppelinService.setCookie(url, cookie);
  });
});
