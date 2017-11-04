const express = require('express');
const app = express();

const errorHandler = require('./error-handler');
const morgan = require('morgan');
const redirectHttp = require('./redirect-http')();
const cors = require('cors')();
const checkDb = require('./check-connection')();
const ensureAuth = require('./auth/ensure-auth')();
const ensureAdmin = require('./auth/ensure-admin')();

const beers = require('./routes/beers');
const reviews = require('./routes/reviews');
const auth = require('./routes/auth');
const admin = require('./routes/admin');

app.use(morgan('dev'));
// Redirect http to https only in production
if(process.env.NODE_ENV === 'production') {
    app.use(redirectHttp);
}
app.use(cors);
app.use(express.static('./public'));
app.use(checkDb);
app.use('/api/auth', auth);
app.use('/api/beers', ensureAuth, beers);
app.use('/api/reviews', ensureAuth, reviews);
app.use('/api/admin', ensureAuth, ensureAdmin, admin);
app.use(errorHandler);

module.exports = app;
