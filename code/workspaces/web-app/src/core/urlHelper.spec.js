import getUrlNameStartEndText from './urlHelper';

const projectKey = 'testproj';

describe('getUrlNameStartEndText', () => {
  it('returns correct values when on localhost', () => {
    const windowLocation = {
      protocol: 'https:',
      hostname: 'localhost',
    };
    const { startText, endText } = getUrlNameStartEndText(projectKey, windowLocation);

    expect(startText).toEqual('https://testproj-');
    expect(endText).toEqual('.datalabs.localhost');
  });

  it('returns correct values when on testlab.datalabs.localhost', () => {
    const windowLocation = {
      protocol: 'https:',
      hostname: 'testlab.datalabs.localhost',
    };
    const { startText, endText } = getUrlNameStartEndText(projectKey, windowLocation);

    expect(startText).toEqual('https://testproj-');
    expect(endText).toEqual('.datalabs.localhost');
  });

  it('returns correct values when on datalab.datalabs.nerc.ac.uk', () => {
    const windowLocation = {
      protocol: 'https:',
      hostname: 'datalab.datalabs.nerc.ac.uk',
    };
    const { startText, endText } = getUrlNameStartEndText(projectKey, windowLocation);

    expect(startText).toEqual('https://testproj-');
    expect(endText).toEqual('.datalabs.nerc.ac.uk');
  });
});
