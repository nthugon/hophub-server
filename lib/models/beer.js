const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    style: {
        type: String,
        required: true
    },
    brewery: {
        type: String,
        required: true
    },
    abv: {
        type: Number
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enteredBy: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Beer', schema);
