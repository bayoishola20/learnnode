const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    // console.log(req.name);
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', {
        title: 'Add Store',
    });
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