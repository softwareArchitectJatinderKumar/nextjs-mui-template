'use client';
import Grid from '@mui/material/Grid'; // Using Grid2 for MUI v6 consistency
import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Paper, TextField, MenuItem, Button, Select,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Pagination, Card, CardContent, Divider
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import Cookies from 'js-cookie';
import * as XLSX from 'xlsx';
import myAppWebService from '@/services/myAppWebService';
import styles from './PaymentDetails.module.css';

interface UserRecord {
    id: number;
    bookingId: string;
    instrumentId: string;
    candidateName: string;
    amount: string;
    userEmailId: string;
    mobileNo: string;
    requestDate: string;
    instrumentName: string;
    paymentStatus: string;
    paymentDate: string;
    userRole: string;
    noOfSamples: string;
    totalCharges: string;
    organisationName: string;
}

export default function PaymentDetails() {
    const [originalData, setOriginalData] = useState<UserRecord[]>([]);
    const [filteredData, setFilteredData] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPaymentStatus, setselectedPaymentStatus] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number | string>(10);

    const handlePageSizeChange = (newSize: number | string) => {
        setLoading(true);
        setTimeout(() => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
            setLoading(false);
        }, 800); 
    };

    const handlePageChange = (value: number) => {
        setLoading(true);
        setCurrentPage(value);
        setTimeout(() => setLoading(false), 500);
    };

    const paginatedData = useMemo(() => {
        const limit = itemsPerPage === 'all' ? filteredData.length : Number(itemsPerPage);
        const start = (currentPage - 1) * (itemsPerPage === 'all' ? 0 : limit);
        
        if (itemsPerPage === 'all') return filteredData;
        return filteredData.slice(start, start + limit);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => {
        if (itemsPerPage === 'all') return 1;
        return Math.ceil(filteredData.length / Number(itemsPerPage));
    }, [filteredData, itemsPerPage]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const response = await myAppWebService.GetAllPaymentDetails();
            const data = response?.item1 || [];
            const sorted = [...data].sort((a, b) => Number(b.bookingId) - Number(a.bookingId));
            // setFilteredData(sorted);
            setOriginalData(sorted);
            setFilteredData(sorted);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            const elapsed = Date.now() - startTime;
            setTimeout(() => setLoading(false), Math.max(1500 - elapsed, 0));
        }
    };
useEffect(() => {
    let result = [...originalData];

    if (selectedPaymentStatus && selectedPaymentStatus !== 'All') {
        result = result.filter(item => {
            const statusFromApi = item.paymentStatus ? item.paymentStatus.toLowerCase() : 'pending';
            return statusFromApi === selectedPaymentStatus.toLowerCase();
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

    setFilteredData(result);
    setCurrentPage(1);
}, [searchQuery, selectedPaymentStatus, originalData]);

    const exportToExcel = () => {
        const exportedData = filteredData.map(item => ({
            id: item.id,
            bookingId: item.bookingId,
            instrumentId: item.instrumentId,
            candidateName: item.candidateName,
            amount: item.amount,
            userEmaildId: item.userEmailId,
            mobileNo: item.mobileNo,
            requestDate: item.requestDate,
            instrumentName: item.instrumentName,
            paymentStatus: item.paymentStatus,
            paymentDate: item.paymentDate,
            userRole: item.userRole,
            noOfSamples: item.noOfSamples,
            totalCharges: item.totalCharges,
            organisationName: item.organisationName

        }));

        const ws = XLSX.utils.json_to_sheet(exportedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'User_Details');
        XLSX.writeFile(wb, 'User_Details_Report.xlsx');
    };

    const getRoleLabel = (role: string) => {
        switch (role?.trim()) {
            case '400000': return <span className={styles.roleInternal}>Internal User</span>;
            case '400001': return <span className={styles.roleExternal}>External Academia</span>;
            case '400002': return <span className={styles.roleIndustry}>Industry User</span>;
            default: return 'Unknown Role';
        }
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
            <div className="container-fluid p-4">

                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
                        User Booking and Payment Details
                    </Typography>
                    <Divider sx={{ mb: 3 }} />



                    <Grid container spacing={2} alignItems="center" sx={{ width: '100%', mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 1.5, lg:1.4 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={exportToExcel}
                                sx={{ bgcolor: '#333', height: '40px' }}
                            >
                                Export to Excel
                            </Button>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                            <TextField
                                size='small'
                                select
                                fullWidth
                                label="Rows"
                                value={itemsPerPage}
                                onChange={(e) => handlePageSizeChange(e.target.value)}
                            >
                                {[5, 10, 15, 20, 25].map((val) => (
                                    <MenuItem key={val} value={val}>{val}</MenuItem>
                                ))}
                            </TextField>
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
                        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                            <TextField
                                size='small'
                                fullWidth
                                placeholder="Search by name, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, mb: 1 }}>
                        <Typography variant="body2" className="themeClr" sx={{ fontWeight: 'bold', border: '1px solid #ef7d00', display: 'inline-block', p: 1, borderRadius: 1 }}>
                            Record Count: {filteredData.length} | Total Pages: {totalPages}
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} >
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={styles.headerCell}>Booking Id </TableCell>
                                    <TableCell className={styles.headerCell}>Candidate Name </TableCell>
                                    <TableCell className={styles.headerCell}>Email Id </TableCell>
                                    <TableCell className={styles.headerCell}>Organisation Name </TableCell>
                                    <TableCell className={styles.headerCell}>Mobile No </TableCell>
                                    <TableCell className={styles.headerCell}>Request Date </TableCell>
                                    <TableCell className={styles.headerCell}>Instrument Name </TableCell>
                                    <TableCell className={styles.headerCell}>Payment Status </TableCell>
                                    <TableCell className={styles.headerCell}>Payment Date </TableCell>
                                    <TableCell className={styles.headerCell}>User Role </TableCell>
                                    <TableCell className={styles.headerCell}>Sample Count </TableCell>
                                    <TableCell className={styles.headerCell}>Amount </TableCell>
                                    <TableCell className={styles.headerCell}>Total Charges </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{row.bookingId}</TableCell>
                                            <TableCell>{row.candidateName}</TableCell>
                                            <TableCell>{row.amount}</TableCell>
                                            <TableCell>{row.userEmailId}</TableCell>
                                            <TableCell>{row.mobileNo}</TableCell>
                                            {/* <TableCell>{row.requestDate}</TableCell> */}
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                {(() => {
                                                    if (!row.requestDate || row.requestDate === "null") return "N/A";
                                                    const cleanDateStr = row.requestDate.trim().replace(/\s+/g, ' ');
                                                    const dateObj = new Date(cleanDateStr);
                                                    if (isNaN(dateObj.getTime())) {
                                                        return cleanDateStr.split(' ').slice(0, 3).join(' ');
                                                    }
                                                    return dateObj.toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    });
                                                })()}
                                            </TableCell>
                                            <TableCell>{row.instrumentName}</TableCell>
                                            <TableCell sx={{ fontWeight: '500' }}>
                                                {(() => {
                                                    const status = row.paymentStatus?.toLowerCase();
                                                    if (status === 'success') {
                                                        return <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>Paid</span>; // Green
                                                    }
                                                    if (status === 'failure') {
                                                        return <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>Failed</span>; // Red
                                                    }
                                                    return <span style={{ color: '#000000', fontWeight: 'bold' }}>Pending</span>; // Black
                                                })()}
                                            </TableCell>
                                            {/* <TableCell>{row.paymentStatus==='success'?'Paid': row.paymentStatus==='failure'?'Failed': 'Pending'}</TableCell> */}
                                            {/* <TableCell>{row.paymentDate?.length>0? row.paymentDate: 'NA'}</TableCell> */}
                                             <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                {(() => {
                                                    if (!row.paymentDate || row.paymentDate === "null") return "N/A";
                                                    const cleanDateStr = row.paymentDate.trim().replace(/\s+/g, ' ');
                                                    const dateObj = new Date(cleanDateStr);
                                                    if (isNaN(dateObj.getTime())) {
                                                        return cleanDateStr.split(' ').slice(0, 3).join(' ');
                                                    }
                                                    return dateObj.toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    });
                                                })()}
                                            </TableCell>
                                            <TableCell>{row.userRole}</TableCell>
                                            <TableCell>{row.noOfSamples}</TableCell>
                                            <TableCell sx={{ fontWeight: '500' }}>
                                                {row.totalCharges ? `₹ ${Number(row.totalCharges).toLocaleString('en-IN')}` : '₹ 0'}
                                            </TableCell>
                                            {/* <TableCell>{row.totalCharges}</TableCell> */}
                                            <TableCell>{row.organisationName}</TableCell>

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography variant="h6" color="error" sx={{ py: 5 }}>No Grid Data Available.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {itemsPerPage !== 'all' && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(_, value) => setCurrentPage(value)}
                                color="primary"
                                shape="rounded"
                            />
                        </Box>
                    )}
                </Paper>
            </div>
        </>
    );
}
