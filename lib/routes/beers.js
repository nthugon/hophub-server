const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Beer = require('../models/beer');
const Review = require('../models/review');
const ensureAdmin = require('../auth/ensure-admin')();

router
    .get('/', (req, res, next) => {
        Beer.find({}).lean()
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

    .delete('/:id', ensureAdmin, (req, res, next) => {
        Beer.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(next);
    })

    .post('/', ensureAdmin, bodyParser, (req, res, next) => {
        console.log('user', req.user);
        new Beer(req.body).save()
            .then(saved => res.send(saved))
            .catch(next);
    })

    .put('/:id', ensureAdmin, bodyParser, (req, res, next) => {
        Beer.findByIdAndUpdate(req.params.id, req.body)
            .then(saved => res.send(saved))
            .catch(next);
    });

module.exports = router;
