const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');
const cors = require('cors');
const express = require('express');
const Storage = require('@google-cloud/storage');
// to store these in a config variable please refer to:
// https://firebase.google.com/docs/functions/config-env
const ALGOLIA_ID = '1IIZWINWBN';//functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = 'ea018daa1482dfb7e0f21d9bd61c4df8';//functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = '03fbd717c23738faacc6b24c36bbbccd';//functions.config().algolia.search_key;
const ALGOLIA_INDEX_NAME = 'prod_POSTING';
const DEFAULT_IMG_BUCKET = 'helping-hand-1b53a.appspot.com';
const PROJECT_ID = 'helping-hand-1b53a';

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
const storage = new Storage({
  projectId: PROJECT_ID
});
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
  storage.bucket(DEFAULT_IMG_BUCKET)
    .getFiles({
      prefix: 'uploads'
    })
    .then(files => {
      console.log(`buckets: ${JSON.stringify(files)}`);
      response.send(files[0]);
      return files[0];
    }).catch(error => {
    console.log(`error occured: ${error}`);
    response.send(`Error: ${error}`);
  });
});

exports.onPostingCreated = functions.firestore.document('postings/{postingId}').onCreate((snap, context) => {
  // Get the note document
  const posting = snap.data();

  console.log(`posting was just created... with id ${context.params.postingId} ${JSON.stringify(posting, undefined, 4)}`);

  // Add an 'objectID' field which Algolia requires
  posting.objectID = context.params.postingId;

  const postingBucket = storage.bucket(`uploads`);
  postingBucket.getFiles().then(files => {
    console.log(`files in the bucket: ${files}`);
    return files;
  }).catch(error => {
    console.log(`error occured: ${error}`);
  });

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

exports.onPostingDeleted = functions.firestore.document('postings/{postingId}').onDelete((snap, context) => {
  // Get the note document
  const posting = snap.data();

  console.log(`posting was just deleted... with id ${context.params.postingId} ${JSON.stringify(posting, undefined, 4)}`);

  // Add an 'objectID' field which Algolia requires
  posting.objectID = context.params.postingId;

  const index = client.initIndex(ALGOLIA_INDEX_NAME);

  console.log(index);
  index.deleteObject(posting.objectID, (error, content) => {
    if (error) {
      console.log(error);
    }
    console.log(`updating index for ${content.objectID}`)
  });

  storage.bucket(DEFAULT_IMG_BUCKET)
    .deleteFiles({
      prefix: `uploads/${posting.objectID}`
    }).then((result) => {
      console.log(`successfully deleted files for ${posting.objectID} with result: ${result}`);
      return result;
    }).catch((error) => {
      console.log(`error deleting files for ${posting.objectID}: ${error}`);
    });
  return posting.objectID;
});

exports.onPostingUpdated = functions.firestore.document('postings/{postingId}').onUpdate((snap, context) => {
  // Get the note document
  const posting = snap.data();

  console.log(`posting was just deleted... with id ${context.params.postingId} ${JSON.stringify(posting, undefined, 4)}`);

  // Add an 'objectID' field which Algolia requires
  posting.objectID = context.params.postingId;

  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  console.log(index);
  return index.saveObject(posting, (error, content) => {
    if (error) {
      console.log(error);
    }
    console.log(`updating index for ${content.objectID}`)
  });
});

//exports.helpingHandFunction = functions.https.onRequest(app);


