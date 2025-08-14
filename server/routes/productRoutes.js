const express =require("express")
const router = express.Router()
const productController =require('../controllers/productController');
const upload =require("../middleware/multer")

//Routes

router.post('/',upload.single("image"),productController.addProduct);
router.put('/:id', upload.single("image"),productController.editProduct);
router.delete('/:id',productController.deleteProduct);
router.get('/:id',productController.getProductById);
router.get('/',productController.getAllProducts)


module.exports =router