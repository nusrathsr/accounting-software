const mongoose = require('mongoose')
const { type } = require('os')

//size sub-schema
const sizeSchema = new mongoose.Schema({
  size: { type: String },
  quantity: { type: Number, required: true, default: 0 }
});

// product schema

const productSchema = new mongoose.Schema({
  productId:{ type: String,unique:true,required:true},
  sku: { type: String, unique: true }, // Auto-generated in backend
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  brand: { type: String, required: true },
  sizes:[sizeSchema],
  color: { type: String },
  sellingPrice: { type: Number, required: true },
 purchasePrice: { type: Number, required: true },
  expiryDate: { type: Date },
  supplier: { type: String },
  stockStatus :{type:String},
  taxType:{type:String},
  taxPercentage:{type:Number},
  image: { type: String },
},{timestamps:true});


module.exports = mongoose.model('Product', productSchema)
