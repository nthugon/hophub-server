const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Beer = require('../models/beer');
const Review = require('../models/review');
const ensureAuth = require('../auth/ensure-auth')();
const ensureAdmin = require('../auth/ensure-admin')();

router
    .get('/', (req, res, next) => {
        Beer.find({})
        .lean()
        .then(beers => res.send(beers))
        .catch(next);
    })

    .get('/user/:id', ensureAuth, (req, res, next) => {
        Beer.find({userId: req.params.id})
        .lean()
        .then(beers => res.send(beers))
        .catch(next);

    })

    .get('/:id', (req, res, next) => {
        const beerId = req.params.id;

        Promise.all([
            Beer.findById(beerId).lean(),
            Review.find({beerId}).select('drinkAgain reviewer comments').lean()
        ])
        .then(([beer, reviews]) => {
            beer.reviews = reviews;
            res.send(beer);
        })
        .catch(next);
    })

    .delete('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        Beer.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(next);
    })

    .post('/', ensureAuth, bodyParser, (req, res, next) => {
        let beer = req.body;
        if (beer.name.length > 50) {
            return next({
                code: 400,
                error: 'Beer name must be 50 characters or less'
            });
        }
        if (beer.brewery.length > 50) {
            return next({
                code: 400,
                error: 'Brewery name must be 50 characters or less'
            });
        }
        if (beer.style.length > 50) {
            return next({
                code: 400,
                error: 'Beer style must be 30 characters or less'
            });
        }
        if (beer.abv > 20) {
            return next({
                code: 400,
                error: 'Beer abv must be 20 percent or less'
            });
        }
        new Beer(beer).save()
            .then(saved => res.send(saved))
            .catch(next);
    })

    .put('/:id', ensureAuth, ensureAdmin, bodyParser, (req, res, next) => {
        Beer.findByIdAndUpdate(req.params.id, req.body)
            .then(saved => res.send(saved))
            .catch(next);
    });

module.exports = router;
