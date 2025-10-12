const express =require("express")
const router  =express.Router()
const taxBandController =require("../controllers/taxBandController.js")



router.post("/",taxBandController.addTaxBand);
router.get("/",taxBandController.getAllTaxBands);
router.delete("/:id",taxBandController.deleteTaxBand)

module.exports=router;