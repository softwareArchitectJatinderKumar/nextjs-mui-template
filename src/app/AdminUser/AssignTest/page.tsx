"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  IconButton, Select, MenuItem, FormControl, InputLabel, Modal,
  CircularProgress, Grid, Divider, InputAdornment,
  Chip
} from '@mui/material';
import { Search, FileDownload, Close, AssignmentInd, Edit, Visibility, CloudUpload } from '@mui/icons-material';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import styles from './AdminAssignTest.module.css';
import myAppWebService from '@/services/myAppWebService';

export default function AdminAssignTest() {
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [AllBookingTestsData, setAllBookingTestsData] = useState<any[]>([]);
  const [tmpsAllBookingTestsData, setTmpsAllBookingTestsData] = useState<any[]>([]);
  const [AllAssignedTest, setAllAssignedTest] = useState<any[]>([]);
  const [AllCifUserLists, setAllCifUserList] = useState<any[]>([]);

  const [selectedPaymentStatus, setselectedPaymentStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- Modal Logic ---
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<'ASSIGN' | 'REASSIGN'>('ASSIGN');
  const [editEvent, setEditEvent] = useState<any>(null);
  const [AssignedTo, setAssignedTo] = useState('');
  const [AssignedToNew, setAssignedToNew] = useState('');
  const recordSizeOptions = [10, 25, 50, 100];
  const serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';
  const AllCifUserList = [
    { uid: '24374', uiD_Name: 'Dr. Vijay Kumar' },
    { uid: '20362', uiD_Name: 'Dr. Nupur Prasad' },
    { uid: '16477', uiD_Name: 'Mr. Prashant Kumar' },
    { uid: '27727', uiD_Name: 'Dr. Nabaparna Chakraborty' },
    { uid: '26918', uiD_Name: 'Ms. Baljit Bangar' },
    { uid: '30694', uiD_Name: 'Ms. Amandeep Kaur' },
    { uid: '29159', uiD_Name: 'Ms. Kamlash Rani' },
    { uid: '31691', uiD_Name: 'Mr. Sameer' }
  ];

  useEffect(() => {
    getAllPaymentDetails();
    getAllAssignedTest();
    getAllCifUserList();
  }, []);

  const formatCurrency = (amount: any) => {
    if (!amount || amount === 'null') return 'NA';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getAllPaymentDetails = async () => {
    setLoadingIndicator(true);
    try {
      const res = await myAppWebService.GetAllBookingTests();
      const data = res?.item1 || [];
      setAllBookingTestsData(data);
      setTmpsAllBookingTestsData(data);

    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIndicator(false);
    }
  };
  const getAllAssignedTest = async () => {
    setLoadingIndicator(true);
    try {
      const res = await myAppWebService.GetAllUploadedResultsByStaff();
      const data = res?.item1 || [];
      setAllAssignedTest(data);

    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIndicator(false);
    }
  };
  const getAllCifUserList = async () => {
    setLoadingIndicator(true);
    try {
      const res = await myAppWebService.GetAllUserLists();
      const data = res?.item1 || [];
      setAllCifUserList(data);

    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIndicator(false);
    }
  };

  const AssignStaff = async () => {
    const formData = new FormData();
    formData.append('RecordId', editEvent.recordId);
    formData.append('BookingId', editEvent.bookingId);
    formData.append('InstrumentId', editEvent.instrumentId);
    formData.append('UserId', editEvent.userEmailId);
    formData.append('AssignedTo', AssignedTo);

    try {
      setLoadingIndicator(true);
      const res = await myAppWebService.CIFAssignTestToStaff(formData);
      const result = res.item1?.[0]?.msg || '';

      if (result === 'Success') {
        Swal.fire('Action Planned Stored Successfully!', '', 'success').then(() => {
          setOpenModal(false);
          getAllPaymentDetails();
        });
      } else {
        Swal.fire(result === 'Failed' ? 'Test is already Assigned' : 'Something Went Wrong', '', 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Server Communication Error', 'error');
    } finally {
      setLoadingIndicator(false);
    }
  };

  const ReAssginStaff = async () => {
    const formData = new FormData();
    formData.append('RecordId', editEvent.recordId);
    formData.append('BookingId', editEvent.bookingId);
    formData.append('InstrumentId', editEvent.instrumentId);
    formData.append('UserId', editEvent.userEmailId);
    formData.append('AssignedTo', AssignedToNew);

    try {
      setLoadingIndicator(true);
      const res = await myAppWebService.ReAssignTestToStaff(formData);
      const result = res.item1?.[0]?.msg || '';

      if (result === 'Success') {
        Swal.fire('Action Planned Stored Successfully!', '', 'success').then(() => {
          setOpenModal(false);
          getAllPaymentDetails();
        });
      } else {
        Swal.fire('Error', result, 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Server Communication Error', 'error');
    } finally {
      setLoadingIndicator(false);
    }
  };

  const downloadFile = (fileName: string) => {
    window.open(`${serverUrl}/${fileName}`, '_blank');
  };


  useEffect(() => {
    let result = [...AllBookingTestsData];

    if (selectedPaymentStatus && selectedPaymentStatus !== 'All') {
      result = result.filter(item => {
        const apiStatus = (item.paymentStatus || 'pending').toLowerCase();

        if (selectedPaymentStatus === 'pending') {
          return apiStatus === 'pending' || apiStatus === 'null' || !item.paymentStatus;
        }
        return apiStatus === selectedPaymentStatus.toLowerCase();
      });
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

    setTmpsAllBookingTestsData(result);
    setPage(0);
  }, [searchQuery, selectedPaymentStatus, AllBookingTestsData]);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
  };
  return (
    <Box className={styles.pageContainer}>
      {loadingIndicator && (
        <Box className={styles.loaderOverlay}><CircularProgress sx={{ color: '#ef7d00' }} /></Box>
      )}

      <Typography variant="h4" className={styles.title}>Assign Test Page</Typography>

      <Card className={styles.mainCard}>
        <CardContent>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Grid sx={{ xs: 12, md: 4 }}>
              <Button variant="contained" className={styles.btnExport} startIcon={<FileDownload />}
                onClick={() => {
                  const ws = XLSX.utils.json_to_sheet(tmpsAllBookingTestsData);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "Data");
                  XLSX.writeFile(wb, "Assign_Test_Report.xlsx");
                }}>
                Export to Excel
              </Button>
            </Grid>
            <Grid sx={{ xs: 12, md: 3, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)} // Just updates state
                InputProps={{ endAdornment: <InputAdornment position="end"><Search /></InputAdornment> }}
              />

            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
              <TextField
                size='small'
                select
                fullWidth
                label="Payment Status"
                value={selectedPaymentStatus}
                onChange={(e) => {
                  setselectedPaymentStatus(e.target.value);
                }}
              >
                <MenuItem value="All">All Payments</MenuItem>
                <MenuItem value="pending">Pending (Unpaid)</MenuItem>
                <MenuItem value="success">Paid</MenuItem>
                <MenuItem value="failure">Failed</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <TableContainer component={Paper} variant="outlined" className={styles.tableResponsive}>
            <Table size="small" className={styles.stripedTable}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell className={styles.tableHeader}>Booking Id</TableCell>
                  <TableCell className={styles.tableHeader}>Instrument Name</TableCell>
                  <TableCell className={styles.tableHeader}>Sample Count</TableCell>
                  <TableCell className={styles.tableHeader}>Total Charges</TableCell>
                  <TableCell className={styles.tableHeader}>Request Sheet</TableCell>
                  <TableCell className={styles.tableHeader}>Request Date</TableCell>
                  <TableCell className={styles.tableHeader}>Candidate Id</TableCell>
                  <TableCell className={styles.tableHeader}>Candidate Name</TableCell>
                  <TableCell className={styles.tableHeader}>Organisation</TableCell>
                  <TableCell className={styles.tableHeader}>User Type</TableCell>
                  <TableCell className={styles.tableHeader}>Payment Status</TableCell>
                  <TableCell className={styles.tableHeader}>Payment Date</TableCell>
                  <TableCell className={styles.tableHeader}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tmpsAllBookingTestsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.newBookingId}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.instrumentName}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.noOfSamples}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{formatCurrency(row.totalCharges)}</TableCell>

                    <TableCell>
                      {row.fileName ? (
                        <IconButton color="primary" onClick={() => window.open(serverUrl + row.fileName)}>
                          <Visibility />
                        </IconButton>
                      ) : <Chip label="N/A" size="small" />}
                    </TableCell>


                    <TableCell sx={{ fontWeight: 'bold' }}>{row.bookingRequestDate}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.userEmailId || 'Internal User'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.candidateName || 'Internal User'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.organisationName}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.userRole}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={row.paymentStatus === 'success' ? 'Paid' : row.paymentStatus === 'failure' ? 'Failed' : 'Pending'}
                        color={row.paymentStatus === 'success' ? 'success' : row.paymentStatus === 'failure' ? 'error' : 'warning'}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 'bold' }}>{row.paymentDate || '-NA-'}</TableCell>

                    <TableCell>
                      {row.paymentStatus === 'success' ? (
                        !row.assignedUserId || row.assignedUserId.length <= 0 ? (
                          <Button variant="contained" size="small" className={styles.btnDark} startIcon={<CloudUpload />}
                            onClick={() => { setEditEvent(row); setModalType('ASSIGN'); setOpenModal(true); }}>
                            Assign
                          </Button>
                        ) : (
                          <Box>
                            <Button variant="contained" size="small" color="primary" sx={{ mb: 1 }} startIcon={<CloudUpload />}
                              onClick={() => { setEditEvent(row); setModalType('REASSIGN'); setOpenModal(true); }}>
                              Modify
                            </Button>
                            <Typography variant="caption" display="block" sx={{ bgcolor: '#e1f5fe', p: 0.5, borderRadius: 1 }}>
                              Assigned to: {row.assignedUserId}
                            </Typography>
                          </Box>
                        )
                      ) : (
                        <Chip label="NA" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={tmpsAllBookingTestsData.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            sx={{
              "& .MuiTablePagination-toolbar": { alignItems: 'center', display: 'flex' },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { margin: '0 !important' }
            }}
          />
        </CardContent>
      </Card>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className={styles.modalBox}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              {modalType === 'ASSIGN' ? 'Assign Test to Staff' : 'Modify Assigned Staff'}
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}><Close /></IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3, p: 2, bgcolor: '#fdfdfd', border: '1px solid #eee', borderRadius: 1 }}>
            <Typography variant="body2"><b>Booking ID:</b> {editEvent?.bookingId}</Typography>
            <Typography variant="body2"><b>Instrument:</b> {editEvent?.instrumentName}</Typography>
            {modalType === 'REASSIGN' && (
              <Typography variant="body2" color="error"><b>Current Staff:</b> {editEvent?.assignedUserId}</Typography>
            )}
          </Box>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Select CIF Staff Member</InputLabel>
            <Select
              value={modalType === 'ASSIGN' ? AssignedTo : AssignedToNew}
              label="Select CIF Staff Member"
              onChange={(e) => modalType === 'ASSIGN' ? setAssignedTo(e.target.value) : setAssignedToNew(e.target.value)}
            >
              <MenuItem value=""><em>-- Choose Staff --</em></MenuItem>
              {AllCifUserList.map(u => (
                <MenuItem key={u.uid} value={u.uid}>{u.uiD_Name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" gap={2}>
            <Button fullWidth variant="outlined" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button
              fullWidth variant="contained" className={styles.btnAction}
              disabled={modalType === 'ASSIGN' ? !AssignedTo : !AssignedToNew}
              onClick={modalType === 'ASSIGN' ? AssignStaff : ReAssginStaff}>
              {modalType === 'ASSIGN' ? 'Confirm Assign' : 'Update Staff'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}