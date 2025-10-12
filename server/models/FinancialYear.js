const mongoose = require("mongoose");

const FinancialYearSchema = new mongoose.Schema({
  startDate:{
    type:Date,
    require:true,
},
endDate:{
  type:Date,
  require:true
},
name:{
  type:String,
  require:true
}
})

module.exports = mongoose.model('FinancialYear', FinancialYearSchema );
