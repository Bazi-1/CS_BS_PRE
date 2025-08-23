const { GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLFloat } = require('graphql');
const {
    addCourse, getAllCourses, getCourseById, searchCourseByName,
    updateCourse, deleteCourse
} = require('../../services/Course.services');

const CourseType = require('../types/courseType');

const courseQueries = {
    getCourses: {
        type: new GraphQLList(CourseType),
        args: { user_id: { type: new GraphQLNonNull(GraphQLInt) } },
        resolve: (_, args) => getAllCourses(args.user_id)
    },
    getCourse: {
        type: CourseType,
        args: { course_id: { type: new GraphQLNonNull(GraphQLInt) } },
        resolve: (_, args) => getCourseById(args.course_id)
    },
    searchCourses: {
        type: new GraphQLList(CourseType),
        args: { keyword: { type: new GraphQLNonNull(GraphQLString) } },
        resolve: (_, args) => searchCourseByName(args.keyword)
    }
};

const courseMutations = {
    addCourse: {
        type: CourseType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            description: { type: new GraphQLNonNull(GraphQLString) },
            image: { type: GraphQLString },
            price: { type: GraphQLFloat },
            user_id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: (_, args) => addCourse(args)
    },
    updateCourse: {
        type: CourseType,
        args: {
            course_id: { type: new GraphQLNonNull(GraphQLInt) },
            name: { type: GraphQLString },
            description: { type: GraphQLString },
            image: { type: GraphQLString },
            price: { type: GraphQLFloat }
        },
        resolve: (_, args) => updateCourse(args.course_id, args)
    },
    deleteCourse: {
        type: GraphQLString,
        args: { course_id: { type: new GraphQLNonNull(GraphQLInt) } },
        resolve: async (_, args) => {
            const result = await deleteCourse(args.course_id);
            return result ? "Deleted successfully" : "Delete failed";
        }
    }
};

module.exports = {
    courseQueries,
    courseMutations
};
