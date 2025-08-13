import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AddSales from './pages/sales/AddSales';
import ViewSales from './pages/sales/ViewSales';
import AddPurchase from './pages/purchase/AddPurchase';
import ViewPurchase from './pages/purchase/ViewPurchase';
import AddProduct from './pages/product/addProduct/AddProduct'
import EditProduct from './pages/product/editProduct/EditProduct'
import ListProduct from './pages/product/listProduct/ListProduct';
import AddCustomer from './pages/customer/addCustomer/AddCustomer'
import EditCustomer from './pages/customer/editCustomer/EditCustomer'
import ListCustomer from './pages/customer/listCustomer/ListCustomer';
import './css/style.css';
import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/expense/AddExpense';
import ListExpenses from './pages/expense/ListExpense';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} >
          <Route path="sales/add" element={<AddSales />} />
          <Route path="sales/view" element={<ViewSales />} />

          <Route path="purchase/add" element={<AddPurchase />} />
          <Route path="purchase/view" element={<ViewPurchase />} />
          <Route path='/addProduct' element={<AddProduct />} />
          <Route path='/editProduct/:id' element={<EditProduct />} />
          <Route path='/listProduct' element={<ListProduct />} />
          <Route path='/addCustomer' element={<AddCustomer />} />
          <Route path='/editCustomer/:id' element={<EditCustomer />} />
          <Route path='/listCustomer' element={<ListCustomer />} />
          <Route path='/addExpense' element={<AddExpense />} />
          <Route path='/listExpense' element={<ListExpenses />} />




        </Route>
      </Routes>
    </>


  );
}

export default App;
