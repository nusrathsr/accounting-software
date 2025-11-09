import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  PlusCircle,
  List,
  Folder,
  Users,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import SidebarLinkGroup from "./SidebarLinkGroup";


function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
}) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === "true");

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'}`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/" className="block">
            <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Pages</span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <SidebarLinkGroup activecondition={pathname === "/" || pathname.includes("dashboard")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname === "/" || pathname.includes("dashboard") ? "" : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className={`shrink-0 fill-current ${pathname === "/" || pathname.includes("dashboard") ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                              <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                              <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                            </svg>
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Dashboard
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Main
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="https://cruip.com/mosaic/"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Analytics
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="https://cruip.com/mosaic/"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Fintech
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* product*/}
              {/* <SidebarLinkGroup activecondition={pathname.includes("product")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("product") ? "" : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className={`shrink-0 fill-current ${pathname.includes('product') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                              <path d="M9 6.855A3.502 3.502 0 0 0 8 0a3.5 3.5 0 0 0-1 6.855v1.656L5.534 9.65a3.5 3.5 0 1 0 1.229 1.578L8 10.267l1.238.962a3.5 3.5 0 1 0 1.229-1.578L9 8.511V6.855ZM6.5 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4.803 8.095c.005-.005.01-.01.013-.016l.012-.016a1.5 1.5 0 1 1-.025.032ZM3.5 11c.474 0 .897.22 1.171.563l.013.016.013.017A1.5 1.5 0 1 1 3.5 11Z" />
                            </svg>
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Product
                            </span>
                          </div>
                         
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/addProduct"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Add Product
                              </span>
                            </NavLink>
                          </li>
                         
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/addProductVariant"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Add Product Variant
                              </span>
                            </NavLink>
                          </li>

                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/listProduct"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                view Products
                              </span>
                            </NavLink>
                          </li>

                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> */}
              {/*categories*/}
              {/* <SidebarLinkGroup activecondition={pathname.includes("category")}>
  {(handleClick, open) => {
    return (
      <React.Fragment>
        <a
          href="#0"
          className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
            pathname.includes("category")
              ? ""
              : "hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleClick();
            setSidebarExpanded(true);
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center"> */}
              {/* Category Icon */}
              {/* <svg
                className={`shrink-0 fill-current ${
                  pathname.includes("category")
                    ? "text-violet-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
              </svg>
              <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                Categories
              </span>
            </div> */}
              {/* Arrow */}
              {/* <div className="flex shrink-0 ml-2">
              <svg
                className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${
                  open && "rotate-180"
                }`}
                viewBox="0 0 12 12"
              >
                <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
              </svg>
            </div>
          </div>
        </a>
        <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
          <ul className={`pl-8 mt-1 ${!open && "hidden"}`}> */}
              {/* Add Category */}
              {/* <li className="mb-1 last:mb-0">
              <NavLink
                end
                to="/addCategory"
                className={({ isActive }) =>
                  "block transition duration-150 truncate " +
                  (isActive
                    ? "text-violet-500"
                    : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                }
              >
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Add Category
                </span>
              </NavLink>
            </li> */}

              {/* View Categories */}
              {/* <li className="mb-1 last:mb-0">
              <NavLink
                end
                to="/listCategories"
                className={({ isActive }) =>
                  "block transition duration-150 truncate " +
                  (isActive
                    ? "text-violet-500"
                    : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                }
              >
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  View Categories
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );
  }}
</SidebarLinkGroup> */}

              {/* customer*/}
              {/* <SidebarLinkGroup activecondition={pathname.includes("customer")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("customer") ? "" : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className={`shrink-0 fill-current ${pathname.includes('customer') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                              <path d="M12 1a1 1 0 1 0-2 0v2a3 3 0 0 0 3 3h2a1 1 0 1 0 0-2h-2a1 1 0 0 1-1-1V1ZM1 10a1 1 0 1 0 0 2h2a1 1 0 0 1 1 1v2a1 1 0 1 0 2 0v-2a3 3 0 0 0-3-3H1ZM5 0a1 1 0 0 1 1 1v2a3 3 0 0 1-3 3H1a1 1 0 0 1 0-2h2a1 1 0 0 0 1-1V1a1 1 0 0 1 1-1ZM12 13a1 1 0 0 1 1-1h2a1 1 0 1 0 0-2h-2a3 3 0 0 0-3 3v2a1 1 0 1 0 2 0v-2Z" />
                            </svg>
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Customer
                            </span>
                          </div> */}
              {/* Icon */}
              {/* <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/addCustomer"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Add Customer
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/listCustomer"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                view Customer
                              </span>
                            </NavLink>
                          </li>

                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> */}
              {/* Master Data */}
              <SidebarLinkGroup activecondition={
                pathname.includes("product") ||
                pathname.includes("category") ||
                pathname.includes("customer")
              }>
                {(handleClick, open) => (
                  <React.Fragment>
                    <a
                      href="#0"
                      className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("product") ||
                          pathname.includes("category") ||
                          pathname.includes("customer")
                          ? ""
                          : "hover:text-gray-900 dark:hover:text-white"
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                        setSidebarExpanded(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {/* Master Data Icon */}
                          <svg
                            className={`shrink-0 fill-current ${open ? "text-violet-500" : "text-gray-400 dark:text-gray-500"}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"  // smaller
                            height="12" // smaller
                            viewBox="0 0 24 24"
                          >
                            <path d="M3 3h18v2H3V3zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                          </svg>
                          <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            Master Data
                          </span>
                        </div>
                        {/* Arrow */}
                        <div className="flex shrink-0 ml-2">
                          <svg
                            className={`w-2.5 h-2.5 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`}
                            viewBox="0 0 12 12"
                          >
                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                          </svg>
                        </div>
                      </div>
                    </a>

                    {/* Submenus */}
                    <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                      <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                        {/* Product */}
                        <SidebarLinkGroup activecondition={pathname.includes("product")}>
                          {(handleClick2, open2) => (
                            <>
                              <a
                                href="#0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleClick2();
                                }}
                                className="flex items-center justify-between text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                              >
                                <span className="text-sm">Products</span>
                                <svg
                                  className={`w-2.5 h-2.5 ml-1 fill-current ${open2 && "rotate-180"}`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </a>
                              <ul className={`pl-6 mt-1 ${!open2 && "hidden"}`}>
                                <li>
                                  <NavLink to="/addProduct" className="text-sm whitespace-nowrap block">Add Product</NavLink>
                                </li>
                                <li>
                                  <NavLink to="/addProductVariant" className="text-sm whitespace-nowrap block">Add Product Variant</NavLink>
                                </li>
                                <li>
                                  <NavLink to="/listProduct" className="text-sm whitespace-nowrap block">View Products</NavLink>
                                </li>
                              </ul>
                            </>
                          )}
                        </SidebarLinkGroup>

                        {/* Categories */}
                        <SidebarLinkGroup activecondition={pathname.includes("category")}>
                          {(handleClick2, open2) => (
                            <>
                              <a
                                href="#0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleClick2();
                                }}
                                className="flex items-center justify-between text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                              >
                                <span className="text-sm">Categories</span>
                                <svg
                                  className={`w-2.5 h-2.5 ml-1 fill-current ${open2 && "rotate-180"}`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </a>
                              <ul className={`pl-6 mt-1 ${!open2 && "hidden"}`}>
                                <li>
                                  <NavLink to="/addCategory" className="text-sm whitespace-nowrap block">Add Category</NavLink>
                                </li>
                                <li>
                                  <NavLink to="/listCategories" className="text-sm whitespace-nowrap block">View Categories</NavLink>
                                </li>
                              </ul>
                            </>
                          )}
                        </SidebarLinkGroup>

                        {/* Customers */}
                        <SidebarLinkGroup activecondition={pathname.includes("customer")}>
                          {(handleClick2, open2) => (
                            <>
                              <a
                                href="#0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleClick2();
                                }}
                                className="flex items-center justify-between text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                              >
                                <span className="text-sm">Customers</span>
                                <svg
                                  className={`w-2.5 h-2.5 ml-1 fill-current ${open2 && "rotate-180"}`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </a>
                              <ul className={`pl-6 mt-1 ${!open2 && "hidden"}`}>
                                <li>
                                  <NavLink to="/addCustomer" className="text-sm whitespace-nowrap block">Add Customer</NavLink>
                                </li>
                                <li>
                                  <NavLink to="/listCustomer" className="text-sm whitespace-nowrap block">View Customers</NavLink>
                                </li>
                                <li>
                                  <NavLink to="/customerCategories" className="text-sm whitespace-nowrap block">Customer Categories</NavLink>
                                </li>
                              </ul>
                            </>
                          )}
                        </SidebarLinkGroup>
                      </ul>
                    </div>
                  </React.Fragment>
                )}
              </SidebarLinkGroup>


              {/* expense*/}
              <SidebarLinkGroup activecondition={pathname.includes("expense")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("expense") ? "" : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className={`shrink-0 fill-current ${pathname.includes('expense') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                              <path d="M12 1a1 1 0 1 0-2 0v2a3 3 0 0 0 3 3h2a1 1 0 1 0 0-2h-2a1 1 0 0 1-1-1V1ZM1 10a1 1 0 1 0 0 2h2a1 1 0 0 1 1 1v2a1 1 0 1 0 2 0v-2a3 3 0 0 0-3-3H1ZM5 0a1 1 0 0 1 1 1v2a3 3 0 0 1-3 3H1a1 1 0 0 1 0-2h2a1 1 0 0 0 1-1V1a1 1 0 0 1 1-1ZM12 13a1 1 0 0 1 1-1h2a1 1 0 1 0 0-2h-2a3 3 0 0 0-3 3v2a1 1 0 1 0 2 0v-2Z" />
                            </svg>
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Expense
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/addExpense"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Add Expense
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/listExpense"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                view Expense
                              </span>
                            </NavLink>
                          </li>

                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* sales*/}
              <SidebarLinkGroup activecondition={pathname.includes("sales")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("sales")
                          ? ""
                          : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {/* Sales Icon */}
                            <svg
                              className={`shrink-0 fill-current ${pathname.includes('sales')
                                ? 'text-violet-500'
                                : 'text-gray-400 dark:text-gray-500'
                                }`}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3 1h10v14H3z" />
                            </svg>
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Sales
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"
                                }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/sales/add"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Sales Invoice
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/sales/view"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                View Sales
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* Sales Return */}
              {/* Sales Return */}
              <SidebarLinkGroup activecondition={pathname.includes("sales-return")}>
                {(handleClick, open) => (
                  <React.Fragment>
                    <a
                      href="#0"
                      className={`block text-gray-800 dark:text-gray-100 truncate transition ${pathname.includes("sales-return") ? "" : "hover:text-gray-900"
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                        setSidebarExpanded(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {/* Icon */}
                          <svg
                            className={`shrink-0 fill-current ${pathname.includes("sales-return")
                                ? "text-violet-500"
                                : "text-gray-400"
                              }`}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 0a8 8 0 108 8 8 8 0 00-8-8zm3.5 11.5L8 8l-3.5 3.5L3 10l5-5 5 5z" />
                          </svg>
                          <span className="text-sm font-medium ml-4">Sales Return</span>
                        </div>

                        {/* Arrow */}
                        <svg
                          className={`w-3 h-3 fill-current transform transition-transform ${open ? "rotate-180" : ""
                            }`}
                          viewBox="0 0 12 12"
                        >
                          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                        </svg>
                      </div>
                    </a>

                    {/* Submenu */}
                    <div className="lg:sidebar-expanded:block 2xl:block">
                      <ul className={`pl-8 mt-1 ${!open ? "hidden" : ""}`}>
                        <li className="mb-1">
                          <NavLink
                            to="/sales-return/add"
                            className={({ isActive }) =>
                              isActive ? "text-violet-500" : "text-gray-500"
                            }
                          >
                            <span className="text-sm font-medium">Create Return</span>
                          </NavLink>
                        </li>
                        <li className="mb-1">
                          <NavLink
                            to="/sales-return/view"
                            className={({ isActive }) =>
                              isActive ? "text-violet-500" : "text-gray-500"
                            }
                          >
                            <span className="text-sm font-medium">View Returns</span>
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </React.Fragment>
                )}
              </SidebarLinkGroup>



              {/* sales*/}
              <SidebarLinkGroup activecondition={pathname.includes("sales")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("sales")
                          ? ""
                          : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className={`shrink-0 fill-current ${pathname.includes('pos')
                                ? 'text-violet-500'
                                : 'text-gray-400 dark:text-gray-500'
                                }`}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3 1h10v14H3z" />
                            </svg>
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              POS
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"
                                }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/pos/billing"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Billing Counter
                              </span>
                            </NavLink>
                          </li>

                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>



              <SidebarLinkGroup activecondition={pathname.includes("payments") || pathname.includes("receipts")}>
                {(handleClick, open) => (
                  <>
                    <a
                      href="#0"
                      className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("payments") || pathname.includes("receipts")
                        ? ""
                        : "hover:text-gray-900 dark:hover:text-white"
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                        setSidebarExpanded(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {/* Purchase Icon */}
                          <svg
                            className={`shrink-0 fill-current ${pathname.includes("purchase")
                              ? "text-violet-500"
                              : "text-gray-400 dark:text-gray-500"
                              }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 1h10v14H3z" />
                          </svg>
                          <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            Payments & Receipts
                          </span>
                        </div>
                        <div className="flex shrink-0 ml-2">
                          <svg
                            className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"
                              }`}
                            viewBox="0 0 12 12"
                          >
                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                          </svg>
                        </div>
                      </div>
                    </a>
                    <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                      <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                        <li className="mb-1 last:mb-0">
                          <NavLink
                            end
                            to="/payments/add"
                            className={({ isActive }) =>
                              "block transition duration-150 truncate " +
                              (isActive
                                ? "text-violet-500"
                                : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                            }
                          >
                            <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Add Transaction
                            </span>
                          </NavLink>
                        </li>
                        <li className="mb-1 last:mb-0">
                          <NavLink
                            end
                            to="/payments/view"
                            className={({ isActive }) =>
                              "block transition duration-150 truncate " +
                              (isActive
                                ? "text-violet-500"
                                : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                            }
                          >
                            <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              View Transactions
                            </span>
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>
              {/* Reports and Analytics */}

              <SidebarLinkGroup activecondition={pathname.includes("Reports and Analytics")}>
                {(handleClick, open) => (
                  <>
                    <a
                      href="#0"
                      className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("Reports and Analytics")
                        ? ""
                        : "hover:text-gray-900 dark:hover:text-white"
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                        setSidebarExpanded(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {/* Purchase Icon */}
                          <svg
                            className={`shrink-0 fill-current ${pathname.includes("Reports and Analytics")
                              ? "text-violet-500"
                              : "text-gray-400 dark:text-gray-500"
                              }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 1h10v14H3z" />
                          </svg>
                          <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            Reports&Analytics
                          </span>
                        </div>
                        <div className="flex shrink-0 ml-2">
                          <svg
                            className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"
                              }`}
                            viewBox="0 0 12 12"
                          >
                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                          </svg>
                        </div>
                      </div>
                    </a>
                    <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                      <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                        <li className="mb-1 last:mb-0">
                          <NavLink
                            end
                            to="/sales/report"
                            className={({ isActive }) =>
                              "block transition duration-150 truncate " +
                              (isActive
                                ? "text-violet-500"
                                : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                            }
                          >
                            <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Sales Report
                            </span>
                          </NavLink>
                        </li>
                        <li className="mb-1 last:mb-0">
                          <NavLink
                            end
                            to="/purchase/report"
                            className={({ isActive }) =>
                              "block transition duration-150 truncate " +
                              (isActive
                                ? "text-violet-500"
                                : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                            }
                          >
                            <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Purchase Report
                            </span>
                          </NavLink>
                          <NavLink
                            end
                            to="/expense/report"
                            className={({ isActive }) =>
                              "block transition duration-150 truncate " +
                              (isActive
                                ? "text-violet-500"
                                : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                            }
                          >
                            <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Expense Report
                            </span>
                          </NavLink>
                          <NavLink
                            end
                            to="/stock/report"
                            className={({ isActive }) =>
                              "block transition duration-150 truncate " +
                              (isActive
                                ? "text-violet-500"
                                : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                            }
                          >
                            <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Stock Report
                            </span>
                          </NavLink>

                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>


              {/* Employees */}

              <SidebarLinkGroup activecondition={pathname.includes(" Employees")}>
                {(handleClick, open) => (
                  <>
                    <a
                      href="#0"
                      className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes(" Employees")
                        ? ""
                        : "hover:text-gray-900 dark:hover:text-white"
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                        setSidebarExpanded(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {/* Purchase Icon */}
                          <svg
                            className={`shrink-0 fill-current ${pathname.includes(" Employees")
                              ? "text-violet-500"
                              : "text-gray-400 dark:text-gray-500"
                              }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 1h10v14H3z" />
                          </svg>
                          <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            Employees
                          </span>
                        </div>
                        <div className="flex shrink-0 ml-2">
                          <svg
                            className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"
                              }`}
                            viewBox="0 0 12 12"
                          >
                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                          </svg>
                        </div>
                      </div>
                    </a>
                    <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                      <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                        <li className="mb-1 last:mb-0">
                          <NavLink
                            end
                            to="/addEmployees"
                            className={({ isActive }) =>
                              "block transition duration-150 truncate " +
                              (isActive
                                ? "text-violet-500"
                                : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                            }
                          >
                            <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Add Employees
                            </span>
                          </NavLink>
                        </li>
                        <li className="mb-1 last:mb-0">
                          <NavLink
                            end
                            to="/listEmployees"
                            className={({ isActive }) =>
                              "block transition duration-150 truncate " +
                              (isActive
                                ? "text-violet-500"
                                : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                            }
                          >
                            <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              View Employees
                            </span>
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>

              <SidebarLinkGroup activecondition={pathname.includes("Inventory&Stock")}>
                {(handleClickFirst, openFirst) => (
                  <>
                    {/* First-level: Inventory & Stock*/}
                    <a
                      href="#0"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClickFirst();
                        setSidebarExpanded(true);
                      }}
                      className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("Inventory&Stock") ? "font-medium" : "hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            className={`shrink-0 fill-current ${openFirst ? "text-violet-500" : "text-gray-400 dark:text-gray-500"}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 1h10v14H3z" />
                          </svg>
                          <span className="text-sm font-medium ml-4 duration-200">
                            Inventory & Stock

                          </span>
                        </div>
                        <svg
                          className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${openFirst ? "rotate-180" : ""
                            }`}
                          viewBox="0 0 12 12"
                        >
                          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                        </svg>
                      </div>
                    </a>

                    {/* First-level dropdown */}
                    {openFirst && (
                      <ul className="mt-1 pl-6 space-y-1">

                        {/*  Purchase Entry */}
                        <SidebarLinkGroup activecondition={pathname.includes("PurchaseEntry")}>
                          {(handleClickpu, openpu) => (
                            <li>
                              <a
                                href="#0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleClickpu();
                                }}
                                className="flex justify-between items-center text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition duration-150"
                              >
                                <span className="text-sm font-medium">  Purchase Entry</span>
                                <svg
                                  className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${openpu ? "rotate-180" : ""
                                    }`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </a>

                              {openpu && (
                                <ul className="mt-1 pl-4 space-y-1">
                                  <li>
                                    <NavLink
                                      to="/purchase/add"
                                      className={({ isActive }) =>
                                        "block text-sm font-medium truncate " +
                                        (isActive
                                          ? "text-violet-500"
                                          : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                                      }
                                    >
                                      Purchase Billing
                                    </NavLink>
                                  </li>
                                  <li>
                                    <NavLink
                                      to="/purchase/view"
                                      className={({ isActive }) =>
                                        "block text-sm font-medium truncate " +
                                        (isActive
                                          ? "text-violet-500"
                                          : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                                      }
                                    >

                                      Purchase History
                                    </NavLink>
                                  </li>
                                  <li>
                                    <NavLink
                                      to="/purchase/dues"
                                      className={({ isActive }) =>
                                        "block text-sm font-medium truncate " +
                                        (isActive
                                          ? "text-violet-500"
                                          : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                                      }
                                    >

                                      Purchases Dues
                                    </NavLink>
                                  </li>
                                </ul>
                              )}
                            </li>
                          )}
                        </SidebarLinkGroup>

                        {/* StockAdjustment */}
                        <SidebarLinkGroup activecondition={pathname.includes(" StockAdjustment")}>
                          {(handleClickSA, openSA) => (
                            <li>
                              <a
                                href="#0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleClickSA();
                                }}
                                className="flex justify-between items-center text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition duration-150"
                              >
                                <span className="text-sm font-medium"> Stock Adjustment</span>
                                <svg
                                  className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${openSA ? "rotate-180" : ""
                                    }`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </a>

                              {openSA && (
                                <ul className="mt-1 pl-4 space-y-1">
                                  <li>
                                    <NavLink
                                      to="/addAdjustment"
                                      className={({ isActive }) =>
                                        "block text-sm font-medium truncate " +
                                        (isActive
                                          ? "text-violet-500"
                                          : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                                      }
                                    >
                                      Add Adjustment
                                    </NavLink>
                                  </li>
                                  <li>
                                    <NavLink
                                      to="/viewAdjustments"
                                      className={({ isActive }) =>
                                        "block text-sm font-medium truncate " +
                                        (isActive
                                          ? "text-violet-500"
                                          : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                                      }
                                    >
                                      View Adjustments
                                    </NavLink>
                                  </li>
                                </ul>
                              )}
                            </li>
                          )}
                        </SidebarLinkGroup>

                        {/* Reports */}
                        <SidebarLinkGroup activecondition={pathname.includes("Reports")}>
                          {(handleClickrep, openrep) => (
                            <li>
                              <a
                                href="#0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleClickrep();
                                }}
                                className="flex justify-between items-center text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition duration-150"
                              >
                                <span className="text-sm font-medium">Reports</span>
                                <svg
                                  className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${openrep ? "rotate-180" : ""
                                    }`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </a>

                              {openrep && (
                                <ul className="mt-1 pl-4 space-y-1">
                                  <li>
                                    <NavLink
                                      to="/stockStatus"
                                      className={({ isActive }) =>
                                        "block text-sm font-medium truncate " +
                                        (isActive
                                          ? "text-violet-500"
                                          : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                                      }
                                    >
                                      Stock Status Report
                                    </NavLink>
                                  </li>
                                  <li>
                                    <NavLink
                                      to="/lowStockAlert"
                                      className={({ isActive }) =>
                                        "block text-sm font-medium truncate " +
                                        (isActive
                                          ? "text-violet-500"
                                          : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                                      }
                                    >
                                      Low Stock Alerts
                                    </NavLink>
                                  </li>
                                  <li>
                                    <NavLink
                                      to="/expiryReport"
                                      className={({ isActive }) =>
                                        "block text-sm font-medium truncate " +
                                        (isActive
                                          ? "text-violet-500"
                                          : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                                      }
                                    >
                                      Expiry Reports
                                    </NavLink>
                                  </li>
                                </ul>
                              )}
                            </li>
                          )}
                        </SidebarLinkGroup>



                      </ul>
                    )}
                  </>
                )}
              </SidebarLinkGroup>

<SidebarLinkGroup activecondition={pathname.includes("Employees")}>
  {(handleClickFirst, openFirst) => (
    <>
      {/* First-level: Employee & Staff Management */}
      <a
        href="#0"
        onClick={(e) => {
          e.preventDefault();
          handleClickFirst();
          setSidebarExpanded(true);
        }}
        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
          pathname.includes("Employees") ? "font-medium" : "hover:text-gray-900 dark:hover:text-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className={`shrink-0 fill-current ${openFirst ? "text-violet-500" : "text-gray-400 dark:text-gray-500"}`}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M3 1h10v14H3z" />
            </svg>
            <span className="text-sm font-medium ml-4 duration-200">
              Employee & Staff Management
            </span>
          </div>
          <svg
            className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${
              openFirst ? "rotate-180" : ""
            }`}
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </a>

      {/* First-level dropdown */}
      {openFirst && (
        <ul className="mt-1 pl-6 space-y-1">
          {/* Employee Records */}
          <SidebarLinkGroup activecondition={pathname.includes("EmployeeRecords")}>
            {(handleClickER, openER) => (
              <li>
                <a
                  href="#0"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClickER();
                  }}
                  className="flex justify-between items-center text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition duration-150"
                >
                  <span className="text-sm font-medium">Employee Records</span>
                  <svg
                    className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${
                      openER ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 12 12"
                  >
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </a>

                {openER && (
                  <ul className="mt-1 pl-4 space-y-1">
                    <li>
                      <NavLink
                        to="/addEmployees"
                        className={({ isActive }) =>
                          "block text-sm font-medium truncate " +
                          (isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                      >
                        Add Employee
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/listEmployees"
                        className={({ isActive }) =>
                          "block text-sm font-medium truncate " +
                          (isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                      >
                        List Employee
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </SidebarLinkGroup>

          {/* Attendance */}
          <SidebarLinkGroup activecondition={pathname.includes("Attendance")}>
            {(handleClickAtt, openAtt) => (
              <li>
                <a
                  href="#0"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClickAtt();
                  }}
                  className="flex justify-between items-center text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition duration-150"
                >
                  <span className="text-sm font-medium">Attendance</span>
                  <svg
                    className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${
                      openAtt ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 12 12"
                  >
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </a>

                {openAtt && (
                  <ul className="mt-1 pl-4 space-y-1">
                    <li>
                      <NavLink
                        to="/dailyAttendance"
                        className={({ isActive }) =>
                          "block text-sm font-medium truncate " +
                          (isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                      >
                        Daily Attendance
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/attendanceReport"
                        className={({ isActive }) =>
                          "block text-sm font-medium truncate " +
                          (isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                      >
                        Attendance Report
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </SidebarLinkGroup>

          {/* shift */}
           <SidebarLinkGroup activecondition={pathname.includes("shiftManagement")}>
            {(handleClickShi, openShi) => (
              <li>
                <a
                  href="#0"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClickShi();
                  }}
                  className="flex justify-between items-center text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition duration-150"
                >
                  <span className="text-sm font-medium">Shift Management</span>
                  <svg
                    className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${
                      openShi ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 12 12"
                  >
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </a>

                {openShi && (
                  <ul className="mt-1 pl-4 space-y-1">
                    <li>
                      <NavLink
                        to="/addShift"
                        className={({ isActive }) =>
                          "block text-sm font-medium truncate " +
                          (isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                      >
                        Shift Setup
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/shift"
                        className={({ isActive }) =>
                          "block text-sm font-medium truncate " +
                          (isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                      >
                        Shift Roster
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </SidebarLinkGroup>
          
          {/* leave management */}
           <SidebarLinkGroup activecondition={pathname.includes("leaveManagement")}>
            {(handleClickLev, openLev) => (
              <li>
                <a
                  href="#0"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClickLev();
                  }}
                  className="flex justify-between items-center text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition duration-150"
                >
                  <span className="text-sm font-medium">Leave Management</span>
                  <svg
                    className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${
                      openLev ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 12 12"
                  >
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </a>

                {openLev && (
                  <ul className="mt-1 pl-4 space-y-1">
                    <li>
                      <NavLink
                        to="/addLeave"
                        className={({ isActive }) =>
                          "block text-sm font-medium truncate " +
                          (isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                      >
                       Leave Request
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/leave"
                        className={({ isActive }) =>
                          "block text-sm font-medium truncate " +
                          (isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                      >
                       Leave Records
                      </NavLink>
                           <NavLink
                        to="/addHoliday"
                        className={({ isActive }) =>
                          "block text-sm font-medium truncate " +
                          (isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                      >
                      Add Holiday 
                      </NavLink>
                      <NavLink
                        to="/holidays"
                        className={({ isActive }) =>
                          "block text-sm font-medium truncate " +
                          (isActive
                            ? "text-violet-500"
                            : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                      >
                       Holiday Calendar
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </SidebarLinkGroup>
        </ul>
      )}
    </>
  )}
</SidebarLinkGroup>

{/* ================= Accounts Module ================= */}
<SidebarLinkGroup activecondition={pathname.includes("accounts")}>
  {(handleClickAcc, openAcc) => (
    <>
      <a
        href="#0"
        onClick={(e) => {
          e.preventDefault();
          handleClickAcc();
          setSidebarExpanded(true);
        }}
        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
          pathname.includes("accounts")
            ? "font-medium"
            : "hover:text-gray-900 dark:hover:text-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className={`shrink-0 fill-current ${
                openAcc
                  ? "text-violet-500"
                  : "text-gray-400 dark:text-gray-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M3 1h10v14H3z" />
            </svg>
            <span className="text-sm font-medium ml-4 duration-200">
              Accounts
            </span>
          </div>
          <svg
            className={`w-3 h-3 shrink-0 fill-current text-gray-400 dark:text-gray-500 transition-transform ${
              openAcc ? "rotate-180" : ""
            }`}
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </a>

      {openAcc && (
        <ul className="mt-1 pl-6 space-y-1">
          <li>
            <NavLink
              to="/accounts/ledger"
              className={({ isActive }) =>
                "block text-sm font-medium truncate " +
                (isActive
                  ? "text-violet-500"
                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
              }
            >
             Ledger Transactions
            </NavLink>
          </li>
           <li>
            <NavLink
              to="/accounts/AllLedger"
              className={({ isActive }) =>
                "block text-sm font-medium truncate " +
                (isActive
                  ? "text-violet-500"
                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
              }
            >
              Ledger Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/accounts/journal-vouchers"
              className={({ isActive }) =>
                "block text-sm font-medium truncate " +
                (isActive
                  ? "text-violet-500"
                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
              }
            >
              Journal Vouchers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/accounts/trial-balance"
              className={({ isActive }) =>
                "block text-sm font-medium truncate " +
                (isActive
                  ? "text-violet-500"
                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
              }
            >
              Trial Balance
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/accounts/daybook"
              className={({ isActive }) =>
                "block text-sm font-medium truncate " +
                (isActive
                  ? "text-violet-500"
                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
              }
            >
              Daybook
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/accounts/profiles"
              className={({ isActive }) =>
                "block text-sm font-medium truncate " +
                (isActive
                  ? "text-violet-500"
                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
              }
            >
              Account Profiles
            </NavLink>
          </li>
        </ul>
      )}
    </>
  )}
</SidebarLinkGroup>

              {/* Settings */}
              <SidebarLinkGroup activecondition={pathname.includes("settings")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("settings") ? "" : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className={`shrink-0 fill-current ${pathname.includes('settings') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                              <path d="M10.5 1a3.502 3.502 0 0 1 3.355 2.5H15a1 1 0 1 1 0 2h-1.145a3.502 3.502 0 0 1-6.71 0H1a1 1 0 0 1 0-2h6.145A3.502 3.502 0 0 1 10.5 1ZM9 4.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM5.5 9a3.502 3.502 0 0 1 3.355 2.5H15a1 1 0 1 1 0 2H8.855a3.502 3.502 0 0 1-6.71 0H1a1 1 0 1 1 0-2h1.145A3.502 3.502 0 0 1 5.5 9ZM4 12.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" fillRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Settings
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/myProfile"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                My Profile
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/updateProfile"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Update Profile
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="https://cruip.com/mosaic/"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                My Notifications
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/financialYear"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Financial Year
                              </span>
                            </NavLink>
                          </li>

                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/units"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Unit
                              </span>
                            </NavLink>
                          </li>

                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/taxBands"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Tax Bands
                              </span>
                            </NavLink>
                          </li>


                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="https://cruip.com/mosaic/"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Give Feedback
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
          {/* More group */}
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">More</span>
            </h3>
            <ul className="mt-3">
              {/* Authentication */}
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${open ? "" : "hover:text-gray-900 dark:hover:text-white"}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className={`shrink-0 fill-current text-gray-400 dark:text-gray-500`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                              <path d="M11.442 4.576a1 1 0 1 0-1.634-1.152L4.22 11.35 1.773 8.366A1 1 0 1 0 .227 9.634l3.281 4a1 1 0 0 0 1.59-.058l6.344-9ZM15.817 4.576a1 1 0 1 0-1.634-1.152l-5.609 7.957a1 1 0 0 0-1.347 1.453l.656.8a1 1 0 0 0 1.59-.058l6.344-9Z" />
                            </svg>
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Authentication
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink end to="https://cruip.com/mosaic/ dark:hover:text-gray-200 transition duration-150 truncate">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Sign in
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink end to="https://cruip.com/mosaic/ dark:hover:text-gray-200 transition duration-150 truncate">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Sign up
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <NavLink end to="https://cruip.com/mosaic/ hover:text-gray-700 dark:hover:text-gray-200 transition duration-150 truncate">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Reset Password
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Sidebar;