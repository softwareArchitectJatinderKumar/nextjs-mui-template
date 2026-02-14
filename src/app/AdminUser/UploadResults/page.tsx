// import React from 'react'

// function ResultUpload() {
//   return (
//     <div>Result Upload</div>
//   )
// }

// export default ResultUpload


"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import {
  Box, Card, CardContent, Typography, TextField, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  IconButton, Chip, Select, MenuItem, FormControl, InputLabel, Modal,
  CircularProgress, Grid, Divider, Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Search, FileDownload, FilterList, FilterListOff, CloudUpload,
  Visibility, ChevronLeft, ChevronRight, Close
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import * as XLSX from 'xlsx';

import styles from './AdminActionBookings.module.css';
import myAppWebService from '@/services/myAppWebService'; // Update with your actual service path

export default function AdminActionBookings() {
  // State Management
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [tmpsBookingData, setTmpsBookingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAssigned, setIsAssigned] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [bookingCase, setBookingCase] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');

  const serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await myAppWebService.GetAllBookingTests();
      if (response?.item1) {
        setOriginalData(response.item1);
        setTmpsBookingData(response.item1);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire("Error", "Failed to load booking data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter and Search Logic
  const handleSearch = () => {
    let filtered = [...originalData];

    // Advanced Filters
    if (selectedStatus) {
      filtered = filtered.filter(item =>
        selectedStatus === 'null' ? (!item.paymentStatus || item.paymentStatus === 'null') : item.paymentStatus === selectedStatus
      );
    }

    if (isAssigned) {
      filtered = filtered.filter(item =>
        isAssigned === 'Assigned' ? (item.assignedUserId?.length > 0) : (!item.assignedUserId || item.assignedUserId.length === 0)
      );
    }

    // Text Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        Object.values(item).some(val => String(val).toLowerCase().includes(query))
      );
    }

    setTmpsBookingData(filtered);
    setPage(0);
  };

  const resetFilters = () => {
    setSelectedStatus('');
    setIsAssigned('');
    setSearchQuery('');
    setTmpsBookingData(originalData);
  };

  // File Handling
  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Warning", "File size exceeds 5MB", "warning");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFileBase64(base64String);
        setSelectedFile(file);
      };
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !remarks) {
      Swal.fire("Error", "Please provide file and remarks", "error");
      return;
    }

    const authData = JSON.parse(Cookies.get('authData') || '{}');
    const formData = new FormData();
    formData.append('BookingId', bookingCase.bookingId);
    formData.append('UserEmailId', bookingCase.userEmailId);
    formData.append('Remarks', remarks);
    formData.append('CreatedBy', authData.EmailId);
    formData.append('FilePath', selectedFile.name);
    formData.append('File', fileBase64);

    try {
      setLoading(true);
      const res = await myAppWebService.CIFResultsUploads(formData);
      if (res.item1[0].msg === 'Success') {
        Swal.fire("Success", "Result uploaded successfully", "success");
        setOpenModal(false);
        fetchData();
      } else {
        Swal.fire("Error", res.item1[0].msg, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Excel Export
  const exportToExcel = () => {
    const exportData = tmpsBookingData.map(item => ({
      "Booking ID": item.bookingId,
      "Instrument": item.instrumentName,
      "Candidate": item.candidateName || 'Internal User',
      "Payment Status": item.paymentStatus === 'success' ? 'Paid' : 'Pending',
      "Charges": item.totalCharges
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, "Admin_Bookings.xlsx");
  };

  return (
    <Box className={styles.container}>
      {loading && (
        <Box className={styles.overlay}>
          <CircularProgress color="primary" />
        </Box>
      )}

      <Typography variant="h4" align="center" gutterBottom className={styles.title}>
        Upload Results Page
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Card elevation={3}>
        <CardContent>
          {/* Toolbar */}
          <Grid container spacing={2} alignItems="center" sx={{ width: '100%', mb: 3 }} >
            <Grid size={{ xs: 12, sm: 6, md: 1.5, lg: 1.4 }} sx={{ textAlign: 'center' }} >
              <Button variant="contained" className={styles.btnAction} startIcon={<FileDownload />} onClick={exportToExcel}>
                Export to Excel
              </Button>
            </Grid>
            <Grid size={{ xs: 10, sm: 6, md: 2.5 }}>
              <TextField
                label="Search Text..."
                fullWidth
                size="small"
                placeholder="Search Text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search sx={{ fontSize: '1.2rem', color: 'gray' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    height: '40px',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                    lineHeight: '1.43',
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 1.5 }} textAlign="center">
              <Button className={styles.btnAction}
                variant="contained"
                // color="primary"
                startIcon={showAdvancedSearch ? <FilterListOff /> : <FilterList />}
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              >
                {showAdvancedSearch ? 'Hide Advanced' : 'Advanced Search'}
              </Button>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          {showAdvancedSearch && (
            <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="flex-end" sx={{ width: '100%', mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Status</InputLabel>
                    <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}  size="small">
                      <MenuItem value="">All Payments</MenuItem>
                      <MenuItem value="success">Paid</MenuItem>
                      <MenuItem value="failure">Failure</MenuItem>
                      <MenuItem value="null">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                  <FormControl fullWidth>
                    <InputLabel>Test Assignment</InputLabel>
                    <Select value={isAssigned} onChange={(e) => setIsAssigned(e.target.value)}  size="small">
                      <MenuItem value="">All Tests</MenuItem>
                      <MenuItem value="Assigned">Assigned</MenuItem>
                      <MenuItem value="Pending">Not Assigned</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                  <Button variant="contained" sx={{ mr: 1, bgcolor: '#333' }} onClick={handleSearch}>Apply Filters</Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                  <Button variant="outlined" color="secondary" onClick={resetFilters}>Reset</Button>
                </Grid>
              </Grid>
            </Box>
          )}
           
          {/* Data Table */}
          <TableContainer component={Paper} className={styles.tableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Booking ID", "Instrument", "Samples", "Charges", "Sheet", "Candidate", "Role", "Status", "Action"].map(head => (
                    <TableCell key={head} sx={{ fontWeight: 'bold', bgcolor: '#f0f0f0' }} className={styles.headerCell}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tmpsBookingData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={`${row.bookingId}-${index}`} hover>
                    <TableCell>{row.bookingId}</TableCell>
                    <TableCell>{row.instrumentName}</TableCell>
                    <TableCell>{row.noOfSamples}</TableCell>
                    <TableCell>{row.totalCharges ? `₹${row.totalCharges}` : 'NA'}</TableCell>
                    <TableCell>
                      {row.fileName ? (
                        <IconButton color="primary" onClick={() => window.open(serverUrl + row.fileName)}>
                          <Visibility />
                        </IconButton>
                      ) : <Chip label="N/A" size="small" />}
                    </TableCell>
                    <TableCell>{row.candidateName || 'Internal'}</TableCell>
                    <TableCell>{row.userRole}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.paymentStatus === 'success' ? 'Paid' : 'Pending'}
                        color={row.paymentStatus === 'success' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {row.paymentStatus === 'success' ? (
                        <Button size="small" variant="contained" startIcon={<CloudUpload />} onClick={() => { setBookingCase(row); setOpenModal(true); }}>
                          Upload
                        </Button>
                      ) : <Chip label="NA" variant="outlined" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={tmpsBookingData.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 15, 25, 50]}
            slotProps={{
              select: {
                variant: 'standard',  
                sx: { paddingY: 4 }
              }
            }}
            sx={{
              '& .MuiTablePagination-toolbar': {
                alignItems: 'center',
                display: 'flex'
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                margin: 0,
                lineHeight: 'inherit'
              }
            }}
          />
          
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className={styles.modalContent}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Result Upload Screen</Typography>
            <IconButton onClick={() => setOpenModal(false)}><Close /></IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}><Typography variant="subtitle2">Booking ID: {bookingCase?.bookingId}</Typography></Grid>
            <Grid size={{ xs: 6 }}><Typography variant="subtitle2">Instrument: {bookingCase?.instrumentName}</Typography></Grid>
            <Grid size={{ xs: 12 }}>
              <input type="file" accept=".zip,.7z,.rar" onChange={onFileSelected} />
              <Typography variant="caption" color="primary" display="block">Allowed: Zip, 7z, Rar (Max 5MB)</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }} textAlign="right">
              <Button variant="contained" onClick={handleUpload} disabled={!selectedFile}>Upload Result</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}