const {
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const NoteType = require('../types/NoteType');
const {
    addNote,
    getNotes,
    updateNote,
    deleteNoteService,
    getUserNotes
} = require('../../services/Note.services');

// Queries
const noteQueries = {
    notes: {
        type: new GraphQLList(NoteType),
        args: {
            session_id: { type: new GraphQLNonNull(GraphQLInt) },
            user_id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve(parent, args) {
            return getNotes(args.session_id, args.user_id);
        },
    },
    userNotes: {
        type: new GraphQLList(NoteType),
        args: { user_id: { type: new GraphQLNonNull(GraphQLInt) } },
        async resolve(_, args) {
            const result = await getUserNotes(args.user_id);
            return result.notes;
        },
    },
};

// Mutations
const noteMutations = {
    addNote: {
        type: NoteType,
        args: {
            noteTitle: { type: new GraphQLNonNull(GraphQLString) },
            noteText: { type: new GraphQLNonNull(GraphQLString) },
            user_id: { type: new GraphQLNonNull(GraphQLInt) },
            sessionId: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve(_, args) {
            return addNote(args.noteTitle, args.noteText, args.user_id, args.sessionId)
                .then(res => res.rows?.[0] || res[0]);
        },
    },

    updateNote: {
        type: NoteType,
        args: {
            note_id: { type: new GraphQLNonNull(GraphQLInt) },
            title: { type: new GraphQLNonNull(GraphQLString) },
            content: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(_, args) {
            return updateNote(args.note_id, args.title, args.content);
        },
    },


    deleteNote: {
        type: GraphQLString,
        args: {
            note_id: { type: new GraphQLNonNull(GraphQLInt) },
            session_id: { type: new GraphQLNonNull(GraphQLInt) },
            user_id: { type: new GraphQLNonNull(GraphQLInt) },
        },
        async resolve(_, args) {
            const result = await deleteNoteService(args.note_id, args.session_id, args.user_id);
            if (result === 200) return "Note deleted successfully";
            throw new Error("Note not found");
        },
    },

}
module.exports = {
    noteQueries,
    noteMutations
};
