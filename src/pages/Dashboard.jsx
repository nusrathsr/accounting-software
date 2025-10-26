// // import React, { useState } from 'react';

// // import { Outlet } from 'react-router-dom';
// // import Sidebar from '../partials/Sidebar';
// // import Header from '../partials/Header';
// // import DashboardCard01 from '../partials/dashboard/DashboardCard01';
// // import DashboardCard02 from '../partials/dashboard/DashboardCard02';
// // import DashboardCard03 from '../partials/dashboard/DashboardCard03';
// // import DashboardCard04 from '../partials/dashboard/DashboardCard04';
// // import DashboardCard05 from '../partials/dashboard/DashboardCard05';
// // import DashboardCard06 from '../partials/dashboard/DashboardCard06';
// // import DashboardCard07 from '../partials/dashboard/DashboardCard07';
// // import DashboardCard08 from '../partials/dashboard/DashboardCard08';
// // import DashboardCard09 from '../partials/dashboard/DashboardCard09';
// // import DashboardCard10 from '../partials/dashboard/DashboardCard10';
// // import DashboardCard11 from '../partials/dashboard/DashboardCard11';
// // import DashboardCard12 from '../partials/dashboard/DashboardCard12';
// // import DashboardCard13 from '../partials/dashboard/DashboardCard13';
// // import Banner from '../partials/Banner';
// // import { ShoppingCart, Users, Package, TrendingUp, TrendingDown } from "lucide-react";
// // import Card from '../components/Card';
// // function Dashboard() {

// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   return (
// //     <div className="flex h-screen overflow-hidden ">

// //       {/* Sidebar */}
// //       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// //       {/* Content area */}
// //       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

// //         {/*  Site header */}
// //         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// //         <main className="grow">
// //           <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

// //             {/* Dashboard actions */}
// //             <div className="sm:flex sm:justify-between sm:items-center mb-8">
// //               <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
// //               </div>
// //             </div>
// //             {/* Cards */}
// //             <div className="grid grid-cols-12 gap-6">
// //               {location.pathname === "/" && (
// //                 <>

// //                   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-6 bg-gray-50 min-h-screen">
// //                     <Card icon={Package} heading="Total Products" result={140} bgColor="bg-purple-500" />
// //                     <Card icon={ShoppingCart} heading="Out of Stocks" result={136} bgColor="bg-indigo-500" />
// //                     <Card icon={Users} heading="Customers" result={29} bgColor="bg-green-500" />
// //                     <Card icon={Users} heading="Suppliers" result={0} bgColor="bg-blue-500" />
// //                     <Card icon={TrendingUp} heading="Today Sales" result={0} bgColor="bg-orange-400" />
// //                     <Card icon={TrendingDown} heading="Today Purchases" result={0} bgColor="bg-pink-500" />
// //                   </div>











// //                  <div>
// //                   {/* Line chart (Acme Plus) */}
// //                   <DashboardCard01 />
// //                   {/* Line chart (Acme Advanced) */}
// //                   <DashboardCard02 />
// //                   {/* Line chart (Acme Professional) */}
// //                   <DashboardCard03 />
// //                   {/* Bar chart (Direct vs Indirect) */}
// //                   <DashboardCard04 />
// //                   {/* Line chart (Real Time Value) */}
// //                   <DashboardCard05 />
// //                   {/* Doughnut chart (Top Countries) */}
// //                   <DashboardCard06 />
// //                   {/* Table (Top Channels) */}
// //                   <DashboardCard07 />
// //                   {/* Line chart (Sales Over Time) */}
// //                   <DashboardCard08 />
// //                   {/* Stacked bar chart (Sales VS Refunds) */}
// //                   <DashboardCard09 />
// //                   {/* Card (Customers) */}
// //                   <DashboardCard10 />
// //                   {/* Card (Reasons for Refunds) */}
// //                   <DashboardCard11 />
// //                   {/* Card (Recent Activity) */}
// //                   <DashboardCard12 />
// //                   {/* Card (Income/Expenses) */}
// //                   <DashboardCard13 />
// //                   </div>
// //                 </>
// //               )}
// //             </div>
// //             <Outlet />
// //           </div>
// //         </main>
// //         {/* <Banner /> */}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Dashboard;
// // import React, { useEffect, useState } from 'react';
// // import { Outlet, useLocation } from 'react-router-dom';
// // import Sidebar from '../partials/Sidebar';
// // import Header from '../partials/Header';
// // import Banner from '../partials/Banner';
// // import {
// //   ShoppingCart,
// //   Users,
// //   Package,
// //   TrendingUp,
// //   TrendingDown,
// //   Calendar
// // } from "lucide-react";
// // import Card from '../components/Card';

// // // Dashboard widgets
// // import DashboardCard01 from '../partials/dashboard/DashboardCard01';
// // import DashboardCard02 from '../partials/dashboard/DashboardCard02';
// // import DashboardCard03 from '../partials/dashboard/DashboardCard03';
// // import DashboardCard04 from '../partials/dashboard/DashboardCard04';
// // import DashboardCard05 from '../partials/dashboard/DashboardCard05';
// // import DashboardCard06 from '../partials/dashboard/DashboardCard06';
// // import DashboardCard07 from '../partials/dashboard/DashboardCard07';
// // import DashboardCard08 from '../partials/dashboard/DashboardCard08';
// // import DashboardCard09 from '../partials/dashboard/DashboardCard09';
// // import DashboardCard10 from '../partials/dashboard/DashboardCard10';
// // import DashboardCard11 from '../partials/dashboard/DashboardCard11';
// // import DashboardCard12 from '../partials/dashboard/DashboardCard12';
// // import DashboardCard13 from '../partials/dashboard/DashboardCard13';
// // import api from "../utils/api";

// // function Dashboard() {
// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const location = useLocation();
  
// //   const [stats, setStats] = useState({
// //     financialYear: "",
// //     totalProducts: 0,
// //     outOfStock: 0,
// //     totalCustomers: 0,
// //     totalSuppliers: 0,
// //     todaySales: 0,
// //     todayPurchases: 0
// //   });

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       try {
        
// //         const { data } = await api.get("/dashboard");
// //         setStats(data);
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };
// //     fetchStats();
// //   }, []);

// //   return (
// //     <div className="flex h-screen overflow-hidden">

// //       {/* Sidebar */}
// //       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// //       {/* Main content */}
// //       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

// //         {/* Header */}
// //         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// //         <main className="grow">
// //           <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

// //             {/* Top section: Stats cards */}
// //             {location.pathname === "/" && (
// //               <>

               

// //                 {/* 🟩 Stats Cards */}
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-3 gap-6 mb-8">
// //                   <Card icon={Calendar} heading="Financial Year" result={stats.financialYear} bgColor="bg-pink-500" />
// //                   <Card icon={Package} heading="Total Products" result={stats.totalProducts} bgColor="bg-purple-500" />
// //                   <Card icon={ShoppingCart} heading="Out of Stocks" result={stats.outOfStock} bgColor="bg-indigo-500" />
// //                   <Card icon={Users} heading="Customers" result={stats.totalCustomers} bgColor="bg-green-500" />
// //                   <Card icon={Users} heading="Suppliers" result={stats.totalSuppliers} bgColor="bg-blue-500" />
// //                   <Card icon={TrendingUp} heading="Today Sales" result={stats.todaySales} bgColor="bg-orange-400" />
// //                   <Card icon={TrendingUp} heading="Today Purchases" result={stats.todayPurchases} bgColor="bg-yellow-500" />
// //                 </div>

                
// //               </>
// //             )}

// //             <Outlet />
// //           </div>
// //         </main>

// //         {/* <Banner /> */}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Dashboard;

// // import React, { useContext, useEffect, useState } from 'react';
// // import { Outlet, useLocation } from 'react-router-dom';
// // import Sidebar from '../partials/Sidebar';
// // import Header from '../partials/Header';
// // import Banner from '../partials/Banner';
// // import {
// //   ShoppingCart,
// //   Users,
// //   Package,
// //   TrendingUp,
// //   TrendingDown,
// //   Calendar
// // } from "lucide-react";
// // import Card from '../components/Card';

// // // Dashboard widgets
// // import DashboardCard01 from '../partials/dashboard/DashboardCard01';
// // import DashboardCard02 from '../partials/dashboard/DashboardCard02';
// // import DashboardCard03 from '../partials/dashboard/DashboardCard03';
// // import DashboardCard04 from '../partials/dashboard/DashboardCard04';
// // import DashboardCard05 from '../partials/dashboard/DashboardCard05';
// // import DashboardCard06 from '../partials/dashboard/DashboardCard06';
// // import DashboardCard07 from '../partials/dashboard/DashboardCard07';
// // import DashboardCard08 from '../partials/dashboard/DashboardCard08';
// // import DashboardCard09 from '../partials/dashboard/DashboardCard09';
// // import DashboardCard10 from '../partials/dashboard/DashboardCard10';
// // import DashboardCard11 from '../partials/dashboard/DashboardCard11';
// // import DashboardCard12 from '../partials/dashboard/DashboardCard12';
// // import DashboardCard13 from '../partials/dashboard/DashboardCard13';
// // import api from "../utils/api";
// // import { GlobalContext } from '../context/GlobalContext';
// // import BusinessRegister from './settings/BusinessRegister';

// // // 📊 Recharts for graph
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts";

// // function Dashboard() {
// //     const {isRegistered}=useContext(GlobalContext)

// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const location = useLocation();

// //   const [stats, setStats] = useState({
// //     financialYear: "",
// //     totalProducts: 0,
// //     outOfStock: 0,
// //     totalCustomers: 0,
// //     totalSuppliers: 0,
// //     todaySales: 0,
// //     todayPurchases: 0
// //   });

// //   const [chartData, setChartData] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       try {
// //         const { data } = await api.get("/dashboard");
// //         setStats(data);

// //         // 📈 Example trend data (replace with real backend data if available)
// //         const salesTrends = data.salesTrends || [
// //           { month: "Jan", sales: 4000, purchases: 2400 },
// //           { month: "Feb", sales: 3000, purchases: 2210 },
// //           { month: "Mar", sales: 5000, purchases: 2900 },
// //           { month: "Apr", sales: 4780, purchases: 3000 },
// //           { month: "May", sales: 5890, purchases: 3200 },
// //           { month: "Jun", sales: 6390, purchases: 3600 },
// //         ];

// //         setChartData(salesTrends);
// //       } catch (err) {
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchStats();
// //   }, []);

// //   return (
// //     <div className="flex h-screen overflow-hidden">

// //       {/* Sidebar */}
// //       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// //       {/* Main content */}
// //       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

// //         {/* Header */}
// //         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

// //         {isRegistered?<main className="grow">
// //           <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

// //             {/* Top section: Stats cards */}
// //             {location.pathname === "/" && (
// //               <>
// //                 {/* 🟩 Stats Cards */}
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-3 gap-6 mb-8">
// //                   <Card icon={Calendar} heading="Financial Year" result={stats.financialYear} bgColor="bg-pink-500" />
// //                   <Card icon={Package} heading="Total Products" result={stats.totalProducts} bgColor="bg-purple-500" />
// //                   <Card icon={ShoppingCart} heading="Out of Stocks" result={stats.outOfStock} bgColor="bg-indigo-500" />
// //                   <Card icon={Users} heading="Customers" result={stats.totalCustomers} bgColor="bg-green-500" />
// //                   <Card icon={Users} heading="Suppliers" result={stats.totalSuppliers} bgColor="bg-blue-500" />
// //                   <Card icon={TrendingUp} heading="Today Sales" result={stats.todaySales} bgColor="bg-orange-400" />
// //                   <Card icon={TrendingUp} heading="Today Purchases" result={stats.todayPurchases} bgColor="bg-yellow-500" />
// //                 </div>

// //                 {/* 📊 Graph Section */}
// //                 <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
// //                   <h2 className="text-xl font-semibold mb-4 text-gray-800">
// //                     Sales & Purchases Overview
// //                   </h2>
// //                   {loading ? (
// //                     <div className="text-gray-500 text-center py-10">Loading chart...</div>
// //                   ) : chartData.length > 0 ? (
// //                     <ResponsiveContainer width="100%" height={300}>
// //                       <LineChart data={chartData}>
// //                         <CartesianGrid strokeDasharray="3 3" />
// //                         <XAxis dataKey="month" />
// //                         <YAxis />
// //                         <Tooltip />
// //                         <Legend />
// //                         <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} />
// //                         <Line type="monotone" dataKey="purchases" stroke="#3b82f6" strokeWidth={3} />
// //                       </LineChart>
// //                     </ResponsiveContainer>
// //                   ) : (
// //                     <p className="text-gray-500">No data available for chart.</p>
// //                   )}
// //                 </div>
// //               </>
// //             )}
            
// //             <Outlet />
// //           </div>
// //         </main>:
// //         <BusinessRegister/>
// // }
// //       </div>
// //     </div>
// //   );
// // }

// // export default Dashboard;
// import React, { useContext, useEffect, useState } from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import Sidebar from '../partials/Sidebar';
// import Header from '../partials/Header';
// import {
//   ShoppingCart,
//   Users,
//   Package,
//   TrendingUp,
//   Calendar,
//   UserCheck,
//   AlertCircle
// } from "lucide-react";
// import Card from '../components/Card';
// import api from "../utils/api";
// import { GlobalContext } from '../context/GlobalContext';
// import BusinessRegister from './settings/BusinessRegister';

// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// function Dashboard() {
//   const { isRegistered } = useContext(GlobalContext);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();

//   const [stats, setStats] = useState({
//     financialYear: "",
//     totalProducts: 0,
//     outOfStock: 0,
//     totalCustomers: 0,
//     totalSuppliers: 0,
//     todaySales: 0,
//     todayPurchases: 0
//   });

//   const [salesTrends, setSalesTrends] = useState([]);
//   const [topProducts, setTopProducts] = useState([]);
//   const [categoryDistribution, setCategoryDistribution] = useState([]);
//   const [recentTransactions, setRecentTransactions] = useState([]);
//   const [monthlySummary, setMonthlySummary] = useState([]);
//   const [lowStockProducts, setLowStockProducts] = useState([]);
//   const [topCustomers, setTopCustomers] = useState([]);
//   const [inventoryValue, setInventoryValue] = useState({});
//   const [paymentMethods, setPaymentMethods] = useState([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const { data: dashboardData } = await api.get("/dashboard");
//         console.log("Dashboard Data:", dashboardData);
//         setStats(dashboardData);

//         try {
//           const { data: trendsData } = await api.get("/dashboard/sales-trends");
//           setSalesTrends(trendsData || []);
//         } catch (err) {
//           console.error("Sales trends error:", err);
//           setSalesTrends([]);
//         }

//         try {
//           const { data: topProductsData } = await api.get("/dashboard/top-products");
//           setTopProducts(topProductsData || []);
//         } catch (err) {
//           console.error("Top products error:", err);
//           setTopProducts([]);
//         }

//         try {
//           const { data: categoryData } = await api.get("/dashboard/category-distribution");
//           setCategoryDistribution(categoryData || []);
//         } catch (err) {
//           console.error("Category distribution error:", err);
//           setCategoryDistribution([]);
//         }

//         try {
//           const { data: transactionsData } = await api.get("/dashboard/recent-transactions?limit=5");
//           setRecentTransactions(transactionsData || []);
//         } catch (err) {
//           console.error("Transactions error:", err);
//           setRecentTransactions([]);
//         }

//         try {
//           const { data: monthlyData } = await api.get("/dashboard/monthly-summary");
//           setMonthlySummary(monthlyData || []);
//         } catch (err) {
//           console.error("Monthly summary error:", err);
//           setMonthlySummary([]);
//         }

//         try {
//           const { data: lowStockData } = await api.get("/dashboard/low-stock");
//           setLowStockProducts(lowStockData || []);
//         } catch (err) {
//           console.error("Low stock error:", err);
//           setLowStockProducts([]);
//         }

//         try {
//           const { data: customersData } = await api.get("/dashboard/customer-performance");
//           setTopCustomers(customersData || []);
//         } catch (err) {
//           console.error("Top customers error:", err);
//           setTopCustomers([]);
//         }

//         try {
//           const { data: inventoryData } = await api.get("/dashboard/inventory-value");
//           console.log("Inventory Data:", inventoryData);
//           setInventoryValue(inventoryData || {});
//         } catch (err) {
//           console.error("Inventory value error:", err);
//           setInventoryValue({ totalValue: 0, totalItems: 0, productCount: 0 });
//         }

//         try {
//           const { data: paymentData } = await api.get("/dashboard/payment-methods");
//           setPaymentMethods(paymentData || []);
//         } catch (err) {
//           console.error("Payment methods error:", err);
//           setPaymentMethods([]);
//         }

//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError(err.response?.data?.message || "Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isRegistered) {
//       fetchDashboardData();
//     }
//   }, [isRegistered]);

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
//           <p className="font-semibold text-gray-800">{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} style={{ color: entry.color }} className="text-sm">
//               {entry.name}: ₹{entry.value?.toLocaleString('en-IN')}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   if (!isRegistered) {
//     return (
//       <div className="flex h-screen overflow-hidden">
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
//           <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//           <BusinessRegister />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
//         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//         <main className="grow bg-gray-50">
//           <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            
//             {error && (
//               <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
//                 <AlertCircle size={20} />
//                 <span>{error}</span>
//               </div>
//             )}

//             {location.pathname === "/" ? (
//               <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
//                   <Card 
//                     icon={Calendar} 
//                     heading="Financial Year" 
//                     result={stats.financialYear || "N/A"} 
//                     bgColor="bg-gradient-to-br from-pink-500 to-pink-600" 
//                   />
//                   <Card 
//                     icon={Package} 
//                     heading="Total Products" 
//                     result={loading ? "..." : stats.totalProducts} 
//                     bgColor="bg-gradient-to-br from-purple-500 to-purple-600" 
//                   />
//                   <Card 
//                     icon={ShoppingCart} 
//                     heading="Out of Stock" 
//                     result={loading ? "..." : stats.outOfStock} 
//                     bgColor="bg-gradient-to-br from-red-500 to-red-600" 
//                   />
//                   <Card 
//                     icon={Users} 
//                     heading="Total Customers" 
//                     result={loading ? "..." : stats.totalCustomers} 
//                     bgColor="bg-gradient-to-br from-green-500 to-green-600" 
//                   />
//                   <Card 
//                     icon={UserCheck} 
//                     heading="Total Suppliers" 
//                     result={loading ? "..." : stats.totalSuppliers} 
//                     bgColor="bg-gradient-to-br from-blue-500 to-blue-600" 
//                   />
//                   <Card 
//                     icon={TrendingUp} 
//                     heading="Today Sales" 
//                     result={loading ? "..." : `₹${stats.todaySales?.toLocaleString('en-IN')}`} 
//                     bgColor="bg-gradient-to-br from-orange-400 to-orange-500" 
//                   />
//                   <Card 
//                     icon={TrendingUp} 
//                     heading="Today Purchases" 
//                     result={loading ? "..." : `₹${stats.todayPurchases?.toLocaleString('en-IN')}`} 
//                     bgColor="bg-gradient-to-br from-yellow-500 to-yellow-600" 
//                   />
//                   <Card 
//                     icon={Package} 
//                     heading="Inventory Value" 
//                     result={loading ? "..." : `₹${inventoryValue.totalValue?.toLocaleString('en-IN')}`} 
//                     bgColor="bg-gradient-to-br from-cyan-500 to-cyan-600" 
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  
//                   <div className="bg-white p-6 rounded-2xl shadow-md">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                       Sales & Purchases Trend
//                     </h2>
//                     {loading ? (
//                       <div className="text-gray-500 text-center py-20">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                         <p className="mt-4">Loading chart...</p>
//                       </div>
//                     ) : salesTrends.length > 0 && salesTrends.some(d => d.sales > 0 || d.purchases > 0) ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <LineChart data={salesTrends}>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                           <XAxis dataKey="month" stroke="#6b7280" />
//                           <YAxis stroke="#6b7280" />
//                           <Tooltip content={<CustomTooltip />} />
//                           <Legend />
//                           <Line 
//                             type="monotone" 
//                             dataKey="sales" 
//                             stroke="#10b981" 
//                             strokeWidth={3}
//                             name="Sales"
//                             dot={{ fill: '#10b981', r: 4 }}
//                           />
//                           <Line 
//                             type="monotone" 
//                             dataKey="purchases" 
//                             stroke="#3b82f6" 
//                             strokeWidth={3}
//                             name="Purchases"
//                             dot={{ fill: '#3b82f6', r: 4 }}
//                           />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div className="text-gray-500 text-center py-20">
//                         <p className="text-lg">No sales or purchase data available</p>
//                         <p className="text-sm mt-2">Start adding sales and purchases to see trends</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="bg-white p-6 rounded-2xl shadow-md">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                       Sales by Category
//                     </h2>
//                     {loading ? (
//                       <div className="text-gray-500 text-center py-20">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                         <p className="mt-4">Loading chart...</p>
//                       </div>
//                     ) : categoryDistribution.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <PieChart>
//                           <Pie
//                             data={categoryDistribution}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={false}
//                             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                             outerRadius={100}
//                             fill="#8884d8"
//                             dataKey="value"
//                           >
//                             {categoryDistribution.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div className="text-gray-500 text-center py-20">
//                         <p className="text-lg">No category data available</p>
//                         <p className="text-sm mt-2">Add products with categories and make sales to see distribution</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  
//                   <div className="bg-white p-6 rounded-2xl shadow-md">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                       Top Selling Products
//                     </h2>
//                     {loading ? (
//                       <div className="text-gray-500 text-center py-20">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                         <p className="mt-4">Loading...</p>
//                       </div>
//                     ) : topProducts.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={topProducts}>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                           <XAxis dataKey="name" stroke="#6b7280" />
//                           <YAxis stroke="#6b7280" />
//                           <Tooltip content={<CustomTooltip />} />
//                           <Bar dataKey="quantity" fill="#10b981" name="Quantity Sold" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div className="text-gray-500 text-center py-20">
//                         <p className="text-lg">No product sales data</p>
//                         <p className="text-sm mt-2">Make some sales to see top products</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="bg-white p-6 rounded-2xl shadow-md">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                       Monthly Revenue vs Expenses
//                     </h2>
//                     {loading ? (
//                       <div className="text-gray-500 text-center py-20">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                         <p className="mt-4">Loading...</p>
//                       </div>
//                     ) : monthlySummary.length > 0 && monthlySummary.some(d => d.revenue > 0 || d.expenses > 0) ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={monthlySummary}>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                           <XAxis dataKey="month" stroke="#6b7280" />
//                           <YAxis stroke="#6b7280" />
//                           <Tooltip content={<CustomTooltip />} />
//                           <Legend />
//                           <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
//                           <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div className="text-gray-500 text-center py-20">
//                         <p className="text-lg">No revenue or expense data</p>
//                         <p className="text-sm mt-2">Add sales and expenses to see monthly summary</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
//                   <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                     Recent Transactions
//                   </h2>
//                   {loading ? (
//                     <div className="text-gray-500 text-center py-10">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                       <p className="mt-4">Loading transactions...</p>
//                     </div>
//                   ) : recentTransactions.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Date
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Type
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Customer/Supplier
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Amount
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Status
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {recentTransactions.map((transaction, index) => (
//                             <tr key={index} className="hover:bg-gray-50">
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {new Date(transaction.date).toLocaleDateString('en-IN')}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   transaction.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
//                                 }`}>
//                                   {transaction.type}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {transaction.customer || transaction.supplier || 'N/A'}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                 ₹{transaction.amount?.toLocaleString('en-IN')}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
//                                   transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                                   'bg-red-100 text-red-800'
//                                 }`}>
//                                   {transaction.status}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="text-gray-500 text-center py-10">
//                       <p className="text-lg">No recent transactions</p>
//                       <p className="text-sm mt-2">Transactions will appear here once you make sales</p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  
//                   <div className="bg-white p-6 rounded-2xl shadow-md">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
//                       <AlertCircle className="text-red-500" size={24} />
//                       Low Stock Alert
//                     </h2>
//                     {loading ? (
//                       <div className="text-gray-500 text-center py-10">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                         <p className="mt-4">Loading...</p>
//                       </div>
//                     ) : lowStockProducts.length > 0 ? (
//                       <div className="space-y-3">
//                         {lowStockProducts.map((product, index) => (
//                           <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
//                             <div>
//                               <p className="font-medium text-gray-800">{product.name}</p>
//                               <p className="text-sm text-gray-600">Reorder Level: {product.reorderLevel || 'N/A'}</p>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-lg font-bold text-red-600">{product.stock}</p>
//                               <p className="text-xs text-gray-500">units left</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-gray-500 text-center py-10">
//                         <p className="text-lg">All products are well stocked!</p>
//                         <p className="text-sm mt-2">No products are running low</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="bg-white p-6 rounded-2xl shadow-md">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                       Top Customers
//                     </h2>
//                     {loading ? (
//                       <div className="text-gray-500 text-center py-10">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                         <p className="mt-4">Loading...</p>
//                       </div>
//                     ) : topCustomers.length > 0 ? (
//                       <div className="space-y-3">
//                         {topCustomers.slice(0, 5).map((customer, index) => (
//                           <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
//                             <div className="flex-1">
//                               <p className="font-medium text-gray-800">{customer.name}</p>
//                               <p className="text-sm text-gray-600">{customer.email}</p>
//                               <p className="text-xs text-gray-500">{customer.orderCount} orders</p>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-lg font-bold text-green-600">₹{customer.totalSales?.toLocaleString('en-IN')}</p>
//                               <p className="text-xs text-gray-500">Avg: ₹{customer.averageOrder?.toLocaleString('en-IN')}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-gray-500 text-center py-10">
//                         <p className="text-lg">No customer data available</p>
//                         <p className="text-sm mt-2">Make sales to customers to see top performers</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {paymentMethods.length > 0 && (
//                   <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-800">
//                       Payment Methods (Last 30 Days)
//                     </h2>
//                     <ResponsiveContainer width="100%" height={250}>
//                       <BarChart data={paymentMethods}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                         <XAxis dataKey="method" stroke="#6b7280" />
//                         <YAxis stroke="#6b7280" />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Legend />
//                         <Bar dataKey="total" fill="#8b5cf6" name="Total Amount" />
//                         <Bar dataKey="count" fill="#ec4899" name="Transaction Count" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Outlet />
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// import React, { useContext, useEffect, useState } from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import Sidebar from '../partials/Sidebar';
// import Header from '../partials/Header';
// import {
//   ShoppingCart,
//   Users,
//   Package,
//   TrendingUp,
//   Calendar,
//   UserCheck,
//   AlertCircle,
//   ArrowUpRight,
//   ArrowDownRight,
//   DollarSign
// } from "lucide-react";
// import Card from '../components/Card';
// import api from "../utils/api";
// import { GlobalContext } from '../context/GlobalContext';
// import BusinessRegister from './settings/BusinessRegister';

// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Area,
//   AreaChart
// } from "recharts";

// const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// function Dashboard() {
//   const { isRegistered } = useContext(GlobalContext);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();

//   const [stats, setStats] = useState({
//     financialYear: "",
//     totalProducts: 0,
//     outOfStock: 0,
//     totalCustomers: 0,
//     totalSuppliers: 0,
//     todaySales: 0,
//     todayPurchases: 0
//   });

//   const [salesTrends, setSalesTrends] = useState([]);
//   const [topProducts, setTopProducts] = useState([]);
//   const [categoryDistribution, setCategoryDistribution] = useState([]);
//   const [recentTransactions, setRecentTransactions] = useState([]);
//   const [monthlySummary, setMonthlySummary] = useState([]);
//   const [lowStockProducts, setLowStockProducts] = useState([]);
//   const [topCustomers, setTopCustomers] = useState([]);
//   const [inventoryValue, setInventoryValue] = useState({});
//   const [paymentMethods, setPaymentMethods] = useState([]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const { data: dashboardData } = await api.get("/dashboard");
//         console.log("Dashboard Data:", dashboardData);
//         setStats(dashboardData);

//         try {
//           const { data: trendsData } = await api.get("/dashboard/sales-trends");
//           setSalesTrends(trendsData || []);
//         } catch (err) {
//           console.error("Sales trends error:", err);
//           setSalesTrends([]);
//         }

//         try {
//           const { data: topProductsData } = await api.get("/dashboard/top-products");
//           setTopProducts(topProductsData || []);
//         } catch (err) {
//           console.error("Top products error:", err);
//           setTopProducts([]);
//         }

//         try {
//           const { data: categoryData } = await api.get("/dashboard/category-distribution");
//           setCategoryDistribution(categoryData || []);
//         } catch (err) {
//           console.error("Category distribution error:", err);
//           setCategoryDistribution([]);
//         }

//         try {
//           const { data: transactionsData } = await api.get("/dashboard/recent-transactions?limit=5");
//           setRecentTransactions(transactionsData || []);
//         } catch (err) {
//           console.error("Transactions error:", err);
//           setRecentTransactions([]);
//         }

//         try {
//           const { data: monthlyData } = await api.get("/dashboard/monthly-summary");
//           setMonthlySummary(monthlyData || []);
//         } catch (err) {
//           console.error("Monthly summary error:", err);
//           setMonthlySummary([]);
//         }

//         try {
//           const { data: lowStockData } = await api.get("/dashboard/low-stock");
//           setLowStockProducts(lowStockData || []);
//         } catch (err) {
//           console.error("Low stock error:", err);
//           setLowStockProducts([]);
//         }

//         try {
//           const { data: customersData } = await api.get("/dashboard/customer-performance");
//           setTopCustomers(customersData || []);
//         } catch (err) {
//           console.error("Top customers error:", err);
//           setTopCustomers([]);
//         }

//         try {
//           const { data: inventoryData } = await api.get("/dashboard/inventory-value");
//           console.log("Inventory Data:", inventoryData);
//           setInventoryValue(inventoryData || {});
//         } catch (err) {
//           console.error("Inventory value error:", err);
//           setInventoryValue({ totalValue: 0, totalItems: 0, productCount: 0 });
//         }

//         try {
//           const { data: paymentData } = await api.get("/dashboard/payment-methods");
//           setPaymentMethods(paymentData || []);
//         } catch (err) {
//           console.error("Payment methods error:", err);
//           setPaymentMethods([]);
//         }

//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError(err.response?.data?.message || "Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isRegistered) {
//       fetchDashboardData();
//     }
//   }, [isRegistered]);

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100">
//           <p className="font-bold text-gray-900 mb-2">{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
//               {entry.name}: ₹{entry.value?.toLocaleString('en-IN')}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const EmptyState = ({ title, subtitle, icon: Icon }) => (
//     <div className="text-center py-16">
//       <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
//         {Icon && <Icon className="text-gray-400" size={36} />}
//       </div>
//       <p className="text-lg font-semibold text-gray-700">{title}</p>
//       <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">{subtitle}</p>
//     </div>
//   );

//   const LoadingState = () => (
//     <div className="text-center py-16">
//       <div className="inline-block">
//         <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"></div>
//       </div>
//       <p className="mt-4 text-gray-600 font-medium">Loading data...</p>
//     </div>
//   );

//   if (!isRegistered) {
//     return (
//       <div className="flex h-screen overflow-hidden">
//         <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
//           <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//           <BusinessRegister />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
//         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//         <main className="grow">
//           <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            
//             {error && (
//               <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg flex items-center gap-3 shadow-sm">
//                 <AlertCircle size={24} className="flex-shrink-0" />
//                 <div>
//                   <p className="font-semibold">Error Loading Dashboard</p>
//                   <p className="text-sm mt-1">{error}</p>
//                 </div>
//               </div>
//             )}

//             {location.pathname === "/" ? (
//               <>
//                 {/* Stats Cards with Enhanced Design */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                   <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white">
//                         <Calendar size={24} />
//                       </div>
//                       <ArrowUpRight className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
//                     </div>
//                     <p className="text-gray-600 text-sm font-medium mb-1">Financial Year</p>
//                     <p className="text-2xl font-bold text-gray-900">{stats.financialYear || "N/A"}</p>
//                   </div>

//                   <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
//                         <Package size={24} />
//                       </div>
//                       <ArrowUpRight className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
//                     </div>
//                     <p className="text-gray-600 text-sm font-medium mb-1">Total Products</p>
//                     <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.totalProducts}</p>
//                   </div>

//                   <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
//                         <ShoppingCart size={24} />
//                       </div>
//                       <ArrowDownRight className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
//                     </div>
//                     <p className="text-gray-600 text-sm font-medium mb-1">Out of Stock</p>
//                     <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.outOfStock}</p>
//                   </div>

//                   <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
//                         <Users size={24} />
//                       </div>
//                       <ArrowUpRight className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
//                     </div>
//                     <p className="text-gray-600 text-sm font-medium mb-1">Total Customers</p>
//                     <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.totalCustomers}</p>
//                   </div>

//                   <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
//                         <UserCheck size={24} />
//                       </div>
//                       <ArrowUpRight className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
//                     </div>
//                     <p className="text-gray-600 text-sm font-medium mb-1">Total Suppliers</p>
//                     <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.totalSuppliers}</p>
//                   </div>

//                   <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white group hover:-translate-y-1">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
//                         <TrendingUp size={24} />
//                       </div>
//                       <ArrowUpRight className="opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
//                     </div>
//                     <p className="text-orange-100 text-sm font-medium mb-1">Today Sales</p>
//                     <p className="text-3xl font-bold">{loading ? "..." : `₹${stats.todaySales?.toLocaleString('en-IN')}`}</p>
//                   </div>

//                   <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white group hover:-translate-y-1">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
//                         <TrendingUp size={24} />
//                       </div>
//                       <ArrowDownRight className="opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
//                     </div>
//                     <p className="text-yellow-100 text-sm font-medium mb-1">Today Purchases</p>
//                     <p className="text-3xl font-bold">{loading ? "..." : `₹${stats.todayPurchases?.toLocaleString('en-IN')}`}</p>
//                   </div>

//                   <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white group hover:-translate-y-1">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
//                         <DollarSign size={24} />
//                       </div>
//                       <ArrowUpRight className="opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
//                     </div>
//                     <p className="text-cyan-100 text-sm font-medium mb-1">Inventory Value</p>
//                     <p className="text-3xl font-bold">{loading ? "..." : `₹${inventoryValue.totalValue?.toLocaleString('en-IN')}`}</p>
//                   </div>
//                 </div>

//                 {/* Charts Section */}
//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  
//                   {/* Sales & Purchases Trend */}
//                   <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//                     <div className="flex items-center justify-between mb-6">
//                       <h2 className="text-xl font-bold text-gray-900">
//                         Sales & Purchases Trend
//                       </h2>
//                       <div className="flex gap-3 text-xs">
//                         <div className="flex items-center gap-1">
//                           <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                           <span className="text-gray-600">Sales</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                           <span className="text-gray-600">Purchases</span>
//                         </div>
//                       </div>
//                     </div>
//                     {loading ? (
//                       <LoadingState />
//                     ) : salesTrends.length > 0 && salesTrends.some(d => d.sales > 0 || d.purchases > 0) ? (
//                       <ResponsiveContainer width="100%" height={320}>
//                         <AreaChart data={salesTrends}>
//                           <defs>
//                             <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
//                               <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
//                             </linearGradient>
//                             <linearGradient id="purchasesGradient" x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//                             </linearGradient>
//                           </defs>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                           <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
//                           <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
//                           <Tooltip content={<CustomTooltip />} />
//                           <Area 
//                             type="monotone" 
//                             dataKey="sales" 
//                             stroke="#10b981" 
//                             strokeWidth={3}
//                             fill="url(#salesGradient)"
//                             name="Sales"
//                           />
//                           <Area 
//                             type="monotone" 
//                             dataKey="purchases" 
//                             stroke="#3b82f6" 
//                             strokeWidth={3}
//                             fill="url(#purchasesGradient)"
//                             name="Purchases"
//                           />
//                         </AreaChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <EmptyState 
//                         title="No sales or purchase data available" 
//                         subtitle="Start adding sales and purchases to see trends"
//                         icon={TrendingUp}
//                       />
//                     )}
//                   </div>

//                   {/* Category Distribution */}
//                   <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//                     <h2 className="text-xl font-bold text-gray-900 mb-6">
//                       Sales by Category
//                     </h2>
//                     {loading ? (
//                       <LoadingState />
//                     ) : categoryDistribution.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={320}>
//                         <PieChart>
//                           <Pie
//                             data={categoryDistribution}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={false}
//                             label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
//                             outerRadius={110}
//                             fill="#8884d8"
//                             dataKey="value"
//                           >
//                             {categoryDistribution.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <EmptyState 
//                         title="No category data available" 
//                         subtitle="Add products with categories and make sales to see distribution"
//                         icon={Package}
//                       />
//                     )}
//                   </div>
//                 </div>

//                 {/* Products & Revenue */}
//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  
//                   {/* Top Products */}
//                   <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//                     <h2 className="text-xl font-bold text-gray-900 mb-6">
//                       Top Selling Products
//                     </h2>
//                     {loading ? (
//                       <LoadingState />
//                     ) : topProducts.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={320}>
//                         <BarChart data={topProducts}>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                           <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
//                           <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
//                           <Tooltip content={<CustomTooltip />} />
//                           <Bar dataKey="quantity" fill="#10b981" name="Quantity Sold" radius={[8, 8, 0, 0]} />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <EmptyState 
//                         title="No product sales data" 
//                         subtitle="Make some sales to see top products"
//                         icon={Package}
//                       />
//                     )}
//                   </div>

//                   {/* Monthly Summary */}
//                   <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//                     <h2 className="text-xl font-bold text-gray-900 mb-6">
//                       Monthly Revenue vs Expenses
//                     </h2>
//                     {loading ? (
//                       <LoadingState />
//                     ) : monthlySummary.length > 0 && monthlySummary.some(d => d.revenue > 0 || d.expenses > 0) ? (
//                       <ResponsiveContainer width="100%" height={320}>
//                         <BarChart data={monthlySummary}>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                           <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
//                           <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
//                           <Tooltip content={<CustomTooltip />} />
//                           <Legend />
//                           <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[8, 8, 0, 0]} />
//                           <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <EmptyState 
//                         title="No revenue or expense data" 
//                         subtitle="Add sales and expenses to see monthly summary"
//                         icon={DollarSign}
//                       />
//                     )}
//                   </div>
//                 </div>

//                 {/* Recent Transactions */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-8">
//                   <h2 className="text-xl font-bold text-gray-900 mb-6">
//                     Recent Transactions
//                   </h2>
//                   {loading ? (
//                     <LoadingState />
//                   ) : recentTransactions.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full">
//                         <thead>
//                           <tr className="border-b border-gray-200">
//                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                               Date
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                               Type
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                               Customer/Supplier
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                               Amount
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                               Status
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {recentTransactions.map((transaction, index) => (
//                             <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                                 {new Date(transaction.date).toLocaleDateString('en-IN')}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                                   transaction.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
//                                 }`}>
//                                   {transaction.type}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {transaction.customer || transaction.supplier || 'N/A'}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
//                                 ₹{transaction.amount?.toLocaleString('en-IN')}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                                   transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 
//                                   transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
//                                   'bg-red-100 text-red-700'
//                                 }`}>
//                                   {transaction.status}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <EmptyState 
//                       title="No recent transactions" 
//                       subtitle="Transactions will appear here once you make sales"
//                       icon={ShoppingCart}
//                     />
//                   )}
//                 </div>

//                 {/* Low Stock & Top Customers */}
//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  
//                   {/* Low Stock Alert */}
//                   <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-shadow duration-300">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="p-2 bg-red-500 rounded-lg">
//                         <AlertCircle className="text-white" size={24} />
//                       </div>
//                       <h2 className="text-xl font-bold text-gray-900">
//                         Low Stock Alert
//                       </h2>
//                     </div>
//                     {loading ? (
//                       <LoadingState />
//                     ) : lowStockProducts.length > 0 ? (
//                       <div className="space-y-3 max-h-96 overflow-y-auto">
//                         {lowStockProducts.map((product, index) => (
//                           <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
//                             <div>
//                               <p className="font-semibold text-gray-900">{product.name}</p>
//                               <p className="text-sm text-gray-600 mt-1">Reorder: {product.reorderLevel || 'N/A'}</p>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-2xl font-bold text-red-600">{product.stock}</p>
//                               <p className="text-xs text-gray-500">units left</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <EmptyState 
//                         title="All products are well stocked!" 
//                         subtitle="No products are running low"
//                         icon={Package}
//                       />
//                     )}
//                   </div>

//                   {/* Top Customers */}
//                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow duration-300">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="p-2 bg-green-500 rounded-lg">
//                         <Users className="text-white" size={24} />
//                       </div>
//                       <h2 className="text-xl font-bold text-gray-900">
//                         Top Customers
//                       </h2>
//                     </div>
//                     {loading ? (
//                       <LoadingState />
//                     ) : topCustomers.length > 0 ? (
//                       <div className="space-y-3 max-h-96 overflow-y-auto">
//                         {topCustomers.slice(0, 5).map((customer, index) => (
//                           <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2">
//                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
//                                   {customer.name.charAt(0).toUpperCase()}
//                                 </div>
//                                 <div>
//                                   <p className="font-semibold text-gray-900">{customer.name}</p>
//                                   <p className="text-xs text-gray-600">{customer.email}</p>
//                                 </div>
//                               </div>
//                               <p className="text-xs text-gray-500 mt-2 ml-12">{customer.orderCount} orders</p>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-xl font-bold text-green-600">₹{customer.totalSales?.toLocaleString('en-IN')}</p>
//                               <p className="text-xs text-gray-500 mt-1">Avg: ₹{customer.averageOrder?.toLocaleString('en-IN')}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <EmptyState 
//                         title="No customer data available" 
//                         subtitle="Make sales to customers to see top performers"
//                         icon={Users}
//                       />
//                     )}
//                   </div>
//                 </div>

//                 {/* Payment Methods */}
//                 {paymentMethods.length > 0 && (
//                   <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-8">
//                     <h2 className="text-xl font-bold text-gray-900 mb-6">
//                       Payment Methods (Last 30 Days)
//                     </h2>
//                     <ResponsiveContainer width="100%" height={280}>
//                       <BarChart data={paymentMethods}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                         <XAxis dataKey="method" stroke="#9ca3af" style={{ fontSize: '12px' }} />
//                         <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Legend />
//                         <Bar dataKey="total" fill="#8b5cf6" name="Total Amount" radius={[8, 8, 0, 0]} />
//                         <Bar dataKey="count" fill="#ec4899" name="Transaction Count" radius={[8, 8, 0, 0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <Outlet />
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Calendar,
  UserCheck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from "lucide-react";
import Card from '../components/Card';
import api from "../utils/api";
import { GlobalContext } from '../context/GlobalContext';
import BusinessRegister from './settings/BusinessRegister';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function Dashboard() {
  const { isRegistered } = useContext(GlobalContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const [stats, setStats] = useState({
    financialYear: "",
    totalProducts: 0,
    outOfStock: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    todaySales: 0,
    todayPurchases: 0
  });

  // New state for today's counts
  const [todaySalesCount, setTodaySalesCount] = useState(0);
  const [todayPurchasesCount, setTodayPurchasesCount] = useState(0);

  const [salesTrends, setSalesTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [inventoryValue, setInventoryValue] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: dashboardData } = await api.get("/dashboard");
        console.log("Dashboard Data:", dashboardData);
        setStats(dashboardData);

        // Fetch today's sales count
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          // Count today's sales
          const { data: salesData } = await api.get("/sales");
          const todaySales = salesData.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= today && saleDate < tomorrow;
          });
          setTodaySalesCount(todaySales.length);

          // Count today's purchases
          const { data: purchasesData } = await api.get("/purchases");
          const todayPurchases = purchasesData.filter(purchase => {
            const purchaseDate = new Date(purchase.date || purchase.purchaseDate);
            return purchaseDate >= today && purchaseDate < tomorrow;
          });
          setTodayPurchasesCount(todayPurchases.length);
        } catch (err) {
          console.error("Error fetching today's counts:", err);
          setTodaySalesCount(0);
          setTodayPurchasesCount(0);
        }

        try {
          const { data: trendsData } = await api.get("/dashboard/sales-trends");
          setSalesTrends(trendsData || []);
        } catch (err) {
          console.error("Sales trends error:", err);
          setSalesTrends([]);
        }

        try {
          const { data: topProductsData } = await api.get("/dashboard/top-products");
          setTopProducts(topProductsData || []);
        } catch (err) {
          console.error("Top products error:", err);
          setTopProducts([]);
        }

        try {
          const { data: categoryData } = await api.get("/dashboard/category-distribution");
          setCategoryDistribution(categoryData || []);
        } catch (err) {
          console.error("Category distribution error:", err);
          setCategoryDistribution([]);
        }

        try {
          const { data: transactionsData } = await api.get("/dashboard/recent-transactions?limit=5");
          setRecentTransactions(transactionsData || []);
        } catch (err) {
          console.error("Transactions error:", err);
          setRecentTransactions([]);
        }

        try {
          const { data: monthlyData } = await api.get("/dashboard/monthly-summary");
          setMonthlySummary(monthlyData || []);
        } catch (err) {
          console.error("Monthly summary error:", err);
          setMonthlySummary([]);
        }

        try {
          const { data: lowStockData } = await api.get("/dashboard/low-stock");
          setLowStockProducts(lowStockData || []);
        } catch (err) {
          console.error("Low stock error:", err);
          setLowStockProducts([]);
        }

        try {
          const { data: customersData } = await api.get("/dashboard/customer-performance");
          setTopCustomers(customersData || []);
        } catch (err) {
          console.error("Top customers error:", err);
          setTopCustomers([]);
        }

        try {
          const { data: inventoryData } = await api.get("/dashboard/inventory-value");
          console.log("Inventory Data:", inventoryData);
          setInventoryValue(inventoryData || {});
        } catch (err) {
          console.error("Inventory value error:", err);
          setInventoryValue({ totalValue: 0, totalItems: 0, productCount: 0 });
        }

        try {
          const { data: paymentData } = await api.get("/dashboard/payment-methods");
          setPaymentMethods(paymentData || []);
        } catch (err) {
          console.error("Payment methods error:", err);
          setPaymentMethods([]);
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (isRegistered) {
      fetchDashboardData();
    }
  }, [isRegistered]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: ₹{entry.value?.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const EmptyState = ({ title, subtitle, icon: Icon }) => (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
        {Icon && <Icon className="text-gray-400" size={36} />}
      </div>
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">{subtitle}</p>
    </div>
  );

  const LoadingState = () => (
    <div className="text-center py-16">
      <div className="inline-block">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading data...</p>
    </div>
  );

  if (!isRegistered) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <BusinessRegister />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            
            {error && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg flex items-center gap-3 shadow-sm">
                <AlertCircle size={24} className="flex-shrink-0" />
                <div>
                  <p className="font-semibold">Error Loading Dashboard</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {location.pathname === "/" ? (
              <>
                {/* Stats Cards with Enhanced Design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                        <Calendar size={24} />
                      </div>
                      <ArrowUpRight className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Financial Year</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.financialYear || "N/A"}</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <Package size={24} />
                      </div>
                      <ArrowUpRight className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.totalProducts}</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <ShoppingCart size={24} />
                      </div>
                      <ArrowDownRight className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Out of Stock</p>
                    <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.outOfStock}</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <Users size={24} />
                      </div>
                      <ArrowUpRight className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.totalCustomers}</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <UserCheck size={24} />
                      </div>
                      <ArrowUpRight className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Suppliers</p>
                    <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.totalSuppliers}</p>
                  </div>

                  {/* Today Sales Count Card */}
                  <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white group hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
                        <TrendingUp size={24} />
                      </div>
                      <ArrowUpRight className="opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-orange-100 text-sm font-medium mb-1">Today Sales</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{loading ? "..." : todaySalesCount}</p>
                      <p className="text-orange-100 text-sm">transactions</p>
                    </div>
                  </div>

                  {/* Today Purchases Count Card */}
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white group hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
                        <ShoppingCart size={24} />
                      </div>
                      <ArrowDownRight className="opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-yellow-100 text-sm font-medium mb-1">Today Purchases</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{loading ? "..." : todayPurchasesCount}</p>
                      <p className="text-yellow-100 text-sm">transactions</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white group hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
                        <DollarSign size={24} />
                      </div>
                      <ArrowUpRight className="opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>
                    <p className="text-cyan-100 text-sm font-medium mb-1">Inventory Value</p>
                    <p className="text-3xl font-bold">{loading ? "..." : `₹${inventoryValue.totalValue?.toLocaleString('en-IN')}`}</p>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  
                  {/* Sales & Purchases Trend */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">
                        Sales & Purchases Trend
                      </h2>
                      <div className="flex gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-gray-600">Sales</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-gray-600">Purchases</span>
                        </div>
                      </div>
                    </div>
                    {loading ? (
                      <LoadingState />
                    ) : salesTrends.length > 0 && salesTrends.some(d => d.sales > 0 || d.purchases > 0) ? (
                      <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={salesTrends}>
                          <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="purchasesGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            fill="url(#salesGradient)"
                            name="Sales"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="purchases" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fill="url(#purchasesGradient)"
                            name="Purchases"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState 
                        title="No sales or purchase data available" 
                        subtitle="Start adding sales and purchases to see trends"
                        icon={TrendingUp}
                      />
                    )}
                  </div>

                  {/* Category Distribution */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Sales by Category
                    </h2>
                    {loading ? (
                      <LoadingState />
                    ) : categoryDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                          <Pie
                            data={categoryDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState 
                        title="No category data available" 
                        subtitle="Add products with categories and make sales to see distribution"
                        icon={Package}
                      />
                    )}
                  </div>
                </div>

                {/* Products & Revenue */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  
                  {/* Top Products */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Top Selling Products
                    </h2>
                    {loading ? (
                      <LoadingState />
                    ) : topProducts.length > 0 ? (
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={topProducts}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="quantity" fill="#10b981" name="Quantity Sold" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState 
                        title="No product sales data" 
                        subtitle="Make some sales to see top products"
                        icon={Package}
                      />
                    )}
                  </div>

                  {/* Monthly Summary */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Monthly Revenue vs Expenses
                    </h2>
                    {loading ? (
                      <LoadingState />
                    ) : monthlySummary.length > 0 && monthlySummary.some(d => d.revenue > 0 || d.expenses > 0) ? (
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={monthlySummary}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyState 
                        title="No revenue or expense data" 
                        subtitle="Add sales and expenses to see monthly summary"
                        icon={DollarSign}
                      />
                    )}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Recent Transactions
                  </h2>
                  {loading ? (
                    <LoadingState />
                  ) : recentTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Customer/Supplier
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTransactions.map((transaction, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {new Date(transaction.date).toLocaleDateString('en-IN')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  transaction.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {transaction.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {transaction.customer || transaction.supplier || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                ₹{transaction.amount?.toLocaleString('en-IN')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {transaction.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState 
                      title="No recent transactions" 
                      subtitle="Transactions will appear here once you make sales"
                      icon={ShoppingCart}
                    />
                  )}
                </div>

                {/* Low Stock & Top Customers */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  
                  {/* Low Stock Alert */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-500 rounded-lg">
                        <AlertCircle className="text-white" size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Low Stock Alert
                      </h2>
                    </div>
                    {loading ? (
                      <LoadingState />
                    ) : lowStockProducts.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {lowStockProducts.map((product, index) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div>
                              <p className="font-semibold text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600 mt-1">Reorder: {product.reorderLevel || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-red-600">{product.stock}</p>
                              <p className="text-xs text-gray-500">units left</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        title="All products are well stocked!" 
                        subtitle="No products are running low"
                        icon={Package}
                      />
                    )}
                  </div>

                  {/* Top Customers */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Users className="text-white" size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Top Customers
                      </h2>
                    </div>
                    {loading ? (
                      <LoadingState />
                    ) : topCustomers.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {topCustomers.slice(0, 5).map((customer, index) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                                  {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{customer.name}</p>
                                  <p className="text-xs text-gray-600">{customer.email}</p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2 ml-12">{customer.orderCount} orders</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-green-600">₹{customer.totalSales?.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-gray-500 mt-1">Avg: ₹{customer.averageOrder?.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        title="No customer data available" 
                        subtitle="Make sales to customers to see top performers"
                        icon={Users}
                      />
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                {paymentMethods.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Payment Methods (Last 30 Days)
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={paymentMethods}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="method" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="total" fill="#8b5cf6" name="Total Amount" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="count" fill="#ec4899" name="Transaction Count" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;