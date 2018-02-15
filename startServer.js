const express = require('express');
const app = express();

// authenticated client should update algolia index
// client side shoudl only hold search keys, but back end should have a key that
// is allowed to CRUD algolia indexes
// private key can be stored here and used when logged-in client has
// created/updated or deleted the posting
// create an api here that will do the update,
// this api should also check for session token or something that verifies client is authenticated

app.use(express.static('www'))
app.listen(process.env.PORT || 3000)

