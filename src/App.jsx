import React, { useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AddSales from './pages/sales/AddSales';
import ViewSales from './pages/sales/ViewSales';
import AddPurchase from './pages/purchase/AddPurchase';
import ViewPurchase from './pages/purchase/ViewPurchase';
import AddTransaction from './pages/payments/AddTransaction';
import TransactionList from './pages/payments/TransactionList';
import AddCategory from "./pages/categories/AddCategory";
import ViewCategories from "./pages/categories/ViewCategories";
import EditCategory from "./pages/categories/EditCategory";
import PurchaseDue from "./pages/purchase/PurchaseDue";
import AddProduct from './pages/product/AddProduct'
import EditProduct from './pages/product/EditProduct'
import AddProductVariant from './pages/product/AddProductVariant';
import ListProduct from './pages/product/ListProduct'
import AddCustomer from './pages/customer/AddCustomer'
import EditCustomer from './pages/customer/EditCustomer'
import ListCustomer from './pages/customer/ListCustomer';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/expense/AddExpense';
import ListExpenses from './pages/expense/ListExpense';
import SalesReport from './pages/reports/SalesReport';
import ExpenseReport from './pages/reports/ExpenseReport';
import StockReport from './pages/reports/StockReport';
import PurchaseReport from './pages/reports/PurchaseReport';
import './css/style.css';
import './charts/ChartjsConfig';
import AddEmployees from './pages/Employees/AddEmployees';
import EditEmployees from './pages/Employees/EditEmployees';
import ListEmployees from './pages/Employees/ListEmployees';
import AddAttendance from './pages/markingAttendance/AddAttendance';
import AttendanceReport from './pages/markingAttendance/AttendaceReport';
import EditAttendance from './pages/markingAttendance/EditAttendance';
import AddShift from './pages/sgiftManagement/AddShift';
import EditShift from './pages/sgiftManagement/EditShift';
import ShiftList from './pages/sgiftManagement/ShiftList';
import AddLeave from './pages/leaveManagement/AddLeave';
import EditLeave from './pages/leaveManagement/EditLeave';
import LeaveRecords from './pages/leaveManagement/LeaveRecords';
import AddHoliday from './pages/holidayCalendar/AddHoliday';
import ListHoliday from './pages/holidayCalendar/ListHoliday';
import EditHoliday from './pages/holidayCalendar/EditHoliday';
import AddAdjustment from './pages/adjustmentStock/AddAdjustment';
import ListAdjustment from './pages/adjustmentStock/ListAdjustment';
import StockStatusReport from './pages/stockStatusReport/StockStatusReport.jsx';
import LowStockAlert from './pages/lowStock/LowStockAlert.jsx';
import ExpiryReport from './pages/expiryReport/ExpiryReport.jsx';
import BillingCounter from './pages/pos/BillingCounter.jsx';
import FinancialYear from './pages/settings/FinancialYear.jsx';
import ProductUnits from './pages/settings/ProductUnit.jsx';
import TaxBands from './pages/settings/TaxBands.jsx';
import CustomerCategories from './pages/customer/customerCategories.jsx';
import BusinessRegister from './pages/settings/BusinessRegister.jsx';
import MyProfile from './pages/settings/MyProfile.jsx';
import UpdateProfile from './pages/settings/UpdateProfile.jsx';
import Ledger from './pages/account/Ledger.jsx';
import AllLedger from './pages/account/AllLedger.jsx';
import JournalVoucher from './pages/account/JournalVoucher.jsx';

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
          <Route path="addProductVariant" element={<AddProductVariant />} />
          <Route path='/listProduct' element={<ListProduct />} />
          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/listCategories" element={<ViewCategories />} />
          <Route path="/editCategory/:id" element={<EditCategory />} />
          <Route path='/addCustomer' element={<AddCustomer />} />
          <Route path='/editCustomer/:id' element={<EditCustomer />} />
          <Route path='/listCustomer' element={<ListCustomer />} />
          <Route path="/customerCategories" element={<CustomerCategories />} />
          <Route path='/addExpense' element={<AddExpense />} />
          <Route path='/listExpense' element={<ListExpenses />} />
          <Route path='/payments/add' element={<AddTransaction />} />
          <Route path='/payments/view' element={<TransactionList />} />
          <Route path="/purchase/dues" element={<PurchaseDue />} />
          <Route path='sales/report' element={<SalesReport />} />
          <Route path='expense/report' element={<ExpenseReport />} />
          <Route path='stock/report' element={<StockReport />} />
          <Route path='purchase/report' element={<PurchaseReport />} />
          <Route path='/addEmployees' element={<AddEmployees />} />
          <Route path='/editEmployees/:id' element={<EditEmployees />} />
          <Route path='/listEmployees' element={<ListEmployees />} />
          <Route path='/dailyAttendance' element={<AddAttendance />} />
          <Route path='/attendanceReport' element={<AttendanceReport />} />
          <Route path='/editAttendance/:id' element={<EditAttendance />} />
          <Route path='/addShift' element={<AddShift />} />
          <Route path='/editShift/:id' element={<EditShift />} />
          <Route path='/shift' element={<ShiftList />} />

          <Route path='/addLeave' element={<AddLeave />} />
          <Route path='/editLeave/:id' element={<EditLeave />} />
          <Route path='/leave' element={<LeaveRecords />} />

          <Route path='/addHoliday' element={<AddHoliday />} />
          <Route path='/editHoliday/:id' element={<EditHoliday />} />
          <Route path='/holidays' element={<ListHoliday />} />
           
          <Route path='/addAdjustment' element={<AddAdjustment />} />
          <Route path='/viewAdjustments' element={<ListAdjustment/>} />
          <Route path='/stockStatus' element={<StockStatusReport/>} />
          <Route path='/lowStockAlert' element={<LowStockAlert/>} />
          <Route path='/expiryReport' element={<ExpiryReport/>} />
          <Route path='/pos/billing' element={<BillingCounter/>} />
          <Route path='/financialYear' element={<FinancialYear/>} />
          <Route path='/units' element={<ProductUnits/>} />
          <Route path='/taxBands' element={<TaxBands/>} />
          
         <Route path='/businessRegister' element={<BusinessRegister/>}/>
         <Route path='/myProfile' element={<MyProfile/>}/>
         <Route path='/updateProfile' element={<UpdateProfile/>}/>
         <Route path="/accounts/ledger" element={<Ledger />} />
          <Route path="/accounts/AllLedger" element={<AllLedger />} />
          <Route path="/accounts/journal-vouchers" element={<JournalVoucher />} />

        </Route>
        
      </Routes>
    </>
  );
}

export default App;