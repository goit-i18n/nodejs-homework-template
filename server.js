const app = require('./app');
const db = require('./config/db');
require('dotenv').config();
const {mkdirp} = require('mkdirp');


const UPLOAD_DIR = process.env.UPLOAD_DIR;


const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, async () => {
    await mkdirp(UPLOAD_DIR);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server not run. Error: ${err.message}`);
});
