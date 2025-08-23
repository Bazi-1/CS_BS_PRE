const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat } = require('graphql');

const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: () => ({
        course_id: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        instructor: { type: GraphQLString },
        image: { type: GraphQLString },
        user_id: { type: GraphQLInt },
        price: { type: GraphQLFloat },
    }),
});

module.exports = CourseType;
