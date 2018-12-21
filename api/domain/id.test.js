const { generateId } = require("./id");

describe(generateId, () => {
  it("should be a string", () => {
    expect(typeof generateId()).toEqual("string");
  });

  it("should be unique", () => {
    expect(generateId()).not.toEqual(generateId());
  });
});
