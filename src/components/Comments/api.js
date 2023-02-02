import { getAuth } from "firebase/auth";
import { getDatabase, get, child, ref} from "firebase/database";

// Get the current user information
const dbRef = ref(getDatabase());
const user = getAuth().currentUser;
var name = "No user";
var currUserID;
getAuth().onAuthStateChanged(function(user) {
  if (user) {
  get(child(dbRef, "users"))
    .then((snapShot) => {
      let match = false;
      if (snapShot.exists()) {

        match = snapShot.forEach((curr) => {  //Run through database
          const ID = curr.ref._path.pieces_[1];
          let currUID = snapShot.child(ID).child("uid").val();
          if (currUID === user.uid) { // If current user = a user in the database
            currUserID = snapShot.child(ID).child("eUID").val();  // Pull EUID from database
            name = snapShot.child(ID).child("firstName").val(); // Pull Name from database
          }
        });
      }
    })
  } else {
    // No user is signed in.
  }
});

// Hardcoded comments for demo
export const getComments = async () => {
    return [
      {
        id: "1",
        body: "First comment",
        username: "Tommy",
        userId: "1",
        parentId: null,
        createdAt: "2022-05-01T23:00:33.010+02:00",
      },
      {
        id: "2",
        body: "Second comment",
        username: "Brandon",
        userId: "2",
        parentId: null,
        createdAt: "2022-05-01T23:00:33.010+02:00",
      },
      {
        id: "3",
        body: "First comment first child",
        username: "Brandon",
        userId: "2",
        parentId: "1",
        createdAt: "2022-05-01T23:00:33.010+02:00",
      },
      {
        id: "4",
        body: "Second comment second child",
        username: "Brandon",
        userId: "2",
        parentId: "2",
        createdAt: "2022-05-01T23:00:33.010+02:00",
      },
    ];
  };
  
  // Creates the comment with id, text, parent, user, name, and date created
  export const createComment = async (text, parentId = null) => { 
  const user = getAuth().currentUser;
    return {
      id: Math.random().toString(36).substr(2, 9),
      body: text,
      parentId,
      userId: currUserID,
      username: name,
      createdAt: new Date().toISOString(),
    };
  };
  
  // Updates the comments in the comment section
  export const updateComment = async (text) => {
    return { text };
  };
  
  // Deleting comments
  export const deleteComment = async () => {
    return {};
  };