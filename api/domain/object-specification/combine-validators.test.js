const { combineValidators } = require("./combine-validators");
const { COMBINED } = require("../errors/codes");

describe(combineValidators, () => {
  describe("with synchronous functions", () => {
    describe("if no validators are passed", () => {
      it("should return a function that returns null", () => {
        expect(combineValidators([])(1)).toEqual(null);
      });
    });

    describe("if a single validator is passed", () => {
      describe("that returns a result", () => {
        it("should return the result of the single validator", () => {
          const validate = combineValidators([x => x + 1]);
          expect(validate(3)).toEqual(4);
        });

        describe("and the result is falsy", () => {
          it("should return the result of the single validator", () => {
            const validate = combineValidators([() => false]);
            expect(validate(3)).toEqual(false);
          });
        });

        describe("and the result is null", () => {
          it("should return null", () => {
            const validate = combineValidators([() => null]);
            expect(validate(3)).toEqual(null);
          });
        });

        describe("and the result is undefined", () => {
          it("should return null", () => {
            const validate = combineValidators([() => undefined]);
            expect(validate(3)).toEqual(null);
          });
        });
      });

      describe("that does not return a result", () => {
        it("should return null", () => {
          const validate = combineValidators([() => {}]);
          expect(validate(3)).toEqual(null);
        });
      });
    });

    describe("if multiple validators are passed", () => {
      it("should pass the input and context to all of them", () => {
        const validators = [jest.fn(), jest.fn()];
        const validate = combineValidators(validators);
        const context = { a: "b" };
        validate(3, context);
        validators.forEach(validator => {
          expect(validator.mock.calls).toEqual([[3, context]]);
        });
      });

      describe("that all return results", () => {
        it(`should return a ${COMBINED} error`, () => {
          const validate = combineValidators([x => x + 1, x => x - 1]);
          expect(validate(3).code).toEqual(COMBINED);
        });

        it("should return all the results in order as the error's errors property", () => {
          const validate = combineValidators([x => x + 1, x => x - 1]);
          expect(validate(3).errors).toEqual([4, 2]);
        });

        describe("and the 'sequentially' flag is passed", () => {
          it("should only pass the input and context to the first validator", () => {
            const validators = [jest.fn(x => x + 1), jest.fn(x => x + 2)];
            const validate = combineValidators(validators, {
              sequentially: true
            });
            const context = { a: "b" };
            validate(3, context);
            expect(validators[0].mock.calls).toEqual([[3, context]]);
            expect(validators[1].mock.calls).toEqual([]);
          });

          it("should only return the first result", () => {
            const validators = [x => x + 1, x => x - 1];
            const validate = combineValidators(validators, {
              sequentially: true
            });
            expect(validate(3)).toEqual(4);
          });
        });
      });

      describe("but only one returns a result", () => {
        it("should return only that result", () => {
          const validate = combineValidators([() => {}, x => x - 1]);
          expect(validate(3)).toEqual(2);
        });
      });
    });
  });

  describe("with asynchronous functions", () => {
    it("should return a promise", () => {
      const result = combineValidators([async x => (await x) + 1])(1);
      expect(typeof result.then).toEqual("function");
    });

    describe("and the 'sequentially' flag is passed", () => {
      it("should return a promise", () => {
        const result = combineValidators([async x => (await x) + 1], {
          sequentially: true
        })(1);
        expect(typeof result.then).toEqual("function");
      });
    });

    describe("if a single validator is passed", () => {
      describe("that resollves to a result", () => {
        it("should resolve to the result of the single validator", async () => {
          const validate = combineValidators([async x => x + 1]);
          expect(await validate(3)).toEqual(4);
        });

        describe("and the resolved result is falsy", () => {
          it("should resolve to the result of the single validator", async () => {
            const validate = combineValidators([async () => false]);
            expect(await validate(3)).toEqual(false);
          });
        });

        describe("and the resolved result is null", () => {
          it("should resolve to null", async () => {
            const validate = combineValidators([async () => null]);
            expect(await validate(3)).toEqual(null);
          });
        });

        describe("and the resolved result is undefined", () => {
          it("should resolve to null", async () => {
            const validate = combineValidators([async () => undefined]);
            expect(await validate(3)).toEqual(null);
          });
        });
      });
    });

    describe("if multiple validators are passed", () => {
      it("should pass the input and context to all of them", async () => {
        const validators = [jest.fn(async x => 1), jest.fn(async x => 2)];
        const validate = combineValidators(validators);
        const context = { a: "b" };
        await validate(3, context);
        validators.forEach(validator => {
          expect(validator.mock.calls).toEqual([[3, context]]);
        });
      });

      describe("that all resolve to results", () => {
        it(`should resolve to a ${COMBINED} error`, async () => {
          const validate = combineValidators([
            async x => x + 1,
            async x => x - 1
          ]);
          const error = await validate(3);
          expect(error.code).toEqual(COMBINED);
        });

        it("should return all the results in order as the error's errors property", () => {
          const validate = combineValidators([x => x + 1, x => x - 1]);
          expect(validate(3).errors).toEqual([4, 2]);
        });

        describe("and the 'sequentially' flag is passed", () => {
          it("should only pass the input and context to the first validator", async () => {
            const validators = [
              jest.fn(async x => x + 1),
              jest.fn(async x => x + 2)
            ];
            const validate = combineValidators(validators, {
              sequentially: true
            });
            const context = { a: "b" };
            await validate(3, context);
            expect(validators[0].mock.calls).toEqual([[3, context]]);
            expect(validators[1].mock.calls).toEqual([]);
          });

          it("should only return the first result", async () => {
            const validators = [async x => x + 1, async x => x - 1];
            const validate = combineValidators(validators, {
              sequentially: true
            });
            expect(await validate(3)).toEqual(4);
          });
        });
      });

      describe("but only one resolves to a result", () => {
        it("should resolve to only that result", async () => {
          const validate = combineValidators([
            async () => {},
            async x => x - 1
          ]);
          expect(await validate(3)).toEqual(2);
        });
      });
    });
  });
});
