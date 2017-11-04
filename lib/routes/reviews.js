const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Review = require('../models/review');
const ensureAdmin = require('../auth/ensure-admin')();

router
    .get('/', (req, res, next) => {
        Review.find({})
            .lean()
            .then(reviews => res.send(reviews))
            .catch(next);
    })

    .get('/user', (req, res, next) => {
        Review.find({userId: req.user._id})
            .select('drinkAgain brewery beerName beerId comments')
            .lean()
            .then(reviews => res.send(reviews))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Review.findById(req.params.id)
            .lean()
            .then(review => res.send(review))
            .catch(next);
    })

    .delete('/:id', ensureAdmin, (req, res, next) => {
        Review.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(next);
    })

    .post('/', bodyParser, (req, res, next) => {
        new Review(req.body).save()
            .then(saved => res.send(saved))
            .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Review.findByIdAndUpdate(req.params.id, req.body)
            .then(saved => res.send(saved))
            .catch(next);
    });

module.exports = router;
