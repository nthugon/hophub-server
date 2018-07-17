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

    .get('/user/:id', (req, res, next) => {
        Review.find({userId: req.params.id})
        .select('drinkAgain brewery beerName beerId comments')
        .lean()
        .then(reviews => res.send(reviews))
        .catch(next);

    })

    .get('/currentUser', (req, res, next) => {
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
        let review = req.body;
        if (review.beerName.length > 50) {
            return next({
                code: 400,
                error: 'Beer name must be 50 characters or less'
            });
        }
        if (review.brewery.length > 50) {
            return next({
                code: 400,
                error: 'Brewery name must be 50 characters or less'
            });
        }
        if (review.reviewer.length > 20) {
            return next({
                code: 400,
                error: 'Reviewer name must be 20 characters or less'
            });
        }
        if (review.comments.length > 280) {
            return next({
                code: 400,
                error: 'Comments must be 280 characters or less'
            });
        }
        new Review(review).save()
            .then(saved => res.send(saved))
            .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Review.findByIdAndUpdate(req.params.id, req.body)
            .then(saved => res.send(saved))
            .catch(next);
    });

module.exports = router;
