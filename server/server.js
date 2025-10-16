const express =require('express')
const mongoose =require('mongoose')
const dotenv =require('dotenv')
const cors =require('cors')
// const fileUpload =require('express-fileupload')
const productRoutes = require('./routes/productRoutes');
const variantRoutes = require('./routes/variantRoutes');
const path =require('path');
const categoryRoutes = require('./routes/categoryRoutes');
const customerRoutes =require('./routes/customerRoutes');
const expenseRoutes =require('./routes/expenseRoutes');
const salesRoutes = require("./routes/salesRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reportRouters =require("./routes/reportRoutes")
const employeesRoutes =require('./routes/employeesRoutes')
const attendanceRoutes =require('./routes/attendanceRoutes')
const shiftRoutes=require('./routes/shiftRoutes')
const leaveRoutes = require("./routes/leaveRoutes");
const holidayRoutes =require("./routes/holidatyRoutes")
const stockAdjustmentRoutes =require("./routes/stockAdjustmentRoutes")
const saleRoutes =require('./routes/saleRoutes')
const financialYearRoutes =require("./routes/financialYearRoutes")
const unitRoutes = require("./routes/unitRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const taxBandRoutes =require("./routes/taxBandRoutes")
const businessRoutes =require("./routes/businessRoutes")
// Load env variables
dotenv.config();

const app =express();

//middleware
app.use(cors());
app.use(express.json())
// app.use(fileUpload({useTempFiles:true}))

//connect to mongoDb
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> console.log('✅ MongoDB connected'))
.catch((error)=>console.error('❌ MongoDB connection failed:', error));

//Routes
app.use('/api/products', productRoutes);
app.use('/api/variants', variantRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customer', customerRoutes)
app.use('/api/expense', expenseRoutes)
app.use("/api/sales", salesRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports",reportRouters)
app.use('/api/employees',employeesRoutes)
app.use('/api/attendance',attendanceRoutes)
app.use('/api/shift',shiftRoutes)
app.use("/api/leaves", leaveRoutes);
app.use("/api/holiday",holidayRoutes);
app.use("/api/stockAdjustment",stockAdjustmentRoutes);
app.use('/api/sale',saleRoutes)
app.use("/api/financialYear",financialYearRoutes)
app.use("/api/units", unitRoutes);
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/taxBand",taxBandRoutes)
app.use("/api/business",businessRoutes)
//Root route
app.get('/',(req,res)=>{
  res.send('API is running')
})

//start server
const PORT =process.env.PORT || 4000;
app.listen(PORT,()=>{
 console.log(`🚀 Server running on http://localhost:${PORT}`); 
})
