const express =require('express')
const mongoose =require('mongoose')
const dotenv =require('dotenv')
const cors =require('cors')
// const fileUpload =require('express-fileupload')
const productRoutes = require('./routes/productRoutes');
const path =require('path');
const customerRoutes =require('./routes/customerRoutes');
const expenseRoutes =require('./routes/expenseRoutes');
const salesRoutes = require("./routes/salesRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
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
app.use('/api/products', productRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/expense', expenseRoutes)
app.use("/api/sales", salesRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/payments", paymentRoutes);
//Root route
app.get('/',(req,res)=>{
  res.send('API is running')
})

//start server
const PORT =process.env.PORT || 4000;
app.listen(PORT,()=>{
 console.log(`🚀 Server running on http://localhost:${PORT}`); 
})
