import React, { useContext, useState } from 'react'
import axios from "axios";
import { GlobalContext } from '../../context/GlobalContext';

const SalesReport = () => {
  const [report,setReport]=useState(null);
  const [dates,setDates]=useState({startDate:"",endDate:""});
  const {baseURL}=useContext(GlobalContext)


  const fetchReport = async ()=>{
    const {startDate,endDate}=dates;
    const {data} = await axios.get(`${baseURL}/reports/sales`,{
      params:{startDate,endDate}
    })
    setReport(data)
  }
  return (
    <div>
      <h2>Sales Report</h2>
      <input type="date" onChange={e => setDates({...dates, startDate:e.target.value})} />
      <input type="date" onChange={e => setDates({...dates, endDate:e.target.value})} />
      <button onClick={fetchReport}>Get Report</button>

      {report && (
        <div>
          <h3>Total Revenue :${report.totalRevenue}</h3>
          <h3>Total Tax :${report.totalTax}</h3>
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {
                report.sales.map(s=>(
                  <tr key={s._id}>
                    <td>{s.invoiceNumber}</td>
                    <td>{s.customerName}</td>
                    <td>{new Date(s.date).toLocaleDateString()}</td>
                    <td>${s.totalAmount}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

      )}

    </div>
  )
}

export default SalesReport