const path = require('path');
require('dotenv').load({path: path.join(__dirname, '.env.test')});
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

describe('Beers API:', () => {

    const request = chai.request(app);
    let token = '';
    let user = null;
    let beer = {
        abv: 5,
        brewery: 'some brewery',
        name: 'beer name',
        style: 'beer style'
    };
    let beer2 = {
        abv: 5,
        brewery: 'some other brewery',
        enteredBy: 'some other user',
        name: 'other beer name',
        style: 'other beer style',
        userId: '246',
        _id: '456'
    };

    function getUserFromToken(token) {
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }

    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
        }
        return atob(output);
    }

    function atob(a) {
        return new Buffer(a, 'base64').toString('binary');
    };

    before(done => {
        request
        .post('/api/auth/signup')
        .send({username:'username', password:'password'})
        .then(res => {
            token = res.body.token;
            user = getUserFromToken(token);
            beer.enteredBy = user.username;
            beer.userId = user._id;
            done(); 
        })
        .catch(done);
    });

    before(done => {
        request
        .post('/api/beers')
        .set('authorization', token)
        .send(beer)
        .then(res => {
            beer = res.body;
            done();
        })
        .catch(done);
    });

    it('GETs all', done => {
        request
        .get('/api/beers')
        .set('authorization', token)
        .then(res => {
            assert.deepEqual(res.body, [beer]);
            done();
        })
        .catch(done);
    });

    it('GETs by id', done => {
        request
        .get(`/api/beers/${beer._id}`)
        .set('authorization', token)
        .then(res => {
            const returnedBeer = res.body;
            beer.reviews = [];
            assert.deepEqual(returnedBeer, beer);
            done();
        })
        .catch(done);
    });

});
