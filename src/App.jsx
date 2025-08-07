import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import AddSales from './pages/sales/AddSales';
import ViewSales from './pages/sales/ViewSales';
import AddPurchase from './pages/purchase/AddPurchase';
import ViewPurchase from './pages/purchase/ViewPurchase';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';

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
        </Route>
      </Routes>
    </>
  );
}

export default App;
