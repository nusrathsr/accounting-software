import React,{createContext,useState,useEffect} from "react";
import axios from 'axios'

export const GlobalContext =createContext();


export const GlobalProvider = ({ children }) => {
   const baseURL = "http://localhost:4000/api";
 
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees,setEmployees]=useState([])
   const [shift,setShift]=useState([])


const fetchEmployees =async()=>{
  try {
    const response =await axios.get(`${baseURL}/employees`)
    setEmployees(response.data)
  } catch (error) {
    console.log('error fetching employees ',error);
  }
}

console.log(employees);




const fetchCustomer =async()=>{
  try {
    const response =await axios.get(`${baseURL}/customer`)
    setCustomers(response.data)
    setSuppliers(response.data.filter(cust => cust.type === 'seller'))
    setLoading(false)
  } catch (error) {
    console.log('error fetching customer ',error);
   
  }
}


  // fetch shift
const fetchShift =async()=>{
  try {
    const res =await axios.get(`${baseURL}/shift`)
    setShift(res.data)
  } catch (error) {
    console.log(`error fetching shift`,error);
    
  }
}
useEffect(()=>{
  fetchCustomer()
  fetchEmployees()
  fetchShift()
},[])


const value ={
  baseURL,
  customers,
  suppliers,
  loading,
  employees,
  shift
}
return(
 <GlobalContext.Provider value={value}>
  {children}
 </GlobalContext.Provider>
)

}