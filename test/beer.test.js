const Beer = require('../lib/models/beer');
const assert = require('chai').assert;
const mongoose = require('mongoose');

describe('Beer model:', () => {

    it('validates with required properties', done => {
        let beer = new Beer({
            brewery: 'some brewery',
            enteredBy: 'username',
            name: 'beer name',
            style: 'beer style',
            userId: mongoose.Types.ObjectId()
        });

        beer.validate(err => {
            if (!err) done();
            else done(err);
        });
    });

    it('name is required', done => {
        let beer = new Beer({
            brewery: 'some brewery',
            enteredBy: 'username',
            style: 'beer style',
            userId: mongoose.Types.ObjectId()
        });

        beer.validate(err => {
            assert.isOk(err, 'name should have been required');
            done();
        });
    });

    it('style is required', done => {
        let beer = new Beer({
            brewery: 'some brewery',
            enteredBy: 'username',
            name: 'beer name',
            userId: mongoose.Types.ObjectId()
        });

        beer.validate(err => {
            assert.isOk(err, 'style should have been required');
            done();
        });
    });

    it('brewery is required', done => {
        let beer = new Beer({
            enteredBy: 'username',
            name: 'beer name',
            style: 'beer style',
            userId: mongoose.Types.ObjectId()
        });

        beer.validate(err => {
            assert.isOk(err, 'brewery should have been required');
            done();
        });
    });

    it('userId is required', done => {
        let beer = new Beer({
            brewery: 'some brewery',
            enteredBy: 'username',
            name: 'beer name',
            style: 'beer style'
        });

        beer.validate(err => {
            assert.isOk(err, 'userId should have been required');
            done();
        });
    });

    it('enteredBy is required', done => {
        let beer = new Beer({
            brewery: 'some brewery',
            name: 'beer name',
            style: 'beer style',
            userId: mongoose.Types.ObjectId()
        });

        beer.validate(err => {
            assert.isOk(err, 'enteredBy should have been required');
            done();
        });
    });

    it('abv must be a number', done => {
        let beer = new Beer({
            abv: 'high',
            brewery: 'some brewery',
            enteredBy: 'username',
            name: 'beer name',
            style: 'beer style',
            userId: mongoose.Types.ObjectId()
        });

        beer.validate(err => {
            assert.isOk(err, 'expected error on abv data type');
            done();
        });
    });

});
