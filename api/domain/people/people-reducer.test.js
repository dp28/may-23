const { reducer } = require("./people-reducer");
const { onInit, reduceFromInitialState } = require("../test-utils");
const { addPerson } = require("../events/people");

describe("people reducer", () => {
  onInit(reducer, result => {
    it("should return an empty object", () => {
      expect(result).toEqual({});
    });
  });

  describe("when a person is added", () => {
    const event = addPerson({
      firstName: "joe",
      lastName: "blogs",
      personId: "fakeId"
    });

    const people = reduceFromInitialState(reducer, event);

    it("should return a single person", () => {
      expect(Object.keys(people).length).toEqual(1);
    });

    it("should map to the person by their id", () => {
      const id = Object.keys(people)[0];
      expect(people[id].id).toEqual(id);
    });

    describe("the returned person", () => {
      const person = people.fakeId;

      it("should have the passed in id", () => {
        expect(person.id).toEqual(event.data.personId);
      });

      it("should have a name object", () => {
        expect(person.name).toBeTruthy();
      });

      describe("the name", () => {
        const name = person.name;

        it("should have the capitalised passed-in firstName as its 'first' property", () => {
          expect(name.first).toEqual("Joe");
        });

        it("should have the capitalised passed-in lastName as its 'last' property", () => {
          expect(name.last).toEqual("Blogs");
        });

        it("should have a null 'middle' property", () => {
          expect(name.middle).toEqual(null);
        });

        it("should have a 'full' property that combines the first and last name", () => {
          expect(name.full).toEqual(`Joe Blogs`);
        });

        it("should have initials that are the capitalized first letter of the first and last name", () => {
          expect(name.initials).toEqual("JB");
        });

        describe("if the input had a middle name", () => {
          const eventWithMiddleName = addPerson({
            firstName: "joe",
            middleName: "something",
            lastName: "blogs",
            personId: "fakeId"
          });

          const nameWithMiddle = reduceFromInitialState(
            reducer,
            eventWithMiddleName
          ).fakeId.name;

          it("should have the capitalised passed in middleName as its 'middle' property", () => {
            expect(nameWithMiddle.middle).toEqual("Something");
          });

          it("should have a 'full' property that combines all three name parts in order", () => {
            expect(nameWithMiddle.full).toEqual(`Joe Something Blogs`);
          });

          it("should have initials that are the capitalized first letter of all three name parts in order", () => {
            expect(nameWithMiddle.initials).toEqual("JSB");
          });
        });
      });
    });

    describe("if another person is added", () => {
      describe("with the same name but a different id", () => {
        const duplicateNameEvent = addPerson({
          firstName: event.data.firstName,
          lastName: event.data.lastName,
          personId: "fakeId2"
        });
        const morePeople = reducer(people, duplicateNameEvent);

        it("should return two people", () => {
          expect(Object.keys(morePeople).length).toEqual(2);
        });
      });

      describe("with the same id but a different name", () => {
        const duplicateNameEvent = addPerson({
          firstName: "joey",
          lastName: "mcblogs",
          personId: event.data.personId
        });
        const noMorePeople = reducer(people, duplicateNameEvent);

        it("should return just the first person", () => {
          expect(noMorePeople).toEqual(people);
        });
      });
    });
  });
});
