const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp'); //resizes photo
const uuid = require('uuid') //makes file unique

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else {
            next( { message: 'Invalid filetype' }, false);
        }
    }
}

exports.homePage = (req, res) => {
    // console.log(req.name);
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', {
        title: 'Add Store',
    });
};

//this middleware saves file to memory
exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    //check if there is no new file to resize
    if(!req.file) {
        next(); //skip to next middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    //resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    //once photo is written to filesystem, keep going!
    next();
};

exports.createStore = async (req, res) => {
    
    const store = await (new Store(req.body)).save();

    req.flash('success', `${store.name} created. Want to write a review?`);

    res.redirect(`/store/${store.slug}`);

};

exports.getStores = async (req, res) => {
    // Query database ad display all stores
    const stores = await Store.find();
    // console.log(stores);
    res.render('stores', { title: 'stores', stores: stores });
}

exports.editStore = async (req, res) => {
    // Find the store given the id
    const store = await Store.findOne({ _id: req.params.id });
    // Access control-  confirm if editor is store owner
    //render edit for so owner can update edit
    res.render('editStore', { title: `Edit → ${store.name}`, store: store });
}

exports.updateStore= async (req, res) => {
    //Set location data to point
    req.boby.location.type = 'Point';

    // find and update store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, //returns update instead of old after findOneAndUpdate
        runValidators: true, // runs validators like required
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong> <a href="/stores/${store.slug}">. View → </a> `);
    // redirect user to say it worked
    res.redirect(`/stores/${store._id}/edit`);

}

exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug });
    if(!store) return next();
    res.render('store', { store, title: store.name });
}