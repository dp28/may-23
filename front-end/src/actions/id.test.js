import { generateId } from './id';

describe(generateId, () => {
  it('should return a string', () => {
    expect(typeof generateId()).toEqual('string');
  });

  it('should be unique', () => {
    expect(generateId()).not.toEqual(generateId());
  });
});
