const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/EmployeesController')
const upload = require('../middleware/multer');


router.post('/', upload.single('photo'), employeesController.addEmployee);
router.get('/', employeesController.getAllEmployees);
router.delete('/:id',employeesController.deleteEmployee)
router.get('/:id',employeesController.getEmployee)
router.put('/:id',upload.single('attachment'),employeesController.editEmployee)


module.exports = router;