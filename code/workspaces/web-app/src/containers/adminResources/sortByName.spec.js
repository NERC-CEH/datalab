import sortByName from './sortByName';

describe('sortByName', () => {
  it('sorts by name', () => {
    const thingA = { name: 'a', thing: 'thing a' };
    const thingB = { name: 'b', thing: 'thing b' };
    expect(sortByName([thingA, thingB])).toEqual([thingA, thingB]);
    expect(sortByName([thingB, thingA])).toEqual([thingA, thingB]);
  });
});
