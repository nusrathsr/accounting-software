const mongoose =require('mongoose')

const customerSchema =new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
   phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    enum: ['Retail Customer', 'seller','Wholesale Customer','Supplier'], // ✅ update if you have other types
    required: true,
  },
  gstNumber: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
    trim: true,
  },
  balance: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

module.exports =mongoose.model('Customer',customerSchema)