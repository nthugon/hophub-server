const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../models/user');

router
    .get('/users', (req, res, next) => {
        User.find({})
            .select('username admin brewer')
            .lean()
            .then(users => res.send(users))
            .catch(next);
    })

    .get('/users/:id', (req, res, next) => {
        User.findById(req.params.id)
            .select('username admin brewer')
            .lean()
            .then(user => res.send(user))
            .catch(next);
    })

    .put('/roles/:id', jsonParser, (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(saved => res.send(saved))
            .catch(next);
    });

module.exports = router;
