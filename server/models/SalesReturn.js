const mongoose = require('mongoose');

const salesReturnSchema = new mongoose.Schema({
  returnId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  returnDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  referenceSaleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesInvoice',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  customerPhone: {
    type: String
  },
  returnItems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant'
    },
    productName: {
      type: String,
      required: true
    },
    sizeOrWeight: {
      type: String
    },
    soldQuantity: {
      type: Number,
      required: true
    },
    returnQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    unitPrice: {
      type: Number,
      required: true
    },
    taxRate: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    returnAmount: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  totalTax: {
    type: Number,
    required: true,
    default: 0
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  totalReturnAmount: {
    type: Number,
    required: true
  },
  refundMode: {
    type: String,
    enum: ['cash', 'upi', 'card', 'wallet', 'credit_note', 'bank_transfer'],
    default: 'cash'
  },
  refundStatus: {
    type: String,
    enum: ['pending', 'completed', 'partial'],
    default: 'pending'
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  narration: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'completed', 'cancelled'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Index for faster queries
salesReturnSchema.index({ returnId: 1 });
salesReturnSchema.index({ referenceSaleId: 1 });
salesReturnSchema.index({ returnDate: -1 });
salesReturnSchema.index({ customerName: 1 });

// Virtual for formatted return date
salesReturnSchema.virtual('formattedReturnDate').get(function() {
  return this.returnDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Pre-save middleware to calculate totals
salesReturnSchema.pre('save', function(next) {
  if (this.returnItems && this.returnItems.length > 0) {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    this.returnItems.forEach(item => {
      const itemSubtotal = item.returnQuantity * item.unitPrice;
      const itemDiscount = (itemSubtotal * item.discount) / 100;
      const afterDiscount = itemSubtotal - itemDiscount;
      const itemTax = (afterDiscount * item.taxRate) / 100;
      
      item.returnAmount = afterDiscount + itemTax;
      
      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
    });

    this.subtotal = subtotal;
    this.totalDiscount = totalDiscount;
    this.totalTax = totalTax;
    this.totalReturnAmount = subtotal - totalDiscount + totalTax;
  }
  
  next();
});

module.exports = mongoose.model('SalesReturn', salesReturnSchema);
