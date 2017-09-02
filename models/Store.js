const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs'); //allows for url friendly names

const storeSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        required: 'Please enter a valid store name.'
    },
    slug: String,
    description:{
        type: String,
        trim: true,
        // required: 'Please enter a helpful description.'
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
            },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates'
            }],
        address: {
            type: String,
            required: 'Kindly provide an address'
            }
    }
});

storeSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        next(); //Skip
        return; //stops function from running further
    }
    this.slug = slug(this.name);
    next();
    //TO DO: Handle uniqueness
});

module.exports = mongoose.model('Store', storeSchema)