import http from "./http-common.tsx";

const addNote = (formData) => {
  const { noteTitle, noteText, user_id, sessionId } = formData;

  const query = `
    mutation AddNote($noteTitle: String!, $noteText: String!, $user_id: Int!, $sessionId: Int!) {
      addNote(noteTitle: $noteTitle, noteText: $noteText, user_id: $user_id, sessionId: $sessionId) {
        note_id
        title
        content
      }
    }
  `;

  return http.post('/graphql', {
    query,
    variables: { noteTitle, noteText, user_id, sessionId },
  }).then(response => {
    return response.data;
  }).catch(error => {
    console.error("GraphQL Error:", error);
    throw error;
  });
};


const getNotes = (session_id, user_id) => {
  return http.post('/graphql', {
    query: `
        query GetNotes($session_id: Int!, $user_id: Int!) {
          notes(session_id: $session_id, user_id: $user_id) {
            note_id
            title
            content
            session_title
          }
        }
      `,
    variables: { session_id, user_id },
  });
};

const getUserNotes = (user_id) => {
  return http.post('/graphql', {
    query: `
      query GetUserNotes($user_id: Int!) {
        userNotes(user_id: $user_id) {
          note_id
          title
          content
          user_id
          session_id
          course_title
          section_title
          session_title
          created_at
          updated_at
        }
      }
    `,
    variables: { user_id },
  });
};


const updateNote = (note_id, updatedNote) => {
  const { title, content } = updatedNote;
  return http.post('/graphql', {
    query: `
        mutation UpdateNote($note_id: Int!, $title: String!, $content: String!) {
          updateNote(note_id: $note_id, title: $title, content: $content) {
            note_id
            title
            content
          }
        }
      `,
    variables: { note_id, title, content },
  });
};

const deleteNote = async (note_id, formData) => {
  const { session_id, user_id } = formData;

  return http.post('/graphql', {
    query: `
          mutation DeleteNote($note_id: Int!, $session_id: Int!, $user_id: Int!) {
              deleteNote(note_id: $note_id, session_id: $session_id, user_id: $user_id)
          }
      `,
    variables: { note_id, session_id, user_id },
  });

};



const NoteService = {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
  getUserNotes
}


export default NoteService;
