export const itShouldBehaveLikeAnActionCreator = ({
  actionCreator,
  type,
  parameters = []
} = {}) => {
  const result = actionCreator(...parameters);

  it(`should have the type '${type}'`, () => {
    expect(result.type).toEqual(type);
  });

  it(`should have an id`, () => {
    expect(result.id).toBeTruthy();
  });
};
