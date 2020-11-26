import stacksSelectors from './stacksSelectors';

const state = {
  stacks: [{ name: 'name' }],
};

describe('stacks', () => {
  it('returns value of stacks from state', () => {
    const stacks = stacksSelectors.stacksArray(state);
    expect(stacks).toEqual(state.stacks);
    expect(stacks).not.toBeUndefined();
  });
});
