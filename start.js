// !!!!!!!! MOVED TO APP.JS FILE SO WE COULD US db VARIABLE !!!!!!
const mongoose = require('mongoose');

// IMPORT SENSITIVE DATA FROM VARIABLES FILE
require('dotenv').config({ path: 'variables.env' });

// !!!!!!!! MOVED TO APP.JS FILE SO WE COULD US db VARIABLE !!!!!!
// CONNECT TO MONGO DB
// Allows Mongoose to use ES6 async await promises
mongoose.connect(process.env.DATABASE);
var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', (err) => {
  console.error(`ERROR → ${err.message}`);
});

// IMPORT MODELS
require('./models/contactModel');
require('./models/vacationModel');
require('./models/resourceModel');
// require('./models/userModel');
require('./models/userPassportModel');
require('./models/siteModel');
require('./models/reviewModel');
require('./models/quoteModel');
require('./models/honeyBadgerModel');
require('./models/statsModel');

// START APP !!!
const app = require('./app');
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express is running on PORT ${server.address().port}`);
});



// TEMPORARY CODE TO TEST SENDING EMAIL TO MAILTRAP.IO
// DELETE LATER
// require('./handlers/mail');