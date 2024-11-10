import React from 'react';
import { Search, BarChart2, Settings } from 'lucide-react';

const DashboardUI = () => {
  const tableData = [
    { id: '001', nama: 'Lorem Ipsum', jenis: 'Regular', stock: 120, status: 'Active' },
    { id: '002', nama: 'Samyang 2x', jenis: 'Premium', stock: 80, status: 'Active' },
    { id: '003', nama: 'Paket', jenis: 'Promo', stock: 53, status: 'Active' },
    { id: '004', nama: 'Salad', jenis: 'Regular', stock: 15, status: 'Active' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 bg-green-500 text-white font-bold text-xl">
          GOJOL
        </div>
        <nav className="mt-6">
          <div className="px-4 py-3 text-gray-700 bg-gray-100 rounded-lg mx-3 cursor-pointer">
            Dashboard
          </div>
          <div className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg mx-3 cursor-pointer flex items-center">
            <BarChart2 className="mr-2" size={18} />
            Statistik
          </div>
          <div className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg mx-3 cursor-pointer flex items-center">
            <Settings className="mr-2" size={18} />
            Setting
          </div>
        </nav>
        <div className="absolute bottom-0 p-4 w-64 bg-gray-200">
          COPYWRITE
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4">
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Customer</button>
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Driver</button>
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Sales</button>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Nama Barang</th>
                  <th className="pb-3">Jenis</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-3">{item.id}</td>
                    <td className="py-3">{item.nama}</td>
                    <td className="py-3">{item.jenis}</td>
                    <td className="py-3">{item.stock}</td>
                    <td className="py-3">
                      <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm mr-2">Edit</button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4 text-sm">
              <div>Showing 1 to 4 of 4 entries</div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border rounded-lg">Previous</button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded-lg">1</button>
                <button className="px-3 py-1 border rounded-lg">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;