const { gql } = require("apollo-server-express");
const { reducer } = require("../domain/groups/groups-reducer");

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
      }

      extend type Query {
        groups(filters: [Filter!]): [Group!]!
      }
    `
  ],
  resolvers: {
    Query: {
      groups: async (object, { filters }, context) => {
        const groupsRepository = context.buildEventBackedRepository(reducer);
        return await groupsRepository.find({ filters });
      }
    }
  }
};
