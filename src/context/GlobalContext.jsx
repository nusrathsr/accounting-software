import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

export const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {

  const [isRegistered, setIsRegistered] = useState(false)
  const [business, setBusiness] = useState([])
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([])
  const [shift, setShift] = useState([])
  const [product, setProduct] = useState([])
  const [productVariant, setProductVariant] = useState([])
  const [businessId, setBusinessId] = useState("")


  useEffect(() => {
    const storedBusinessId = localStorage.getItem("businessId");
    if (storedBusinessId) {
      setBusinessId(storedBusinessId); // this is already the string ID
      setIsRegistered(true);
    }

  }, []);



  const fetchMyBusiness = async () => {
    try {
      const res = await api.get(`/business/${businessId}`);
      setBusiness(res.data);
    } catch (error) {
      console.error("Error fetching business:", error);
    }
  };




// console.log(business);


  const fetchProduct = async () => {
    try {
      const res = await api.get("/products")
      setProduct(res.data)

    } catch (error) {
      console.log('error fetching product ', error);
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees")
      setEmployees(response.data)
    } catch (error) {
      console.log('error fetching employees ', error);
    }
  }





  const fetchCustomer = async () => {
    try {
      const response = await api.get("/customer")
      setCustomers(response.data)
      setSuppliers(response.data.filter(cust => cust.type === 'seller'))
      setLoading(false)
    } catch (error) {
      console.log('error fetching customer ', error);

    }
  }


  // fetch shift
  const fetchShift = async () => {
    try {
      const res = await api.get("/shift")
      setShift(res.data)
    } catch (error) {
      console.log(`error fetching shift`, error);

    }
  }
  useEffect(() => {
    fetchCustomer()
    fetchEmployees()
    fetchShift()
    fetchProduct()
    fetchMyBusiness();
  }, [businessId])


  const value = {
    customers,
    suppliers,
    loading,
    employees,
    shift,
    product,
    productVariant,
    isRegistered,
    setIsRegistered,
    business,
    setBusiness

  }
  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  )

}