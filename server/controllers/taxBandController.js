const TaxBand =require("../models/TaxBand")


// addTaxBnd

exports.addTaxBand =async(req,res)=>{
  try {
    const {taxBand,taxPercentage,note}=req.body
    const existing =await TaxBand.findOne({taxBand})
    if(existing){
      return res.status(400).json({message:"tax band already exists"})
    }
    const newTaxBand =new TaxBand ({taxBand,taxPercentage,note})
    await newTaxBand.save();
    res.status(201).json(newTaxBand)
  } catch (error) {
    res.status(500).json({message:"Error adding taxBand",error:error.message})

  }
}

// getALLtaxBand
exports. getAllTaxBands = async (req,res)=>{
  try {
    const taxBands = await TaxBand.find().sort({createdAt: -1 })
    res.json(taxBands)
  } catch (error) {
        res.status(500).json({ message: "Error fetching taxBands", error: error.message });

  }
}


//delete taxBand

exports.deleteTaxBand = async (req,res)=>{
  try {
    const {id}=req.params;
    const taxBand =await TaxBand.findByIdAndDelete(id);
    if (!taxBand) return res.status(404).json({ message: "taxBand not found" });
    res.json({message:"taxBand deleting successfully"})

  } catch (error) {
        res.status(500).json({ message: "Error deleting TaxBand ", error: error.message });

  }
}