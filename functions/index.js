const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
// const app = express();

// Automatically allow cross-origin requests
//app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
//app.get('/posting/:id', (req, res) => {});
// app.post('/posting', (req, res) => {
//
// });
//app.put('/posting/:id', (req, res) => {});
//app.delete('/posting/:id', (req, res) => {});

// Expose Express API as a single Cloud Function:
//exports.helpingHandFunction = functions.https.onRequest(app);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// https://firebase.google.com/docs/hosting/functions
// to host locally firebase serve --only hosting,functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  console.log('Hellloooooo!');
 response.send("Hello from Firebase!");
});

exports.onNoteCreated = functions.firestore.document('postings/{postingId}').onCreate((event) => {
  // Get the note document
  const posting = event.data.data();

  console.log(`posting was just created... with id ${event.params.postingId} ${JSON.stringify(posting, undefined, 4)}`);

  // Add an 'objectID' field which Algolia requires
  //posting.objectID = event.params.noteId;

  // Write to the algolia index
  // const index = client.initIndex(ALGOLIA_INDEX_NAME);
  // return index.saveObject(note);
});

//exports.helpingHandFunction = functions.https.onRequest(app);


