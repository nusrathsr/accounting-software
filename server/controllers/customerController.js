const Customer = require('../models/Customer');

// Create a new customer
exports.addCustomer = async (req, res) => {
  try {
    const { name, phone, email, type, gstNumber, address, city, state, pincode } = req.body;

    // Validate required fields
    if (!name || !phone || !type) {
      return res.status(400).json({ message: 'Name, phone, and type are required.' });
    }

    // If GST required based on type
    if (['wholesale', 'distributor', 'vendor'].includes(type) && !gstNumber) {
      return res.status(400).json({ message: 'GST number is required for this customer type.' });
    }

    const customer = new Customer({
      name,
      phone,
      email,
      type,
      gstNumber,
      address,
      city,
      state,
      pincode
    });

    await customer.save();

    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Server error while creating customer' });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Server error while fetching customers' });
  }
};

// Get single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Server error while fetching customer' });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });

    res.json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Server error while updating customer' });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Server error while deleting customer' });
  }
};
