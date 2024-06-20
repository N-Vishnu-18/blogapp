// Create Express app
const exp = require('express');
const app = exp();
require('dotenv').config(); // Load environment variables
const mongoClient = require('mongodb').MongoClient;

const userAPP = require('./APIs/user-api');
const adminAPP = require('./APIs/author-api');
const authorAPP = require('./APIs/author-api');

const path = require('path');

// Deploy React build in this server
app.use(exp.static(path.join(__dirname, '../client/build')));

// To parse the body of the request object
app.use(exp.json());

// Connect to the database
mongoClient.connect(process.env.DB_URL)
  .then(client => {
    // Get database object
    const blogdb = client.db('blogdb');
    
    // Get collection objects
    const userscollection = blogdb.collection('userscollection');
    const articlescollection = blogdb.collection('articlescollection');
    const authorscollection = blogdb.collection('authorscollection');
    
    // Share collection objects with Express app
    app.set('userscollection', userscollection);
    app.set('articlescollection', articlescollection);
    app.set('authorscollection', authorscollection);

    // Confirm database connection
    console.log("DB connection successful");
  })
  .catch(err => console.log("Error in DB connection", err));

// If path starts with user-API, send request to userAPP
app.use('/user-api', userAPP);

// If path starts with admin-API, send request to adminAPP
app.use('/admin-api', adminAPP);

// If path starts with author-API, send request to authorAPP
app.use('/author-api', authorAPP);


// Handle page refreshes in React by sending the index.html file
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Express error handler
app.use((err, req, res, next) => {
  res.status(500).send({ message: "error", payload: err.message });
});

// Assign port number and start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Web server on port ${port}`));
