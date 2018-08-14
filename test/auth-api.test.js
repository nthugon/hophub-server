const path = require('path');
require('dotenv').load({path: path.join(__dirname, '.env.test')});
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');


describe('Authorization:', () => {
  
    const request = chai.request(app);
    let firstToken = '';

    it('Requires a password to signup', done => {
        request
        .post('/api/auth/signup')
        .send({username:'new user'})
        .then(res => done('Error: status should not be 200', res))
        .catch(res => {
            assert.equal(res.status, 400);
            assert.equal(res.response.text, '{"error":"Username and password must be given"}');
            done();
        });
    });

    it('Requires an username to signup', done => {
        request
        .post('/api/auth/signup')
        .send({password:'password'})
        .then(res => done('Error: status should not be 200', res))
        .catch(res => {
            assert.equal(res.status, 400);
            assert.equal(res.response.text, '{"error":"Username and password must be given"}');
            done();
        });
    });

    it('Allows a new user to signup', done => {
        request
        .post('/api/auth/signup')
        .send({username:'new user', password:'password'})
        .then(res => {
            assert.ok(res.body.token);
            firstToken = res.body.token;
            done();
        })
        .catch(done);
    });

    it('Errors if you sign up with an already taken username', done => {
        request
        .post('/api/auth/signup')
        .send({username:'new user', password:'other'})
        .then(res => done('Error: status should not be 200', res))
        .catch(res => {
            assert.equal(res.status, 400);
            assert.equal(res.response.text, '{"error":"Username new user already exists"}');
            done();
        });
    });

    it('Prevents user from signing in with invalid username', done => {
        request
        .post('/api/auth/signin')
        .send({username: 'user', password:'password'})
        .catch(res=> {
            assert.equal(res.status, 400);
            assert.equal(res.response.text, '{"error":"Invalid username or password"}');
            done();
        });
    });

    it('Prevents user from signing in with invalid password', done => {
        request
        .post('/api/auth/signin')
        .send({username: 'new user', password:'incorrect'})
        .catch(res=> {
            assert.equal(res.status, 400);
            assert.equal(res.response.text, '{"error":"Invalid username or password"}');
            done();
        });
    });

    it('Allows a user to sign in', done => {
        request
        .post('/api/auth/signin')
        .send({username:'new user', password:'password'})
        .then(res => {
            assert.ok(res.body.token);
        })
        .then(done)
        .catch(done);
    });

});
