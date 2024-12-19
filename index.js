const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}).catch((error) => {
  console.error('Database connection error:', error.message);
});