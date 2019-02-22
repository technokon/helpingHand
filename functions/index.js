const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
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
exports.onPostingCreated = functions.firestore.document('postings/{postingId}').onCreate((snap, context) => {
  // Get the note document
  const posting = snap.data();

  console.log(`posting was just created... with id ${context.params.postingId} ${JSON.stringify(posting, undefined, 4)}`);

  // Add an 'objectID' field which Algolia requires
  posting.objectID = context.params.postingId;

  // Write to the algolia index
  return addPostingToAlgolia(posting)
    .then(content =>
      console.log(`indexing ${content.objectID}`))
    .catch(error => console.log(error, `Error adding posting to algolia: ${posting}`))
});

function logFilesInTheBucket(bucketName) {
  const postingBucket = storage.bucket(bucketName);
  postingBucket.getFiles().then(files => {
    console.log(`files in the bucket: ${files}`);
    return files;
  }).catch(error => {
    console.log(`error occured: ${error}`);
  });
}

/**
 * Add posting to algolia index.
 * @param posting
 */
function addPostingToAlgolia(posting) {
  if (posting) {
    return new Promise((resolve, reject) => {
      const index = client.initIndex(ALGOLIA_INDEX_NAME);
      // Write to the algolia index
      index.addObject(posting, (error, content) => {
        if (error) {
          reject(error);
        } else {
          resolve(content);
        }
      });
    })
  } else {
    return Promise.reject(new Error(`No posting is defined: ${posting}`));
  }
}

/**
 * Deletes algolia indexes, and returns a promise.
 * @param objectsIds
 */
function deleteAlgoliaIndexes(objectsIds) {
  if (objectsIds && objectsIds.length) {
    const promise = new Promise((resolve, reject) => {
      const index = client.initIndex(ALGOLIA_INDEX_NAME);
      index.deleteObjects(objectsIds, (error, content) => {
        if (error) {
          reject(error);
        } else {
          resolve(content);
        }
      });
    });
    return promise;
  } else {
    return Promise.reject(new Error(`No objects ids: ${objectsIds}`));
  }
}

function deleteStorageImages(imageIds) {
  if (imageIds && imageIds.length) {
    return Promise.all(
      imageIds.map(id => storage.bucket(DEFAULT_IMG_BUCKET)
      .deleteFiles({
        prefix: `uploads/${id}`
      })));
  } else {
    return Promise.reject(new Error(`No image ids provided: ${imageIds}`));
  }
}

function deletePostingsForUserId(userId) {
  if (userId) {
    const collection = db.collection('postings');
    return collection
      .where('owner', '==', userId)
      .get()
      .then((snapshot) => {
        let objects = [];
        snapshot.forEach((posting) => {
          objects.push(posting.data());
        });
        return objects;
      })
      .then(userPostings =>
        userPostings.map((posting) =>
          collection.doc(posting.id).delete()))
      .then(promises =>
        Promise.all(promises));
  } else {
    return Promise.reject(new Error(`No user id passes in: ${userId}`));
  }
}

function getUserPostings(userId) {
  if (userId) {
    return collection
      .where('owner', '==', userId)
      .get()
      .then((snapshot) => {
        let objects = [];
        snapshot.forEach((posting) => {
          objects.push(posting.data());
        });
        return objects;
      });
  } else {
    return Promise.reject(new Error(`No user id specified: ${userId}`));
  }
}

exports.onPostingDeleted = functions.firestore.document('postings/{postingId}').onDelete((snap, context) => {
  // Get the note document
  const posting = snap.data();
  // Add an 'objectID' field which Algolia requires
  const objectID = context.params.postingId;

  return deleteAlgoliaIndexes([objectID])
    .then(() =>
      deleteStorageImages([objectID]))
    .then(() =>
      console.log(`posting was just deleted... with id 
        ${context.params.postingId} posting: ${JSON.stringify(posting, undefined, 4)}`))
    .catch(error =>
      console.log(`Error deleting files: ${error}`));
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

exports.onUserDelete = functions.auth.user().onDelete((user) => {
  const userId = user.uid;

  return getUserPostings(userId)
    .then(postings => {
      const postingIds = postings.map(posting => posting.id);
      return Promise.all([
        deleteAlgoliaIndexes(postingIds),
        deleteStorageImages(postingIds),
        deletePostingsForUserId(userId),
      ]);
    })
    .then(() =>
      console.log(`Deleting user ${userId}, ${user.email}`))
    .catch(error =>
      console.log(`Error deleting postings for ${userId}, ${user.email}: ${error}`));
});

exports.testPostingSearch = functions.https.onRequest((request, response) => {
  const collection = db.collection('postings');
  collection.get().then((snapshot) => {
    let objects = [];
    snapshot.forEach((posting) => {
      const data = posting.data();
      console.log(JSON.stringify(data, null, 2));
      objects.push(data);
    });
    response.send(JSON.stringify(objects, null, 2));
    return true;
  }).catch((error) => {
    console.log(`error... ${error}`);
    throw error;
  });
  return true;
});

exports.postingsMonitor = functions.pubsub.topic('postings-monitor')
  .onPublish((message) => {
    console.log(message.data);
    db.collection('postings').get().then((snapshot) => {
      console.log(`So far, ${snapshot.size} posting on site`);
      return true;
    }).catch((error) => {
      console.log(`error... ${error}`);
      throw error;
    });
    return true;
  });

//exports.helpingHandFunction = functions.https.onRequest(app);


