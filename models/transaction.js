const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    
    combo: [{
        type: { type: String, required: true },
        bottlesReceived: { type: Number, default: 0 },
        bottlesDelivered: { type: Number, default: 0 }
    }],
    paymentTaken: { type: Number, default: null },
    dueAmount: { type: Number, default: 0 },
    dateTime: { type: String, default:null },
    driverName: { type: String, required: true },
    customerName:{type:String,required:true},
    bottlesCount:{type:String,default:0}
    

});

const Transaction = mongoose.model('Transaction',transactionSchema);
module.exports = Transaction;