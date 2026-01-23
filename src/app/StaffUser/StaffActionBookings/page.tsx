'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import myAppWebService from '@/services/myAppWebService';

interface BookingData {
  id: number;
  bookingId: string;
  userEmailId: string;
  uploadedResult: string;
  filePath: string;
  instrumentName: string;
  instrumentId: string;
  testUserId: string;
  testDate: string;
  testSampleFile: string;
  mobileNumber: string;
  userRole: string;
  paymentStatus?: string | null;
}

export default function StaffActionBookings() {
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState<BookingData[]>([]);
  const [filteredData, setFilteredData] = useState<BookingData[]>([]);
  const [bookingResults, setBookingResults] = useState<BookingData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [fileName, setFileName] = useState('');
  const [remarks, setRemarks] = useState('');

  const serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';

  // 1. Initial Data Fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const [bookings, results] = await Promise.all([
        myAppWebService.GetAllBooking(),
        myAppWebService.GetUploadedResultDetails('33476')
      ]);

      const bookingList = bookings?.item1 || bookings || [];
      setOriginalData(bookingList);
      setFilteredData(bookingList);

      if (Array.isArray(results)) {
        setBookingResults(results);
      } else if (results && Array.isArray(results.item1)) {
        setBookingResults(results.item1);
      } else {
        setBookingResults([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      const elapsed = Date.now() - startTime;
      // FIXED: Changed 123500 to 1500ms (1.5 seconds)
      const delay = Math.max(1500 - elapsed, 0);
      setTimeout(() => setLoading(false), delay);
    }
  };

  // 2. Filter Logic
  useEffect(() => {
    let data = [...originalData];
    if (selectedStatus) {
      data = data.filter(item => {
        if (selectedStatus === 'null') return !item.paymentStatus || item.paymentStatus === 'null';
        return item.paymentStatus === selectedStatus;
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(item =>
        Object.values(item).some(val => String(val).toLowerCase().includes(q))
      );
    }
    setFilteredData(data);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, originalData]);

  // 3. New Pagination Handler with Loader
  const handlePageChange = (direction: 'next' | 'prev') => {
    setLoading(true);
    // Simulate a brief loading state for UX
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentPage(prev => prev + 1);
      } else {
        setCurrentPage(prev => prev - 1);
      }
      setLoading(false);
    }, 500); // 0.5 second loader for page switch
  };

  const isResultUploaded = (bookingId: string | number) => {
    if (!Array.isArray(bookingResults)) return false;
    return bookingResults.some(r =>
      r.bookingId?.toString() === bookingId?.toString() &&
      r.uploadedResult &&
      r.uploadedResult !== '-NA-'
    );
  };

  // 2. Updated Filter Logic with Loader for Status Change
  const handleStatusChange = (status: string) => {
    setLoading(true);
    setSelectedStatus(status);
    
    // Artificial delay so the user sees the filter being applied
    setTimeout(() => {
      let data = [...originalData];
      if (status) {
        data = data.filter(item => {
          if (status === 'null') return !item.paymentStatus || item.paymentStatus === 'null';
          return item.paymentStatus === status;
        });
      }
      
      // Apply search filter if search query exists
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        data = data.filter(item =>
          Object.values(item).some(val => String(val).toLowerCase().includes(q))
        );
      }

      setFilteredData(data);
      setCurrentPage(1);
      setLoading(false);
    }, 600); 
  };
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  
  const handleUpload = async () => {
    if (!fileData) return Swal.fire('Error', 'Please select a file', 'error');
    
    setLoading(true);
    try {
      const auth = JSON.parse(Cookies.get('StaffUserAuthData') || '{}');
      const formData = new FormData();
      formData.append('BookingId', selectedBooking.bookingId);
      formData.append('UserEmailId', selectedBooking.userId);
      formData.append('CreatedBy', auth.UserId);
      formData.append('FilePath', fileName);
      formData.append('File', fileData); // Sending as base64 string per your TS logic

      const res = await myAppWebService.CIFResultsUploads(formData);
      if (res?.item1?.[0]?.msg === 'Success') {
        Swal.fire('Success', 'Uploaded successfully', 'success').then(() => window.location.reload());
      } else {
        Swal.fire('Error', 'Already uploaded or failed', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'File size exceeds 5MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setFileData(base64);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      {/* LOADER OVERLAY */}
  
      {loading && (
        <div className="fullScreenLoader"  >
          <div className="customSpinnerOverlay text-center">
            <img src="/assets/images/spinner.gif" alt="Loading..."  />
            <div className="mt-2 fw-bold text-dark">Please wait...</div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="bgDarkYellow shadow-sm border-0 mb-4 rounded">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold py-2 border-y">Upload Result Page</h2>
          </div>
        </div>

        {/* Filters Area */}
        <div className="row d-flex gap-4 mb-4 items-center justify-center bgDarkYellow p-3 rounded mx-0">
          <div className='col-md-2 text-center'>
            <button
              onClick={() => exportToExcel(filteredData, isResultUploaded)}
              className="btn btn-info text-white shadow-sm"
            >
              Export to Excel
            </button>
          </div>
          <div className='col-md-3'>
            <select
              className="form-select"
              value={selectedStatus}
              // onChange={(e) => setSelectedStatus(e.target.value)}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="">-- All Payments --</option>
              <option value="success">Paid Payments</option>
              <option value="failure">Failed Payments</option>
              <option value="null">Pending Payments</option>
            </select>
          </div>
          <div className='col-md-3'>
            <input
              type="text"
              className="form-control"
              placeholder="Search all columns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="table-responsive rounded shadow-sm bg-white">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Booking Id</th>
                <th>Instrument</th>
                <th>Samples</th>
                <th>Charges</th>
                <th>Request Sheet</th>
                <th>User Details</th>
                <th>Payment</th>
                <th>Result Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="font-bold">{item.bookingId}</td>
                  <td>{item.instrumentName}</td>
                  <td>{item.noOfSamples}</td>
                  <td>{item.totalCharges && item.totalCharges !== 'null' ? `₹${item.totalCharges}` : 'NA'}</td>
                  <td>
                    {item.fileName ? (
                      <button onClick={() => window.open(serverUrl + item.fileName, '_blank')} className="btn btn-sm btn-info text-white">
                        Download
                      </button>
                    ) : <span className="badge bg-secondary">N/A</span>}
                  </td>
                  <td className="text-xs">
                    <div className="fw-bold">{item.candidateName || 'Internal'}</div>
                    <div className="text-muted">{item.userId}</div>
                  </td>
                  <td>
                    <span className={`badge ${item.paymentStatus === 'success' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {item.paymentStatus === 'success' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${isResultUploaded(item.bookingId) ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {isResultUploaded(item.bookingId) ? 'Uploaded' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {item.paymentStatus === 'success' ? (
                      <button
                        onClick={() => { setSelectedBooking(item); setOpenModal(true); }}
                        className="btn btn-primary btn-sm"
                      >
                        Upload
                      </button>
                    ) : <span className="text-muted small">N/A</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between p-4 align-items-center bg-light border-top">
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => handlePageChange('prev')}
              className="btn btn-outline-secondary px-4"
            >
              &larr; Prev
            </button>
            <span className="fw-bold">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredData.length / itemsPerPage))}
            </span>
            <button
              disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage) || loading}
              onClick={() => handlePageChange('next')}
              className="btn btn-outline-secondary px-4"
            >
              Next &rarr;
            </button>
          </div>

          
       {/* Upload Modal */}
         <Modal open={openModal} onClose={() => setOpenModal(false)}>
           <Box sx={modalStyle}>
             <Typography variant="h6" className="mb-4">Result Upload Screen</Typography>
             <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
               <div><strong>Booking ID:</strong> {selectedBooking?.bookingId}</div>
               <div><strong>Instrument:</strong> {selectedBooking?.instrumentName}</div>
             </div>
             <input type="file" className="form-control mb-2" accept=".zip,.7z,.rar" onChange={handleFileChange} />
             <p className="text-xs text-orange-600 mb-4">Allowed: Zip, 7z, Rar (Max 5MB)</p>
             <TextField
               fullWidth
               multiline
               rows={4}
               label="Remarks"
               value={remarks}
               onChange={(e) => setRemarks(e.target.value)}
               className="mb-4"
             />
             <div className="flex justify-end gap-2">
               <Button variant="outlined" onClick={() => setOpenModal(false)}>Cancel</Button>
               <Button variant="contained" color="primary" onClick={handleUpload}>Upload Result</Button>
             </div>
           </Box>
         </Modal>
        </div>
      </div>
    </>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const exportToExcel = (data: any[], resultChecker: Function) => {
  const exportedData = data.map(item => ({
    BookingId: item.bookingId,
    Instrument: item.instrumentName,
    Samples: item.noOfSamples,
    Status: resultChecker(item.bookingId) ? 'Uploaded' : 'Pending'
  }));
  const ws = XLSX.utils.json_to_sheet(exportedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bookings");
  XLSX.writeFile(wb, "AssignedResults_Report.xlsx");
};

//  'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import Cookies from 'js-cookie';
// import Swal from 'sweetalert2';
// import * as XLSX from 'xlsx';
// import { Modal, Box, Typography, Button, TextField } from '@mui/material';
// import myAppWebService from '@/services/myAppWebService';
// interface BookingData {
//   id: number;
//   bookingId: string;
//   userEmailId: string;
//   uploadedResult: string;
//   filePath: string;
//   instrumentName: string;
//   instrumentId: string;
//   testUserId: string;
//   testDate: string;
//   testSampleFile: string;
//   mobileNumber: string;
//   userRole: string;
//   paymentStatus?: string | null; // Note: This field is missing in your sample JSON
// }

// export default function StaffActionBookings() {
//   // State Management
//   const [loading, setLoading] = useState(false);
//   const [originalData, setOriginalData] = useState<BookingData[]>([]);
//   const [filteredData, setFilteredData] = useState<BookingData[]>([]);
//   const [bookingResults, setBookingResults] = useState<BookingData[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Modal State
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState<any>(null);
//   const [fileData, setFileData] = useState<any>(null);
//   const [fileName, setFileName] = useState('');
//   const [remarks, setRemarks] = useState('');

//   const serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';

//   // 1. Initial Data Fetch
//   useEffect(() => {
//     fetchInitialData();
//   }, []);

   
//   const fetchInitialData = async () => {
//   setLoading(true);
//   const startTime = Date.now();
//   try {
//     const [bookings, results] = await Promise.all([
//       myAppWebService.GetAllBooking(),
//       myAppWebService.GetUploadedResultDetails('33476')
//     ]);

//     // Handle Bookings Data
//     const bookingList = bookings?.item1 || bookings || []; 
//     setOriginalData(bookingList);
//     setFilteredData(bookingList);

//     // Handle Results Data - FIX IS HERE
//     // If 'results' is an array, use it. If it has 'item1', use that.
//     if (Array.isArray(results)) {
//       setBookingResults(results);
//     } else if (results && Array.isArray(results.item1)) {
//       setBookingResults(results.item1);
//     } else {
//       setBookingResults([]);
//     }

//   } catch (error) {
//     console.error("Fetch Error:", error);
//     setBookingResults([]);
//   } finally {
//       // Maintaining your minimum 2.5s delay logic from Angular
//       const elapsed = Date.now() - startTime;
//       const delay = Math.max(123500 - elapsed, 0);
//       setTimeout(() => setLoading(false), delay);
//     }
  
// };

//   // 2. Filter Logic (Memoized for performance)
//   useEffect(() => {
//     setLoading(true);
//     let data = [...originalData];

//     if (selectedStatus) {
//       data = data.filter(item => {
//         if (selectedStatus === 'null') return !item.paymentStatus || item.paymentStatus === 'null';
//         return item.paymentStatus === selectedStatus;
//       });
//     }

//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       data = data.filter(item => 
//         Object.values(item).some(val => String(val).toLowerCase().includes(q))
//       );
//     }

//     setFilteredData(data);
//     setCurrentPage(1);
//     setLoading(false);
//   }, [searchQuery, selectedStatus, originalData]);

//   // 3. Helper Functions
//  const isResultUploaded = (bookingId: string | number) => {
//   // 1. Check if it's actually an array
//   if (!Array.isArray(bookingResults)) return false;

//   return bookingResults.some(r => 
//     // 2. Ensure types match (convert both to string to be safe)
//     r.bookingId?.toString() === bookingId?.toString() && 
//     r.uploadedResult && 
//     r.uploadedResult !== '-NA-'
//   );
// };
 

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         Swal.fire('Error', 'File size exceeds 5MB', 'warning');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64 = (reader.result as string).split(',')[1];
//         setFileData(base64);
//         setFileName(file.name);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUpload = async () => {
//     if (!fileData) return Swal.fire('Error', 'Please select a file', 'error');
    
//     setLoading(true);
//     try {
//       const auth = JSON.parse(Cookies.get('StaffUserAuthData') || '{}');
//       const formData = new FormData();
//       formData.append('BookingId', selectedBooking.bookingId);
//       formData.append('UserEmailId', selectedBooking.userId);
//       formData.append('CreatedBy', auth.UserId);
//       formData.append('FilePath', fileName);
//       formData.append('File', fileData); // Sending as base64 string per your TS logic

//       const res = await myAppWebService.CIFResultsUploads(formData);
//       if (res?.item1?.[0]?.msg === 'Success') {
//         Swal.fire('Success', 'Uploaded successfully', 'success').then(() => window.location.reload());
//       } else {
//         Swal.fire('Error', 'Already uploaded or failed', 'error');
//       }
//     } catch (err) {
//       Swal.fire('Error', 'Upload failed', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Pagination Slice
//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredData.slice(start, start + itemsPerPage);
//   }, [filteredData, currentPage]);

//   return (
//     <> 
//          {loading && (
//                 <div className="fullScreenLoader">
//                     <div className="customSpinnerOverlay">
//                         <img src="/assets/images/spinner.gif" alt="Loading..." />
//                     </div>
//                 </div>
//             )}
//     <div className="p-4">
//       {loading && <div className="fixed inset-0 z-50 d-flex items-center justify-center bg-white/80">Loading...</div>}

//       <div className="bgDarkYellow shadow-sm border-0 mb-4">
//         <div className="card-body text-center">
//           <h2 className="text-2xl font-bold py-2 border-y">Upload Result Page</h2>
//         </div>
//       </div>

//       <div className="d-flex  gap-4 mb-4 items-center justify-center bgDarkYellow p-2 rounded ">
//         <div className='col-md-2 text-center'>
//         <button 
//           onClick={() => exportToExcel(filteredData, isResultUploaded)} 
//           className="btn btn-info text-white"
//         >
//           Export to Excel
//         </button>
//       </div>
//       <div className='col-md-3'>
//         <select 
//           className="form-select w-20 " 
//           value={selectedStatus} 
//           onChange={(e) => setSelectedStatus(e.target.value)}
//         >
//           <option value="">-- All Payments --</option>
//           <option value="success">Paid Payments</option>
//           <option value="failure">Failed Payments</option>
//           <option value="null">Pending Payments</option>
//         </select>
// </div>
//       <div className='col-md-3'> 
//         <input 
//           type="text" 
//           className="form-control w-40 " 
//           placeholder="Search all columns..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         </div>
      
//       </div>

//       <div className="table-responsive  rounded shadow-sm">
//         <table className="table table-hover align-middle">
//           <thead className="table-light">
//             <tr>
//               <th>Booking Id</th>
//               <th>Instrument</th>
//               <th>Samples</th>
//               <th>Charges</th>
//               <th>Request Sheet</th>
//               <th>User Details</th>
//               <th>Payment</th>
//               <th>Result Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.map((item: any, index: number) => (
//               <tr key={index}>
//                 <td className="font-bold">{item.bookingId}</td>
//                 <td>{item.instrumentName}</td>
//                 <td>{item.noOfSamples}</td>
//                 <td>{item.totalCharges && item.totalCharges !== 'null' ? `₹${item.totalCharges}` : 'NA'}</td>
//                 <td>
//                   {item.fileName ? (
//                     <button onClick={() => window.open(serverUrl + item.fileName, '_blank')} className="btn btn-sm btn-info">
//                       Download
//                     </button>
//                   ) : <span className="badge bg-secondary">N/A</span>}
//                 </td>
//                 <td className="text-xs">
//                   <div>{item.candidateName || 'Internal'}</div>
//                   <div className="text-muted">{item.userId}</div>
//                 </td>
//                 <td>
//                   <span className={`badge ${item.paymentStatus === 'success' ? 'bg-success' : 'bg-warning text-dark'}`}>
//                     {item.paymentStatus === 'success' ? 'Paid' : 'Pending'}
//                   </span>
//                 </td>
//                 <td>
//                   <span className={`badge ${isResultUploaded(item.bookingId) ? 'bg-success' : 'bg-warning text-dark'}`}>
//                     {isResultUploaded(item.bookingId) ? 'Uploaded' : 'Pending'}
//                   </span>
//                 </td>
//                 <td>
//                   {item.paymentStatus === 'success' ? (
//                     <button 
//                       onClick={() => { setSelectedBooking(item); setOpenModal(true); }} 
//                       className="btn btn-primary btn-sm"
//                     >
//                       Upload
//                     </button>
//                   ) : 'NA'}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {/* Simple Pagination */}
//         <div className="flex justify-between p-4 items-center">
//             <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="btn btn-outline-secondary">Prev</button>
//             <span>Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}</span>
//             <button disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)} onClick={() => setCurrentPage(prev => prev + 1)} className="btn btn-outline-secondary">Next</button>
//         </div>
//       </div>

//       {/* Upload Modal */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//         <Box sx={modalStyle}>
//           <Typography variant="h6" className="mb-4">Result Upload Screen</Typography>
//           <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
//             <div><strong>Booking ID:</strong> {selectedBooking?.bookingId}</div>
//             <div><strong>Instrument:</strong> {selectedBooking?.instrumentName}</div>
//           </div>
//           <input type="file" className="form-control mb-2" accept=".zip,.7z,.rar" onChange={handleFileChange} />
//           <p className="text-xs text-orange-600 mb-4">Allowed: Zip, 7z, Rar (Max 5MB)</p>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Remarks"
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//             className="mb-4"
//           />
//           <div className="flex justify-end gap-2">
//             <Button variant="outlined" onClick={() => setOpenModal(false)}>Cancel</Button>
//             <Button variant="contained" color="primary" onClick={handleUpload}>Upload Result</Button>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//     </>
//   );
// }

// const modalStyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 600,
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2
// };

// // Excel Export Utility
// const exportToExcel = (data: any[], resultChecker: Function) => {
//     const exportedData = data.map(item => ({
//         BookingId: item.bookingId,
//         Instrument: item.instrumentName,
//         Samples: item.noOfSamples,
//         Status: resultChecker(item.bookingId) ? 'Uploaded' : 'Pending'
//     }));
//     const ws = XLSX.utils.json_to_sheet(exportedData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Bookings");
//     XLSX.writeFile(wb, "AssignedResults_Report.xlsx");
// };