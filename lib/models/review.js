const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const schema = new Schema({
    drinkAgain: {
        type: String,
        enum: ['no', 'occasionally', 'yes'],
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewer: {
        type: String,
        required: true
    },
    beerId: {
        type: Schema.Types.ObjectId,
        ref: 'Beer',
        required: true
    },
    brewery: {
        type: String,
        required: true
    },
    beerName: {
        type: String,
        required: true
    },
    comments: {
        type: String
    }
});

module.exports = mongoose.model('Review', schema);
