const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat } = require('graphql');

const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    course_id: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    instructor: { type: GraphQLString },
    image: { type: GraphQLString },
    num_lectures: { type: GraphQLInt },
    total_duration_seconds: { type: GraphQLInt },
    students: { type: GraphQLInt },
  }),
});


module.exports = CourseType;
