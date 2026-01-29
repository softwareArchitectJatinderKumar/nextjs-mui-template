"use client";

import React, { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography, TextField, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
    IconButton, Select, MenuItem, FormControl, InputLabel, Modal,
    CircularProgress, Grid, Divider, InputAdornment, Chip
} from '@mui/material';
import { Search, FileDownload, Close, Visibility } from '@mui/icons-material';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import styles from './AdminAssignTest.module.css';
import myAppWebService from '@/services/myAppWebService';

export default function AdminAssignTest() {
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [AllBookingTestsData, setAllBookingTestsData] = useState<any[]>([]);
    const [tmpsAllBookingTestsData, setTmpsAllBookingTestsData] = useState<any[]>([]);

    // Pagination & Search States
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const recordSizeOptions = [10, 25, 50, 100];

    // Modal States
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<'ASSIGN' | 'REASSIGN'>('ASSIGN');
    const [editEvent, setEditEvent] = useState<any>(null);
    const [AssignedTo, setAssignedTo] = useState('');

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
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoadingIndicator(true);
        try {
            const res = await myAppWebService.GetAllBookingTests();
            const data = res?.item1 || [];
            setAllBookingTestsData(data);
            setTmpsAllBookingTestsData(data);
        } catch (e) { console.error(e); }
        finally { setLoadingIndicator(false); }
    };

    const handleSearch = (val: string) => {
        setSearchQuery(val);
        if (!val) {
            setTmpsAllBookingTestsData(AllBookingTestsData);
            return;
        }
        const filtered = AllBookingTestsData.filter(item =>
            Object.values(item).some(v => String(v).toLowerCase().includes(val.toLowerCase()))
        );
        setTmpsAllBookingTestsData(filtered);
        setPage(0);
    };

    // Helper for INR Formatting (Matches Angular | currency:'INR')
    const formatCurrency = (amount: any) => {
        if (!amount || amount === 'null') return 'NA';
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
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
                        <Grid sx={{xs:12,sm:4}}>
                            <Button variant="contained" className={styles.btnDark} startIcon={<FileDownload />}
                                onClick={() => {
                                    const ws = XLSX.utils.json_to_sheet(tmpsAllBookingTestsData);
                                    const wb = XLSX.utils.book_new();
                                    XLSX.utils.book_append_sheet(wb, ws, "Data");
                                    XLSX.writeFile(wb, "AdminAssignTest_Report.xlsx");
                                }}>
                                Export to Excel
                            </Button>
                        </Grid>
                        <Grid sx={{xs:12,sm:6}}>
                            <TextField
                                fullWidth size="small" placeholder="Search..."
                                value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                                InputProps={{ endAdornment: <InputAdornment position="end"><Search /></InputAdornment> }}
                            />
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

                                        {/* File Download Logic */}
                                        <TableCell>
                                            {row.fileName ? (
                                                <Button size="small" variant="contained" className={styles.btnDark}
                                                    onClick={() => window.open(row.fileName, '_blank')}>View</Button>
                                            ) : (
                                                <Chip label="N/A" color="info" size="small" />
                                            )}
                                        </TableCell>

                                        <TableCell sx={{ fontWeight: 'bold' }}>{row.bookingRequestDate}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{row.userEmailId || 'Internal User'}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{row.candidateName || 'Internal User'}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{row.organisationName}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{row.userRole}</TableCell>

                                        {/* Payment Status Logic */}
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={row.paymentStatus === 'success' ? 'Paid' : row.paymentStatus === 'failure' ? 'Failed' : 'Pending'}
                                                color={row.paymentStatus === 'success' ? 'success' : row.paymentStatus === 'failure' ? 'error' : 'warning'}
                                            />
                                        </TableCell>

                                        <TableCell sx={{ fontWeight: 'bold' }}>{row.paymentDate || '-NA-'}</TableCell>

                                        {/* ACTION LOGIC: Exactly as per Angular template */}
                                        <TableCell>
                                            {row.paymentStatus === 'success' ? (
                                                !row.assignedUserId || row.assignedUserId.length <= 0 ? (
                                                    <Button variant="contained" size="small" className={styles.btnDark}
                                                        onClick={() => { setEditEvent(row); setModalType('ASSIGN'); setOpenModal(true); }}>
                                                        Assign Staff
                                                    </Button>
                                                ) : (
                                                    <Box>
                                                        <Button variant="contained" size="small" color="primary" sx={{ mb: 1 }}
                                                            onClick={() => { setEditEvent(row); setModalType('REASSIGN'); setOpenModal(true); }}>
                                                            Modify Staff
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
                        rowsPerPageOptions={recordSizeOptions}
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    />
                </CardContent>
            </Card>

            {/* Unified Modal Implementation (matches your ng-template logic) */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box className={styles.modalBox}>
                    <Typography variant="h6" sx={{ mb: 2 }}>{modalType === 'ASSIGN' ? 'Assign Test' : 'Reassign Test Form'}</Typography>
                    <Divider sx={{ mb: 3 }} />
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHead><TableRow><TableCell>Booking ID</TableCell><TableCell>Instrument</TableCell><TableCell>Assign To</TableCell></TableRow></TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{editEvent?.newBookingId || editEvent?.recordId}</TableCell>
                                    <TableCell>{editEvent?.instrumentName}</TableCell>
                                    <TableCell>
                                        <Select fullWidth size="small" value={AssignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                                            <MenuItem value="">Select Staff</MenuItem>
                                            {AllCifUserList.map(u => <MenuItem key={u.uid} value={u.uid}>{u.uiD_Name}</MenuItem>)}
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button variant="contained" className={styles.btnDark} disabled={!AssignedTo}>Confirm</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}