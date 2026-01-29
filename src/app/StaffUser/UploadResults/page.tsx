'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Container, Paper, TextField, MenuItem, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Pagination, Divider, Chip, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextareaAutosize
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Using Grid2 for MUI v6 compatibility
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

import myAppWebService from '@/services/myAppWebService';
import styles from './UploadResults.module.css';

export default function StaffActionBookings() {
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [noResultsMessage, setNoResultsMessage] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [bookingResultsData, setBookingResultsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedResultStatus, setSelectedResultStatus] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [fileToUpload, setFileToUpload] = useState<any>(null);
  const [base64File, setBase64File] = useState<string>('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const staffData = Cookies.get('StaffUserAuthData');
    const userEmail = staffData ? JSON.parse(staffData).EmailId : '';
    fetchInitialData(userEmail);
  }, []);

  const fetchInitialData = async (userId: string) => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const resBookings = await myAppWebService.GetAllBooking();
      
      if (resBookings?.item1 && resBookings.item1.length > 0) {
        const bookings = resBookings.item1;
        setOriginalData(bookings);
        setFilteredData(bookings);
        setNoResultsMessage(resBookings.item1[0]?.returnMessage || '');
      } else {
        setNoResultsMessage('No Details');
      }

      const resResults = await myAppWebService.GetUploadedResultDetails(userId);
      setBookingResultsData(resResults?.item1 || []);
    } catch (error) {
      console.error("Data fetch error", error);
      setNoResultsMessage('No Details');
    } finally {
      const elapsed = Date.now() - startTime;
      setTimeout(() => setLoading(false), Math.max(1500 - elapsed, 0));
    }
  };

  const isUploaded = (bookingId: string) => {
    return bookingResultsData.some(res => 
      res.bookingId === bookingId && 
      (res.uploadedResult && res.uploadedResult.trim() !== 'null' && res.uploadedResult.trim() !== '-NA-')
    );
  };

  useEffect(() => {
    let result = [...originalData];
    if (selectedStatus) {
      if (selectedStatus === 'null') {
        result = result.filter(item => !item.paymentStatus || item.paymentStatus === 'null' || item.paymentStatus === '');
      } else {
        result = result.filter(item => item.paymentStatus === selectedStatus);
      }
    }
    if (selectedResultStatus) {
      result = result.filter(item => {
        const uploaded = isUploaded(item.bookingId);
        return selectedResultStatus === 'Uploaded' ? uploaded : !uploaded;
      });
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(val => String(val).toLowerCase().includes(query))
      );
    }
    setFilteredData(result);
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedResultStatus, originalData, bookingResultsData]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5148576) {
      Swal.fire('Warning', 'File size exceeds 5MB', 'warning');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setBase64File((reader.result as string).split(',')[1]);
      setFileToUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async () => {
    if (!fileToUpload) return Swal.fire('Error', 'Kindly Upload File.', 'error');
    setLoading(true);
    try {
      const staffData = JSON.parse(Cookies.get('StaffUserAuthData') || '{}');
      const formData = new FormData();
      formData.append('BookingId', selectedBooking.bookingId);
      formData.append('UserEmailId', selectedBooking.userId);
      formData.append('CreatedBy', staffData.EmailId);
      formData.append('FilePath', fileToUpload.name);
      formData.append('File', base64File);

      const res = await myAppWebService.CIFResultsUploads(formData);
      if (res?.item1?.[0]?.msg === 'Success') {
        Swal.fire('Success', 'Uploaded Successfully!', 'success').then(() => window.location.reload());
      } else {
        Swal.fire('Error', 'Already Uploaded Results for this Test', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to Upload.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const excelData = filteredData.map(item => ({
      BookingId: item.bookingId,
      InstrumentName: item.instrumentName,
      Sample_Count: item.noOfSamples,
      Charges: item.totalCharges,
      User_Email: item.userId,
      Payment_Status: item.paymentStatus === 'success' ? 'Paid' : 'Pending',
      Result_Status: isUploaded(item.bookingId) ? 'Uploaded' : 'Pending'
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'AssignedResults_report.xlsx');
  };

  return (
    <> 
            {loading && (
                <div className="fullScreenLoader">
                    <div className="customSpinnerOverlay">
                        <img src="/assets/images/spinner.gif" alt="Loading..." />
                    </div>
                </div>
            )}
     

    {/* <Container maxWidth="xl" sx={{ py: 2 }}> */}
     <div className="container-fluid p-4">
          <div className="card shadow-sm mb-4">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold py-2">Upload Result Page</h2>
          </div>
        </div>
      {noResultsMessage !== 'No Details' ? (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" align="center" fontWeight="bold">Result Upload Page</Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 2 }}>
                <Button 
                  fullWidth variant="contained" color="info" 
                  startIcon={<FileDownloadIcon />} onClick={exportToExcel}
                  disabled={filteredData.length === 0}
                >
                  Excel
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  select fullWidth label="Payment Status"
                  value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="">-- All Payments --</MenuItem>
                  <MenuItem value="success">Paid Payments</MenuItem>
                  <MenuItem value="failure">Failed Payments</MenuItem>
                  <MenuItem value="null">Pending Payments</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  select fullWidth label="Result Status"
                  value={selectedResultStatus} onChange={(e) => setSelectedResultStatus(e.target.value)}
                >
                  <MenuItem value="">-- All Results --</MenuItem>
                  <MenuItem value="Uploaded">Uploaded Results</MenuItem>
                  <MenuItem value="Pending">Pending Results</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth placeholder="Search All Columns..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} /> }}
                />
              </Grid>
            </Grid>
          </Paper>

          <TableContainer component={Paper} className={styles.tableContainer}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {['Booking Id', 'Instrument', 'Samples', 'Charges', 'Candidate', 'Type', 'Payment', 'Result', 'Action'].map((head) => (
                    <TableCell key={head} className={styles.headerCell}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>{row.bookingId}</TableCell>
                      <TableCell>{row.instrumentName}</TableCell>
                      <TableCell>{row.noOfSamples}</TableCell>
                      <TableCell>{row.totalCharges ? `₹${row.totalCharges}` : 'NA'}</TableCell>
                      <TableCell>{row.candidateName || 'Internal'}</TableCell>
                      <TableCell>{row.userRole || 'Internal'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.paymentStatus === 'success' ? 'Paid' : 'Pending'} 
                          color={row.paymentStatus === 'success' ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={isUploaded(row.bookingId) ? 'Uploaded' : 'Pending'} 
                          color={isUploaded(row.bookingId) ? 'success' : 'default'} 
                          variant="outlined" size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        {row.paymentStatus === 'success' ? (
                          <IconButton color="primary" onClick={() => { setSelectedBooking(row); setOpenModal(true); }}>
                            <UploadFileIcon />
                          </IconButton>
                        ) : 'NA'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 10 }}>
                      <Typography variant="h6" color="textSecondary">No filtered results found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="caption">Showing {paginatedData.length} of {filteredData.length} records</Typography>
            <Pagination count={Math.ceil(filteredData.length / itemsPerPage)} page={currentPage} onChange={(_, v) => setCurrentPage(v)} color="primary" />
          </Box>
        </>
      ) : (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="error" fontWeight="bold">
            No Booking Assigned Yet!
          </Typography>
        </Paper>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Result Upload Screen
          <IconButton onClick={() => setOpenModal(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2">Booking ID: {selectedBooking?.bookingId}</Typography>
              <Typography variant="subtitle2">Instrument: {selectedBooking?.instrumentName}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" gutterBottom>Upload File (Zip/7z/Rar, Max 5MB)</Typography>
              <input type="file" accept=".zip,.7z,.rar" onChange={handleFileChange} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" gutterBottom>Remarks (Any)</Typography>
              <TextareaAutosize 
                minRows={4} style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#ccc' }} 
                value={remarks} onChange={(e) => setRemarks(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleUploadSubmit} disabled={!fileToUpload}>Upload Result</Button>
        </DialogActions>
      </Dialog>
      </div>
    {/* </Container> */}
    </>
  );
}

// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   Box, Container, Paper, TextField, MenuItem, Button, 
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
//   Typography, Pagination, Divider, Chip, IconButton, Dialog, DialogTitle, 
//   DialogContent, DialogActions, TextareaAutosize
// } from '@mui/material';
// import Grid from '@mui/material/Grid';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import UploadFileIcon from '@mui/icons-material/UploadFile';
// import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close';
// import Cookies from 'js-cookie';
// import Swal from 'sweetalert2';
// import * as XLSX from 'xlsx';

// // Custom service import as requested
// import myAppWebService from '@/services/myAppWebService';
// import styles from './UploadResults.module.css';

// export default function StaffActionBookings() {
//   // State Management
//   const [originalData, setOriginalData] = useState<any[]>([]);
//   const [NoResults, setNoResults] = useState<any[]>([]);
//   const [filteredData, setFilteredData] = useState<any[]>([]);
//   const [bookingResultsData, setBookingResultsData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // Filters
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [selectedResultStatus, setSelectedResultStatus] = useState('');
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Modal State
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState<any>(null);
//   const [fileToUpload, setFileToUpload] = useState<any>(null);
//   const [base64File, setBase64File] = useState<string>('');
//   const [remarks, setRemarks] = useState('');

//   const serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';

//   useEffect(() => {
//     const staffData = Cookies.get('StaffUserAuthData');
//     const userEmail = staffData ? JSON.parse(staffData).EmailId : '';
//     fetchInitialData(userEmail);
//   }, []);

//   const fetchInitialData = async (userId: string) => {
//     setLoading(true);
//     const startTime = Date.now();
//     try {
//       // API 1: Get All Bookings
//       const resBookings = await myAppWebService.GetAllBooking();
//       const bookings = resBookings?.item1 || [];
//        const firstRecord = resBookings.item1[0];
//        const NoResults = firstRecord.returnMessage;
//        setNoResults(NoResults);
//       // API 2: Get Uploaded Results
//       const resResults = await myAppWebService.GetUploadedResultDetails(userId);
//       // const resResults = await myAppWebService.GetUploadedResultDetails('33476');
//       const results = resResults?.item1 || [];

//       setOriginalData(bookings);
//       setBookingResultsData(results);
//       setFilteredData(bookings);
//     } catch (error) {
//       console.error("Data fetch error", error);
//     } finally {
//       const elapsed = Date.now() - startTime;
//       setTimeout(() => setLoading(false), Math.max(1500 - elapsed, 0));
//     }
//   };

//   // Helper: Logic from Angular 'isResultUploaded'
//   const isUploaded = (bookingId: string) => {
//     return bookingResultsData.some(res => 
//       res.bookingId === bookingId && 
//       (res.uploadedResult && res.uploadedResult.trim() !== 'null' && res.uploadedResult.trim() !== '-NA-')
//     );
//   };

//   // Filtering Logic (Angular applyFilters refactored)
//   useEffect(() => {
//     let result = [...originalData];

//     // Payment Status Filter
//     if (selectedStatus) {
//       if (selectedStatus === 'null') {
//         result = result.filter(item => !item.paymentStatus || item.paymentStatus === 'null' || item.paymentStatus === '');
//       } else {
//         result = result.filter(item => item.paymentStatus === selectedStatus);
//       }
//     }

//     // Result Upload Status Filter
//     if (selectedResultStatus) {
//       result = result.filter(item => {
//         const uploaded = isUploaded(item.bookingId);
//         return selectedResultStatus === 'Uploaded' ? uploaded : !uploaded;
//       });
//     }

//     // Search Query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(item => 
//         Object.values(item).some(val => String(val).toLowerCase().includes(query))
//       );
//     }

//     setFilteredData(result);
//     setCurrentPage(1);
//   }, [searchQuery, selectedStatus, selectedResultStatus, originalData, bookingResultsData]);

//   // Pagination Slice
//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredData.slice(start, start + itemsPerPage);
//   }, [filteredData, currentPage, itemsPerPage]);

//   // File Handling Logic
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 5148576) {
//       Swal.fire('Warning', 'File size exceeds 5MB', 'warning');
//       e.target.value = '';
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       const base64Str = (reader.result as string).split(',')[1];
//       setBase64File(base64Str);
//       setFileToUpload(file);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleUploadSubmit = async () => {
//     if (!fileToUpload) {
//       Swal.fire('Error', 'Kindly Upload File.', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       const staffData = JSON.parse(Cookies.get('StaffUserAuthData') || '{}');
//       const formData = new FormData();
//       formData.append('BookingId', selectedBooking.bookingId);
//       formData.append('UserEmailId', selectedBooking.userId);
//       formData.append('CreatedBy', staffData.EmailId);
//       formData.append('FilePath', fileToUpload.name);
//       formData.append('File', base64File); // Sending as base64 per your Angular logic

//       const res = await myAppWebService.CIFResultsUploads(formData);
//       const msg = res?.item1?.[0]?.msg;
      
//       if (msg === 'Success') {
//         Swal.fire('Success', 'Uploaded Successfully!', 'success').then(() => window.location.reload());
//       } else {
//         Swal.fire('Error', 'Already Uploaded Results for this Test', 'error');
//       }
//     } catch (error) {
//       Swal.fire('Error', 'Failed to Upload.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToExcel = () => {
//     const excelData = filteredData.map(item => ({
//       BookingId: item.bookingId,
//       InstrumentName: item.instrumentName,
//       Sample_Count: item.noOfSamples,
//       Charges: item.totalCharges,
//       User_Email: item.userId,
//       Payment_Status: item.paymentStatus === 'success' ? 'Paid' : 'Pending',
//       Result_Status: isUploaded(item.bookingId) ? 'Uploaded' : 'Pending'
//     }));
//     const ws = XLSX.utils.json_to_sheet(excelData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Report');
//     XLSX.writeFile(wb, 'AssignedResults_report.xlsx');
//   };

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {loading && (
//         <div className={styles.fullscreenLoader}>
//           <div className={styles.loaderSpinner} />
//           <Typography variant="h6" sx={{ mt: 2 }}>Processing, please wait...</Typography>
//         </div>
//       )}

//       <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
//         <Typography variant="h5" align="center" fontWeight="bold">Result Upload Page</Typography>
//         <Divider sx={{ my: 2 }} />

//         <Grid container spacing={2} alignItems="center">
//           <Grid size={{ xs: 12, sm: 2 }}>
//             <Button 
//               fullWidth variant="contained" color="info" 
//               startIcon={<FileDownloadIcon />} onClick={exportToExcel}
//               disabled={filteredData.length === 0}
//             >
//               Excel
//             </Button>
//           </Grid>

//           <Grid size={{ xs: 12, sm: 3 }}>
//             <TextField
//               select fullWidth label="Payment Status"
//               value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
//             >
//               <MenuItem value="">-- All Payments --</MenuItem>
//               <MenuItem value="success">Paid Payments</MenuItem>
//               <MenuItem value="failure">Failed Payments</MenuItem>
//               <MenuItem value="null">Pending Payments</MenuItem>
//             </TextField>
//           </Grid>

//           <Grid size={{ xs: 12, sm: 3 }}>
//             <TextField
//               select fullWidth label="Result Status"
//               value={selectedResultStatus} onChange={(e) => setSelectedResultStatus(e.target.value)}
//             >
//               <MenuItem value="">-- All Results --</MenuItem>
//               <MenuItem value="Uploaded">Uploaded Results</MenuItem>
//               <MenuItem value="Pending">Pending Results</MenuItem>
//             </TextField>
//           </Grid>

//           <Grid size={{ xs: 12, sm: 4 }}>
//             <TextField
//               fullWidth placeholder="Search All Columns..."
//               value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
//               InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} /> }}
//             />
//           </Grid>
//         </Grid>
//       </Paper>

//       <TableContainer component={Paper} className={styles.tableContainer}>
//         <Table stickyHeader size="small">
//           <TableHead>
//             <TableRow>
//               {['Booking Id', 'Instrument', 'Samples', 'Charges', 'Candidate', 'Type', 'Payment', 'Result', 'Action'].map((head) => (
//                 <TableCell key={head} className={styles.headerCell}>{head}</TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedData.length > 0 || NoResults!=='No Results' ? paginatedData.map((row, idx) => (
//               <TableRow key={idx} hover>
//                 <TableCell sx={{ fontWeight: 'bold' }}>{row.bookingId}</TableCell>
//                 <TableCell>{row.instrumentName}</TableCell>
//                 <TableCell>{row.noOfSamples}</TableCell>
//                 <TableCell>{row.totalCharges ? `₹${row.totalCharges}` : 'NA'}</TableCell>
//                 <TableCell>{row.candidateName || 'Internal'}</TableCell>
//                 <TableCell>{row.userRole || 'Internal'}</TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={row.paymentStatus === 'success' ? 'Paid' : 'Pending'} 
//                     color={row.paymentStatus === 'success' ? 'success' : 'warning'} 
//                     size="small" 
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={isUploaded(row.bookingId) ? 'Uploaded' : 'Pending'} 
//                     color={isUploaded(row.bookingId) ? 'success' : 'default'} 
//                     variant="outlined" size="small" 
//                   />
//                 </TableCell>
//                 <TableCell>
//                   {row.paymentStatus === 'success' ? (
//                     <IconButton color="primary" onClick={() => { setSelectedBooking(row); setOpenModal(true); }}>
//                       <UploadFileIcon />
//                     </IconButton>
//                   ) : 'NA'}
//                 </TableCell>
//               </TableRow>
//             )) : (
//               <TableRow>
//                 <TableCell colSpan={9} align="center" sx={{ py: 10 }}>
//                   <Typography color="error">No Booking Assigned Yet!</Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
//         <Typography variant="caption">Showing {paginatedData.length} of {filteredData.length} records</Typography>
//         <Pagination 
//           count={Math.ceil(filteredData.length / itemsPerPage)} 
//           page={currentPage} 
//           onChange={(_, v) => setCurrentPage(v)} 
//           color="primary" 
//         />
//       </Box>

//       {/* Result Upload Modal (Refactored from ng-template viewDescModal2) */}
//       <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
//         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           Result Upload Screen
//           <IconButton onClick={() => setOpenModal(false)}><CloseIcon /></IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Grid container spacing={3}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography variant="subtitle2">Booking ID: {selectedBooking?.bookingId}</Typography>
//               <Typography variant="subtitle2">Instrument: {selectedBooking?.instrumentName}</Typography>
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <Typography variant="body2" gutterBottom>Upload File (Zip/7z/Rar, Max 5MB)</Typography>
//               <input type="file" accept=".zip,.7z,.rar" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <Typography variant="body2" gutterBottom>Remarks (Any)</Typography>
//               <TextareaAutosize 
//                 minRows={4} style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#ccc' }} 
//                 value={remarks} onChange={(e) => setRemarks(e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
//           <Button variant="contained" onClick={handleUploadSubmit} disabled={!fileToUpload}>Upload Result</Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }