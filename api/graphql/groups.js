const { gql } = require("apollo-server-express");
const { containedIn } = require("../domain/filters/filters");

module.exports = {
  typeDefs: [
    gql`
      type AddGroupEvent implements Event {
        id: ID!
        createdAt: Date!
        type: String!
        data: GroupData
      }

      type GroupData {
        groupId: ID!
        name: String!
      }

      input AddGroupEventInput {
        id: ID!
        createdAt: Date!
        type: String!
        data: AddGroupInput
      }

      input AddGroupInput {
        groupId: ID!
        name: String!
      }

      type Group {
        id: ID!
        name: String!
        people(filters: [Filter!]): [Person!]!
      }

      type AddPersonToGroupEvent implements Event {
        id: ID!
        createdAt: Date!
        type: String!
        data: AddPersonToGroupData
      }

      type AddPersonToGroupData {
        personId: ID!
        groupId: ID!
      }

      input AddPersonToGroupEventInput {
        id: ID!
        createdAt: Date!
        type: String!
        data: AddPersonToGroupInput
      }

      input AddPersonToGroupInput {
        personId: ID!
        groupId: ID!
      }

      extend type Query {
        groups(filters: [Filter!]): [Group!]!
      }
    `
  ],
  resolvers: {
    Query: {
      groups: async (object, { filters }, context) =>
        await context.groupsRepository.find({ filters })
    },
    Group: {
      people: async (group, { filters = [] }, context) => {
        const inIds = containedIn(["id"], group.peopleIds);
        return await context.peopleRepository.find({
          filters: [...filters, inIds]
        });
      }
    }
  }
};
