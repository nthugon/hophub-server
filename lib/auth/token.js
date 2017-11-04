const jwt = require('jsonwebtoken');
//we use this to send off for and verify tokens
const tokenValidator = process.env.APP_SECRET || 'secretkode';

module.exports = {

    sign(user) {
        return new Promise((resolve, reject) => {
            const payload = {
                username: user.username,
                _id: user._id,
                admin: user.admin,
                brewer: user.brewer
            };
            jwt.sign(payload, tokenValidator, null, (err, token) => {
                if(err) return reject(err);
                resolve(token);
            });
        });
    },

    verify(token){ 
        return new Promise((resolve, reject) => {
            jwt.verify(token, tokenValidator, (err, payload) => {
                if(err) return reject(err);
                resolve(payload);
            });
        });
    }
  
};
