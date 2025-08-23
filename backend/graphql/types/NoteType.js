const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const NoteType = new GraphQLObjectType({
    name: 'Note',
    fields: () => ({
        note_id: { type: GraphQLInt },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        user_id: { type: GraphQLInt },
        session_id: { type: GraphQLInt },
        course_title: { type: GraphQLString },
        section_title: { type: GraphQLString },
        session_title: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
    }),
});

module.exports = NoteType;
