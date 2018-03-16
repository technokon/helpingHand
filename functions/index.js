const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');
const cors = require('cors');
const express = require('express');

// to store these in a config variable please refer to:
// https://firebase.google.com/docs/functions/config-env
const ALGOLIA_ID = 'XXZIWGI3I4';//functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = 'fc47b09d7999f58771e5ba94aec2cf03';//functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = '863bc2fa9bf73190cfaa76f3533bf5dd';//functions.config().algolia.search_key;
const ALGOLIA_INDEX_NAME = 'prod_POSTING';

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
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
  posting.objectID = event.params.postingId;

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  console.log(index);
  return index.addObject(posting, (error, content) => {
    if (error) {
      console.log(error);
    }
    console.log(`indexing ${content.objectID}`)
  });
});

//exports.helpingHandFunction = functions.https.onRequest(app);


