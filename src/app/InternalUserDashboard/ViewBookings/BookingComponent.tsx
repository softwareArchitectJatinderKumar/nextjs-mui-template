"use client";

import Cookies from 'js-cookie';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    Dialog, DialogTitle, DialogContent, IconButton,
    Typography, Box, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import myAppWebService from '@/services/myAppWebService';
import router from 'next/router';


interface UserDetails {
    CandidateName: string;
    UserId: string;
    DepartmentName: string;
    EmailId: string;
    MobileNo: string;
    UserRole: string;
    SupervisorName: string;
    ProofNumber: string;
    ProofName: string;
}


const BookingDashboard = () => {

    const TypeId = 'CIF';
    // --- States ---
    const [baseUrl, setBaseUrl] = useState('');
    const [responseUrl, setResponseUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [allData, setAllData] = useState<any[]>([]); // Original Source
    const [allStatusData, setAllStatusData] = useState<any[]>([]); // Original Source
    const [filteredData, setFilteredData] = useState<any[]>([]); // For Search/Display
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [userData, setUserData] = useState<UserDetails | null>(null);
    // Modal States
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [sampleStatus, setSampleStatus] = useState<any>(null);

    const itemsPerPage = 10;
    const serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentBase = `${window.location.origin}${window.location.pathname.split('/').slice(0, -1).join('/')}`;
            setBaseUrl(currentBase);
            setResponseUrl(`${currentBase}/ViewBookings`);
        }
    }, []);


    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await myAppWebService.GetAllSampleStatus();
                const statusData = response.item1 || [];

                if (statusData) {
                    setAllStatusData(statusData);
                }
            } catch (error) {
                console.log('error ' + error)
            } finally { }

        }
        fetchStatus();
    }, [router]);


    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const cookieData = Cookies.get('InternalUserAuthData');
                if (!cookieData) {
                    console.warn("No auth cookie found");
                    Cookies.remove('InternalUserAuthData');
                    router.push('/login');
                    return;
                }

                const parsedData = JSON.parse(cookieData);

                const email = parsedData.EmailId;
                setUserEmail(email);
                setUserData(parsedData);
            } catch (error) {
                console.error("Failed to parse auth cookie:", error);
                router.push('/login');
            } finally {
            }
        };
        fetchUser();
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!userEmail) return;

            try {
                setLoading(true);
                const response = await myAppWebService.GetUserAllBookingSlot(userEmail);
                // const response = await myAppWebService.GetUserAllBookingSlot('prashant.16477@lpu.co.in');
                const actualData = response.item1 || [];

                if (actualData) {
                    setAllData(actualData);
                    setFilteredData(actualData);
                }
            } catch (error) {
                console.error("Error fetching bookings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userEmail]);


    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
        const filtered = allData.filter(item =>
            item.instrumentName.toLowerCase().includes(query.toLowerCase()) ||
            item.id.toString().includes(query)
        );
        setFilteredData(filtered);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredData, currentPage]);

    const handleCheckStatus = async (booking: any) => {
        try {
            setLoading(true);
            const targetBookingId = booking.bookingId;
            const targetInstrumentId = booking.instrumentId;

            const filteredStatus = allStatusData.filter(
                (item: any) =>
                    item.bookingId == targetBookingId &&
                    item.instrumentId == targetInstrumentId
            );
            console.log(allStatusData, 'AllStatus')
            console.log(filteredStatus, 'Filtered Status')
            if (filteredStatus && filteredStatus.length > 0) {
                setSampleStatus(filteredStatus);
                setStatusModalOpen(true);
            } else {
                setSampleStatus([]);
                Swal.fire({
                    title: 'No Data Found',
                    text: 'No sample status data available for the selected booking.',
                    icon: 'info',
                    confirmButtonColor: '#ef7d00'
                });
            }
        } catch (err) {
            alert("Could not fetch status updates.");
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = (fileName: string) => {
        window.open(`${serverUrl}/${fileName}`, '_blank');
    };



    const verifyData = async (bookingCase: any) => {
        setLoading(true);
        const startTime = new Date().getTime();
        const formData = new FormData();
        formData.append('BookingId', bookingCase.id);
        formData.append('InstrumentId', bookingCase.instrumentId);
        formData.append('CandidateName', userData?.CandidateName || '');
        formData.append('Amount', bookingCase.totalCharges);
        formData.append('Type', TypeId);
        formData.append('UserEmailId', userData?.EmailId || '');
        formData.append('MobileNo', userData?.MobileNo || '');
        formData.append('FacultyCode', userData?.EmailId || '');
        formData.append('ResponseUrl', responseUrl);

        try {
            const response = await myAppWebService.MakePaymentforTest(formData);

            if (response && response.item1 && response.item1.length > 0) {
                const paymentUrlData = response.item1[0].url;

                if (paymentUrlData) {
                    window.location.href = paymentUrlData;
                } else {
                    Swal.fire({
                        title: 'Error Occurred',
                        text: 'Payment URL not found!',
                        icon: 'error',
                        confirmButtonColor: '#ef7d00'
                    });
                }
            } else {
                throw new Error('No data received');
            }
        } catch (error) {
            console.error('Error during payment API call:', error);
            Swal.fire({
                title: 'Error',
                text: 'Payment Gateway Failed!',
                icon: 'error',
                confirmButtonColor: '#ef7d00'
            });
        } finally {
            const elapsed = new Date().getTime() - startTime;
            const remainingDelay = Math.max(2500 - elapsed, 0);

            setTimeout(() => {
                setLoading(false);
            }, remainingDelay);
        }
    };

    if (loading && allData.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress sx={{ color: '#ef7d00' }} />
            </Box>
        );
    }

    return (
        <div className="container-fluid BottomSpace p-4">
            {allData.length > 0 ? (
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="row mb-4 align-items-center">
                            <div className="col-md-3">
                                <button className="btn btn-dark w-100" onClick={() => console.log('Exporting...')}>
                                    Export to Excel
                                </button>
                            </div>
                            <div className="col-md-6 text-center">
                                <h3 className="fw-bold m-0">Payment and Booking Details</h3>
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by ID or Instrument..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>


                        {allData.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="d-none d-md-table-cell">ID</th>
                                            <th>Instrument Name</th>
                                            <th className="d-none d-lg-table-cell">Charges</th>
                                            <th className="d-none d-lg-table-cell">Request Date</th>
                                            <th className="d-none d-lg-table-cell">Sheet</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((row, index) => (
                                            <tr key={`${row.bookingId}-${index}`}>
                                                <td className="fw-bold d-none d-md-table-cell">{row.id}</td>
                                                <td>{row.instrumentName}</td>
                                                <td className="d-none d-lg-table-cell">₹{row.analysisCharges}</td>
                                                <td className="d-none d-lg-table-cell">{row.bookingRequestDate}</td>
                                                <td className="d-none d-lg-table-cell">
                                                    {row.fileName ? (
                                                        <button className="btn btn-sm btn-outline-dark" onClick={() => downloadFile(row.fileName)}>View</button>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="fw-bold">₹{row.totalCharges}</td>
                                                <td>
                                                    {row.paymentDate ? (
                                                        <span className="badge bg-success">Paid: {row.paymentDate}</span>
                                                    ) : (
                                                        <button className="btn btn-sm btn-dark" onClick={() => { setSelectedBooking(row); setPaymentModalOpen(true); }}>
                                                            Pay Now
                                                        </button>
                                                    )}
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleCheckStatus(row)}>
                                                        Check Status
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                                    <IconButton disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                                        <ChevronLeft />
                                    </IconButton>
                                    <Typography variant="body2">Page {currentPage} of {totalPages}</Typography>
                                    <IconButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                        <ChevronRight />
                                    </IconButton>
                                </div>
                            </div>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <Typography variant="h5" color="textSecondary">No Result Found.</Typography>
                            </Box>
                        )}
                    </div>
                </div>
            ) : (
                <Box sx={{ textAlign: 'center', py: 15, border: '2px dashed #ccc', borderRadius: 4 }}>
                    <h2 style={{ color: '#ef7d00' }}>No Booking Records Found</h2>
                    <p className="text-muted">Once you make a booking, it will appear here.</p>
                </Box>
            )}

            <Dialog open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle className="d-flex justify-content-between">
                    Payment Confirmation
                    <IconButton onClick={() => setPaymentModalOpen(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedBooking && (
                        <div className="p-3 text-center">
                            <h5>Booking ID: {selectedBooking.id}</h5>
                            <p className="fs-4 fw-bold">Amount to Pay: ₹{selectedBooking.totalCharges}</p>
                            <button className="btn btn-dark btn-lg w-100 mt-3" onClick={() => verifyData(selectedBooking)}>
                                Confirm and Pay
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                maxWidth="md" // Changed to md to give the table more breathing room
                fullWidth
            >
                <DialogTitle className="d-flex justify-content-between align-items-center">
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Sample Status Update</Typography>
                    <IconButton onClick={() => setStatusModalOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {/* Check if sampleStatus exists and has items */}
                    {sampleStatus && sampleStatus.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>Instrument ID</th>
                                        <th>Received On</th>
                                        <th>Sample Condition</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleStatus.map((row: any, index: number) => (
                                        <tr key={`${row.bookingId}-${index}`}>
                                            <td className="fw-bold">{index+1}</td>
                                            <td>{row.instrumentId}</td>
                                            <td>{row.receivedOn}</td>
                                            <td>
                                                <span className={`badge ${row.sampleCondition?.toLowerCase() === 'good' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                    {row.sampleCondition}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <Box sx={{ py: 5, textAlign: 'center' }}>
                            <Typography color="textSecondary">
                                No status updates available for this booking.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookingDashboard;