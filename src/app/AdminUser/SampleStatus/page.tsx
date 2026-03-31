"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Download, FileSpreadsheet, Search, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import styles from './SampleStatus.module.css';
import myAppWebService from '@/services/myAppWebService';


// export default function SampleStatusPage() {
//   // State
//   const [loading, setLoading] = useState(true);
//   const [proofData, setProofData] = useState<any[]>([]);
//   const [bookingTests, setBookingTests] = useState<any[]>([]);
//   const [sampleStatuses, setSampleStatuses] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
  
//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState<any>(null);
//   const [assignedTo, setAssignedTo] = useState('');
//   const [receivedDate, setReceivedDate] = useState('');

//   useEffect(() => {
//     initData();
//   }, []);

//   const initData = async () => {
//     setLoading(true);
//     try {
//       const [proofRes, testsRes, statusRes] = await Promise.all([
//         myAppWebService.GetBookingPaymentProofDetails('0'), 
//         myAppWebService.GetAllBookingTests(),
//         myAppWebService.GetAllSampleStatus() 
//       ]);
//       setProofData(proofRes.item1 || []);
//       setBookingTests(testsRes.item1 || []);
//       setSampleStatuses(statusRes.item1 || []);
//     } catch (error) {
//       console.error("Initialization failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper: Check if Action is Applied
//   const isStatusDisabled = (bookingId: string, instrumentId: string) => {
//     return sampleStatuses.some(
//       s => String(s.bookingId) === String(bookingId) && String(s.instrumentId) === String(instrumentId)
//     );
//   };

//   // Filtering Logic
//   const filteredData = useMemo(() => {
//     const query = searchQuery.toLowerCase().trim();
//     if (!query) return bookingTests;
//     return bookingTests.filter(item => 
//       Object.values(item).some(val => String(val).toLowerCase().includes(query))
//     );
//   }, [bookingTests, searchQuery]);

//   // Pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
//   const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const handleUpdateStatus = async () => {
//     if (!receivedDate || !assignedTo) return;
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('BookingId', selectedBooking.bookingId);
//     formData.append('InstrumentId', selectedBooking.instrumentId);
//     formData.append('SampleCondition', assignedTo);
//     formData.append('ReceivedOn', receivedDate);

//     try {
//       const res = await myAppWebService.NewSAmpleStatus(formData);
//       const msg = res.item1?.[0]?.msg;
//       if (msg === 'Success') {
//         Swal.fire('Updated!', 'Sample status updated successfully', 'success');
//         setIsModalOpen(false);
//         initData(); // Refresh grid
//       } else {
//         Swal.fire('Info', msg || 'Update failed', 'info');
//       }
//     } catch (error) {
//       Swal.fire('Error', 'Server error occurred', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       {loading && <div className={styles.loaderOverlay}><Loader2 className="animate-spin" size={48} /></div>}

//       <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
//         <h2 className="text-2xl font-bold text-center text-blue-800 mb-8">Update Sample Status</h2>
        
//         {/* Toolbar */}
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//           <button onClick={() => {/* Excel Export Logic */}} className={styles.btnDark}>
//             <FileSpreadsheet size={18} /> Export to Excel
//           </button>
          
//           <div className="relative w-full md:w-80">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search records..." 
//               className={styles.input}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Data Table */}
//         <div className="overflow-x-auto border rounded-lg">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="p-4 font-semibold text-gray-600">Candidate</th>
//                 <th className="p-4 font-semibold text-gray-600">Instrument</th>
//                 <th className="p-4 font-semibold text-gray-600">Request Date</th>
//                 <th className="p-4 font-semibold text-gray-600 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {paginatedData.map((row, i) => (
//                 <tr key={i} className="hover:bg-blue-50/30 transition-colors">
//                   <td className="p-4">
//                     <div className="font-bold">{row.candidateName || 'Internal User'}</div>
//                     <div className="text-xs text-gray-500">{row.userEmailId}</div>
//                   </td>
//                   <td className="p-4">{row.instrumentName}</td>
//                   <td className="p-4 text-sm">{new Date(row.bookingRequestDate).toLocaleDateString()}</td>
//                   <td className="p-4 text-center">
//                     {!isStatusDisabled(row.bookingId, row.instrumentId) ? (
//                       <button 
//                         onClick={() => { setSelectedBooking(row); setIsModalOpen(true); }}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                       >
//                         <AlertCircle size={20} />
//                       </button>
//                     ) : (
//                       <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Applied</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="mt-6 flex items-center justify-between">
//           <div className="text-sm text-gray-500">Total Records: {filteredData.length}</div>
//           <div className="flex items-center gap-4">
//             <button 
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage(prev => prev - 1)}
//               className={styles.paginationBtn}
//             ><ChevronLeft size={18} /></button>
//             <span className="font-medium text-blue-700">{currentPage} / {totalPages}</span>
//             <button 
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage(prev => prev + 1)}
//               className={styles.paginationBtn}
//             ><ChevronRight size={18} /></button>
//           </div>
//         </div>
//       </div>

//       {/* Update Modal */}
//       {isModalOpen && (
//         <div className={styles.modalBackdrop}>
//           <div className={styles.modalContent}>
//             <h3 className="text-xl font-bold mb-4">Update Status</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Sample Condition</label>
//                 <select 
//                   className={styles.input}
//                   value={assignedTo}
//                   onChange={(e) => setAssignedTo(e.target.value)}
//                 >
//                   <option value="">Select Status</option>
//                   <option value="Poor">Poor</option>
//                   <option value="Good">Good</option>
//                   <option value="Average">Average</option>
//                   <option value="Excellent">Excellent</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Received Date</label>
//                 <input 
//                   type="date" 
//                   className={styles.input}
//                   value={receivedDate}
//                   onChange={(e) => setReceivedDate(e.target.value)}
//                 />
//               </div>
//               <div className="flex gap-2 justify-end mt-6">
//                 <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
//                 <button 
//                   onClick={handleUpdateStatus}
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//                   disabled={!assignedTo || !receivedDate}
//                 >Update</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import StatusModal from './StatusModal';
import { useRouter } from 'next/router';
import StatusModal from './StatusModal';

const AdminUpdateSampleStatus = () => {
  // const router = useRouter();
  
  // State Management
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [testsRes, statusRes] = await Promise.all([
          myAppWebService.GetAllBookingTests(),
          myAppWebService.GetAllSampleStatus()
        ]);
        setAllData(testsRes?.item1 || []);
        setStatusData(statusRes?.item1 || []);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchData();
  }, []);

  // Filtering Logic
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allData;
    return allData.filter(item => 
      Object.values(item).some(val => String(val).toLowerCase().includes(query))
    );
  }, [searchQuery, allData]);

  // Pagination Logic
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredData.length / (itemsPerPage as number));
  const currentTableData = useMemo(() => {
    if (itemsPerPage === 'all') return filteredData;
    const start = (currentPage - 1) * (itemsPerPage as number);
    return filteredData.slice(start, start + (itemsPerPage as number));
  }, [filteredData, currentPage, itemsPerPage]);

  const isStatusDisabled = (bookingId: any, instrumentId: any) => {
    return statusData.some(s => String(s.bookingId) === String(bookingId) && String(s.instrumentId) === String(instrumentId));
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(allData.map(item => ({
      EmailId: item.userEmailId,
      CandidateName: item.candidateName || 'Internal User',
      Instrument: item.instrumentName,
      BookingDate: item.bookingRequestDate
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "Assigned_Details_report.xlsx");
  };

  if (loading) return <div className={styles.fullscreenLoader}><img src="/assets/images/spinner.gif" alt="Loading..." /></div>;

  return (
    <div className="container-fluid">
      <div className="card shadow-sm mt-4">
        <div className="card-body">
          {/* Header Controls */}
          <div className="row mb-4 align-items-center">
            <div className="col-md-4">
              <button className="btn btn-dark" onClick={handleExport} disabled={filteredData.length === 0}>Export to Excel</button>
            </div>
            <div className="col-md-4 text-center"><h2>Update Sample Status</h2></div>
            <div className="col-md-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>

          {filteredData.length > 0 ? (
            <>
              {/* Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className={styles.recordBadge}>Total Records: {filteredData.length}</span>
                <div className="d-flex align-items-center gap-2">
                  {/* <select className="form-select w-auto" onChange={(e) => setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
                    <option value="5">5</option>
                    <option value="10" selected>10</option>
                    <option value="all">All</option>
                  </select> */}

                  <select
                    className="form-select w-auto"
                    // Link the value to your state variable
                    value={itemsPerPage}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItemsPerPage(val === 'all' ? 'all' : Number(val));
                      setCurrentPage(1); // Reset to first page when changing limit
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="all">All</option>
                  </select>
                  <div className="btn-group">
                    <button className="btn btn-outline-primary" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Prev</button>
                    <span className="btn btn-light disabled">{currentPage} / {totalPages}</span>
                    <button className="btn btn-outline-primary" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Instrument</th>
                      <th>Request Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTableData.map((row, idx) => (
                      <tr key={row.bookingId || idx}>
                        <td>{row.candidateName || 'Internal User'}</td>
                        <td>{row.instrumentName}</td>
                        <td>{new Date(row.bookingRequestDate).toLocaleDateString()}</td>
                        <td>
                          {isStatusDisabled(row.bookingId, row.instrumentId) ? (
                            <span className="text-danger">Action Applied</span>
                          ) : (
                            <button className="btn btn-danger" onClick={() => { setSelectedBooking(row); setIsModalOpen(true); }}>
                              <i className="bi bi-exclamation-circle"></i> Update
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="alert alert-info text-center">No Records Found</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <StatusModal 
          data={selectedBooking} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={() => window.location.reload()} 
        />
      )}
    </div>
  );
};

export default AdminUpdateSampleStatus;