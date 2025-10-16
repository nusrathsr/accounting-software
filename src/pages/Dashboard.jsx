// import React, { useState } from 'react';

// import { Outlet } from 'react-router-dom';
// import Sidebar from '../partials/Sidebar';
// import Header from '../partials/Header';
// import DashboardCard01 from '../partials/dashboard/DashboardCard01';
// import DashboardCard02 from '../partials/dashboard/DashboardCard02';
// import DashboardCard03 from '../partials/dashboard/DashboardCard03';
// import DashboardCard04 from '../partials/dashboard/DashboardCard04';
// import DashboardCard05 from '../partials/dashboard/DashboardCard05';
// import DashboardCard06 from '../partials/dashboard/DashboardCard06';
// import DashboardCard07 from '../partials/dashboard/DashboardCard07';
// import DashboardCard08 from '../partials/dashboard/DashboardCard08';
// import DashboardCard09 from '../partials/dashboard/DashboardCard09';
// import DashboardCard10 from '../partials/dashboard/DashboardCard10';
// import DashboardCard11 from '../partials/dashboard/DashboardCard11';
// import DashboardCard12 from '../partials/dashboard/DashboardCard12';
// import DashboardCard13 from '../partials/dashboard/DashboardCard13';
// import Banner from '../partials/Banner';
// import { ShoppingCart, Users, Package, TrendingUp, TrendingDown } from "lucide-react";
// import Card from '../components/Card';
// function Dashboard() {

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen overflow-hidden ">

//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       {/* Content area */}
//       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

//         {/*  Site header */}
//         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//         <main className="grow">
//           <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

//             {/* Dashboard actions */}
//             <div className="sm:flex sm:justify-between sm:items-center mb-8">
//               <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
//               </div>
//             </div>
//             {/* Cards */}
//             <div className="grid grid-cols-12 gap-6">
//               {location.pathname === "/" && (
//                 <>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-6 bg-gray-50 min-h-screen">
//                     <Card icon={Package} heading="Total Products" result={140} bgColor="bg-purple-500" />
//                     <Card icon={ShoppingCart} heading="Out of Stocks" result={136} bgColor="bg-indigo-500" />
//                     <Card icon={Users} heading="Customers" result={29} bgColor="bg-green-500" />
//                     <Card icon={Users} heading="Suppliers" result={0} bgColor="bg-blue-500" />
//                     <Card icon={TrendingUp} heading="Today Sales" result={0} bgColor="bg-orange-400" />
//                     <Card icon={TrendingDown} heading="Today Purchases" result={0} bgColor="bg-pink-500" />
//                   </div>











//                  <div>
//                   {/* Line chart (Acme Plus) */}
//                   <DashboardCard01 />
//                   {/* Line chart (Acme Advanced) */}
//                   <DashboardCard02 />
//                   {/* Line chart (Acme Professional) */}
//                   <DashboardCard03 />
//                   {/* Bar chart (Direct vs Indirect) */}
//                   <DashboardCard04 />
//                   {/* Line chart (Real Time Value) */}
//                   <DashboardCard05 />
//                   {/* Doughnut chart (Top Countries) */}
//                   <DashboardCard06 />
//                   {/* Table (Top Channels) */}
//                   <DashboardCard07 />
//                   {/* Line chart (Sales Over Time) */}
//                   <DashboardCard08 />
//                   {/* Stacked bar chart (Sales VS Refunds) */}
//                   <DashboardCard09 />
//                   {/* Card (Customers) */}
//                   <DashboardCard10 />
//                   {/* Card (Reasons for Refunds) */}
//                   <DashboardCard11 />
//                   {/* Card (Recent Activity) */}
//                   <DashboardCard12 />
//                   {/* Card (Income/Expenses) */}
//                   <DashboardCard13 />
//                   </div>
//                 </>
//               )}
//             </div>
//             <Outlet />
//           </div>
//         </main>
//         {/* <Banner /> */}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
// import React, { useEffect, useState } from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import Sidebar from '../partials/Sidebar';
// import Header from '../partials/Header';
// import Banner from '../partials/Banner';
// import {
//   ShoppingCart,
//   Users,
//   Package,
//   TrendingUp,
//   TrendingDown,
//   Calendar
// } from "lucide-react";
// import Card from '../components/Card';

// // Dashboard widgets
// import DashboardCard01 from '../partials/dashboard/DashboardCard01';
// import DashboardCard02 from '../partials/dashboard/DashboardCard02';
// import DashboardCard03 from '../partials/dashboard/DashboardCard03';
// import DashboardCard04 from '../partials/dashboard/DashboardCard04';
// import DashboardCard05 from '../partials/dashboard/DashboardCard05';
// import DashboardCard06 from '../partials/dashboard/DashboardCard06';
// import DashboardCard07 from '../partials/dashboard/DashboardCard07';
// import DashboardCard08 from '../partials/dashboard/DashboardCard08';
// import DashboardCard09 from '../partials/dashboard/DashboardCard09';
// import DashboardCard10 from '../partials/dashboard/DashboardCard10';
// import DashboardCard11 from '../partials/dashboard/DashboardCard11';
// import DashboardCard12 from '../partials/dashboard/DashboardCard12';
// import DashboardCard13 from '../partials/dashboard/DashboardCard13';
// import api from "../utils/api";

// function Dashboard() {
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

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
        
//         const { data } = await api.get("/dashboard");
//         setStats(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchStats();
//   }, []);

//   return (
//     <div className="flex h-screen overflow-hidden">

//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       {/* Main content */}
//       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

//         {/* Header */}
//         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//         <main className="grow">
//           <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

//             {/* Top section: Stats cards */}
//             {location.pathname === "/" && (
//               <>

               

//                 {/* 🟩 Stats Cards */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-3 gap-6 mb-8">
//                   <Card icon={Calendar} heading="Financial Year" result={stats.financialYear} bgColor="bg-pink-500" />
//                   <Card icon={Package} heading="Total Products" result={stats.totalProducts} bgColor="bg-purple-500" />
//                   <Card icon={ShoppingCart} heading="Out of Stocks" result={stats.outOfStock} bgColor="bg-indigo-500" />
//                   <Card icon={Users} heading="Customers" result={stats.totalCustomers} bgColor="bg-green-500" />
//                   <Card icon={Users} heading="Suppliers" result={stats.totalSuppliers} bgColor="bg-blue-500" />
//                   <Card icon={TrendingUp} heading="Today Sales" result={stats.todaySales} bgColor="bg-orange-400" />
//                   <Card icon={TrendingUp} heading="Today Purchases" result={stats.todayPurchases} bgColor="bg-yellow-500" />
//                 </div>

                
//               </>
//             )}

//             <Outlet />
//           </div>
//         </main>

//         {/* <Banner /> */}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import Banner from '../partials/Banner';
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar
} from "lucide-react";
import Card from '../components/Card';

// Dashboard widgets
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
import DashboardCard12 from '../partials/dashboard/DashboardCard12';
import DashboardCard13 from '../partials/dashboard/DashboardCard13';
import api from "../utils/api";
import { GlobalContext } from '../context/GlobalContext';
import BusinessRegister from './settings/BusinessRegister';

// 📊 Recharts for graph
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
    const {isRegistered}=useContext(GlobalContext)

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

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard");
        setStats(data);

        // 📈 Example trend data (replace with real backend data if available)
        const salesTrends = data.salesTrends || [
          { month: "Jan", sales: 4000, purchases: 2400 },
          { month: "Feb", sales: 3000, purchases: 2210 },
          { month: "Mar", sales: 5000, purchases: 2900 },
          { month: "Apr", sales: 4780, purchases: 3000 },
          { month: "May", sales: 5890, purchases: 3200 },
          { month: "Jun", sales: 6390, purchases: 3600 },
        ];

        setChartData(salesTrends);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {isRegistered?<main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Top section: Stats cards */}
            {location.pathname === "/" && (
              <>
                {/* 🟩 Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-3 gap-6 mb-8">
                  <Card icon={Calendar} heading="Financial Year" result={stats.financialYear} bgColor="bg-pink-500" />
                  <Card icon={Package} heading="Total Products" result={stats.totalProducts} bgColor="bg-purple-500" />
                  <Card icon={ShoppingCart} heading="Out of Stocks" result={stats.outOfStock} bgColor="bg-indigo-500" />
                  <Card icon={Users} heading="Customers" result={stats.totalCustomers} bgColor="bg-green-500" />
                  <Card icon={Users} heading="Suppliers" result={stats.totalSuppliers} bgColor="bg-blue-500" />
                  <Card icon={TrendingUp} heading="Today Sales" result={stats.todaySales} bgColor="bg-orange-400" />
                  <Card icon={TrendingUp} heading="Today Purchases" result={stats.todayPurchases} bgColor="bg-yellow-500" />
                </div>

                {/* 📊 Graph Section */}
                <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Sales & Purchases Overview
                  </h2>
                  {loading ? (
                    <div className="text-gray-500 text-center py-10">Loading chart...</div>
                  ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} />
                        <Line type="monotone" dataKey="purchases" stroke="#3b82f6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">No data available for chart.</p>
                  )}
                </div>
              </>
            )}
            
            <Outlet />
          </div>
        </main>:
        <BusinessRegister/>
}
      </div>
    </div>
  );
}

export default Dashboard;
