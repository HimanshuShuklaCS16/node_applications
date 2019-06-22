const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;

const schema = mongoose.Schema;
const commentSchema = new schema({
    rating:{
        type : Number,
        min : 1,
        max : 5,
        required : true
    },
    comment:{
        type : String,
        required : true
    },
    author:{
        type : String,
        required : true
    }
},
{
    timestamps : true
});

const dishSchema = new schema({
   name:{
       type : String,
       required : true,
       unique :true
   },
   description:{
       type : String,
       required : true
   },
   image:{
       type: String,
       required : true
   },
   category:{
       type : String,
       required :true
   },
   label:{
    type : String,
    default : ''
},
price: {
type:currency,
required : true,
min:0
},
featured: {
    type:Boolean,
    default : false
    },
   comment: [commentSchema]
},
   {
       timestamps : true
   }
);

var dishes = mongoose.model('Dish',dishSchema);
module.exports = dishes;