const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { courseQueries, courseMutations } = require('./resolvers/courseResolver');
const { noteQueries, noteMutations } = require('./resolvers/noteResolver');

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        ...courseQueries,
        ...noteQueries
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        ...courseMutations,
        ...noteMutations
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
