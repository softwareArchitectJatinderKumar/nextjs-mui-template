import React from 'react';
import { 
  FileSpreadsheet, Download, Upload, CreditCard, 
  Search, Filter, ExternalLink, AlertCircle 
} from 'lucide-react';

interface ViewBookingsUIProps {
  loading: boolean;
  bookings: any[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onExport: () => void;
  onDownload: (url: string) => void;
  onPayment: (booking: any) => void;
  onUploadReceipt: (bookingId: string) => void;
}

const ViewBookingsUI: React.FC<ViewBookingsUIProps> = ({
  loading, bookings, searchTerm, onSearch, onExport, onDownload, onPayment, onUploadReceipt
}) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-vh-100 bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment & Booking Details</h1>
          <p className="text-gray-500 text-sm">Manage your instrument bookings and track payment status.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onExport}
            className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all text-sm font-medium"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by Instrument or Booking ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-600 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Booking Info</th>
                <th className="px-6 py-4">Instrument / Analysis</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length > 0 ? bookings.map((item) => (
                <tr key={item.bookingId} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">#{item.bookingId}</div>
                    <div className="text-xs text-gray-500">{item.bookingDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">{item.instrumentName}</div>
                    <div className="text-xs text-gray-500">{item.analysisType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">₹{item.totalCharges}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => onDownload(item.filePath)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {item.paymentStatus !== 'Paid' && (
                        <button 
                          onClick={() => onPayment(item)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Pay Now"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => onUploadReceipt(item.bookingId)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Upload Receipt"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewBookingsUI;