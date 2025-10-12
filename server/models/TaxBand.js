const mongoose = require("mongoose");

const TaxBandSchema = new mongoose.Schema({
  taxBand:{
    type:String,
    require:true
  },
  taxPercentage:{
    type:Number,
    require:true
  },
  note:{
    type:String,

  }

},
 { timestamps: true }
)


module.exports = mongoose.model('TaxBand', TaxBandSchema );
