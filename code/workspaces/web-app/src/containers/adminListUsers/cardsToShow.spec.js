import cardsToShow from './cardsToShow';

const projectKey = 'proj-1234';
const noMatchingProjectKey = 'no-matching-key';
const siteName = 'site name';
const notebookName = 'notebook name';
const storageName = 'storage name';

const roles = {
  instanceAdmin: true,
  projectAdmin: [projectKey],
  projectUser: [projectKey],
  projectViewer: [projectKey],
  siteOwner: [{ projectKey, name: siteName }],
  notebookOwner: [{ projectKey, name: notebookName }],
  storageAccess: [{ projectKey, name: storageName }],
};

describe('projectCardsToShow', () => {
  it('gives project key if it is a viewable project', () => {
    expect(cardsToShow.projectCardsToShow(roles, projectKey)).toEqual([projectKey]);
    expect(cardsToShow.projectCardsToShow(roles, noMatchingProjectKey)).toEqual([]);
  });
});

describe('dataStorageCardsToShow', () => {
  it('gives accessible storage names matching project keys', () => {
    expect(cardsToShow.dataStorageCardsToShow(roles, projectKey)).toEqual([storageName]);
    expect(cardsToShow.dataStorageCardsToShow(roles, noMatchingProjectKey)).toEqual([]);
  });
});

describe('notebookCardsToShow', () => {
  it('gives owned notebook names matching project keys', () => {
    expect(cardsToShow.notebookCardsToShow(roles, projectKey)).toEqual([notebookName]);
    expect(cardsToShow.notebookCardsToShow(roles, noMatchingProjectKey)).toEqual([]);
  });
});

describe('siteCardsToShow', () => {
  it('gives owned site names matching project keys', () => {
    expect(cardsToShow.siteCardsToShow(roles, projectKey)).toEqual([siteName]);
    expect(cardsToShow.siteCardsToShow(roles, noMatchingProjectKey)).toEqual([]);
  });
});

