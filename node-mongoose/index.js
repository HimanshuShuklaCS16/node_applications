const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('connected correctly to the server');
    var newDish = Dishes({
        name : 'uthapizza',
        description : 'test'
    })
    newDish.save()
        .then((dish) => {
            console.log(dish);
            return Dishes.find({});
        })
        .then((dishes) => {
            console.log("all the dishes \n",dishes);
            return Dishes.remove({});
        })
        .then(() => {
            return mongoose.connection.close();
        })
        .catch((err) => {
            console.log(err);
        });
})
.catch((err) => {
    console.log(err);
});