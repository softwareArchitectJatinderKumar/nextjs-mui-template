"use client";

import { Download, CreditCard, Upload, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const BookingTable = ({ data, onExport, onSearch, onPayment, onUpload, pagination }: any) => {
  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden">
      {/* Search & Export Bar */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <button onClick={onExport} className="bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-800">
          <Download size={16} /> Export
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid / Table */}
      <table className="w-full text-left">
        <thead className="bg-slate-800 text-white text-sm">
          <tr>
            <th className="p-4">Booking ID</th>
            <th className="p-4">Instrument</th>
            <th className="p-4 text-center">Payment</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((item: any) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="p-4 font-mono">{item.bookingId}</td>
              <td className="p-4">
                <div className="font-bold">{item.instrumentName}</div>
                <div className="text-xs text-gray-500">{item.analysisType}</div>
              </td>
              <td className="p-4 text-center">
                {/* Logic for Payment Button Appearance */}
                {!item.paymentStatus ? (
                  <button onClick={() => onPayment(item)} className="text-blue-600 hover:scale-110 transition">
                    <CreditCard size={24} />
                  </button>
                ) : (
                  <span className="text-xs font-bold uppercase text-green-600">Paid</span>
                )}
              </td>
              <td className="p-4 text-center">
                <button onClick={() => onUpload(item)} className="bg-slate-200 p-2 rounded-full hover:bg-slate-300">
                  <Upload size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div className="p-4 flex justify-between items-center border-t">
        <div className="flex items-center gap-2">
          <button 
            disabled={pagination.current === 1}
            onClick={() => pagination.onPageChange(pagination.current - 1)}
            className="p-2 border rounded disabled:opacity-20"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm">Page {pagination.current} of {pagination.total}</span>
          <button 
            disabled={pagination.current === pagination.total}
            onClick={() => pagination.onPageChange(pagination.current + 1)}
            className="p-2 border rounded disabled:opacity-20"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <select 
          className="border rounded p-1 text-sm"
          onChange={(e) => pagination.onLimitChange(Number(e.target.value))}
        >
          <option value="5">5 / page</option>
          <option value="10">10 / page</option>
        </select>
      </div>
    </div>
  );
};