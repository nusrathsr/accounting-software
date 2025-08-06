import React from 'react';
import Sidebar from '../partials/Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen">
      
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area on the right */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto p-6">
        {children}
      </div>
    </div>
  );
}
