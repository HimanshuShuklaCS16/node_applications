const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('connected correctly to the server');
    Dishes.create({
        name : ' uthapizza',
        description : 'test'
    })
    .then((dish) => {
            console.log(dish);
            return Dishes.findByIdAndUpdate(dish._id,{
                $set: {description : 'updated test'}
            },{new : true}).exec();
        })
        .then((dish) => {
            console.log("the updated dish is \n",dish);
            dish.comment.push({
                rating : 3,
                comment : 'its awesome man !!',
                author : 'Himanshu Shukla'
            });
            return dish.save();
        })
        .then((dish) => {
            console.log('dish with comment is',dish);
            return dish.remove({});
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