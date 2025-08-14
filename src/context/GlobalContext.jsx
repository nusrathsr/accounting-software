import React,{createContext,useState,useEffect} from "react";
import axios from 'axios'

export const GlobalContext =createContext();


export const GlobalProvider = ({ children }) => {
   const baseURL = "http://localhost:4000/api";
 
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);


const fetchCustomer =async()=>{
  try {
    const response =await axios.get(`${baseURL}/customer`)
    setCustomers(response.data)
    setSuppliers(response.data.filter(cust => cust.type === 'vendor'))
    setLoading(false)
  } catch (error) {
    console.log('error fetching customer ',error);
   
  }
}
useEffect(()=>{
  fetchCustomer()
},[])


const value ={
  baseURL,
  customers,
  suppliers,
  loading
}
return(
 <GlobalContext.Provider value={value}>
  {children}
 </GlobalContext.Provider>
)

}