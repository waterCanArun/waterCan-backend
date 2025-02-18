const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: String, required: true },
    location: { type: String, required: false },
    address: { type: String, required: true },
    dueAmt:{type:Number,default: 0 ,required:true},
    txnDate :{type:String},
    bottlesLeft:{type:Number,default:0}, 
    // Add reference to the route associated with the customer
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
    }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
