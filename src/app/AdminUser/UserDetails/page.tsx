'use client';
import Grid from '@mui/material/Grid';
import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Paper, TextField, MenuItem, Button, Select,Modal,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Pagination, Card, CardContent, Divider
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import Cookies from 'js-cookie';
import * as XLSX from 'xlsx';
import myAppWebService from '@/services/myAppWebService';
import styles from './StaffUserDetails.module.css';
import Swal from 'sweetalert2';

 
interface UserRecord {
    candidateName: string;
    emailId: string;
    mobileNumber: string;
    departmentName: string;
    organisation: string;
    supervisorName: string;
    idProofNumber: string;
    userRole: string;
    designation?: string;
    userId: number;
}

export default function StaffUserDetails() {
    const [originalData, setOriginalData] = useState<UserRecord[]>([]);
    const [filteredData, setFilteredData] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number | string>(10);
    
    // Modal States
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<'LOCK'>('LOCK');
    const [editEvent, setEditEvent] = useState<UserRecord | null>(null);

    const handlePageSizeChange = (newSize: number | string) => {
        setLoading(true);
        setItemsPerPage(newSize);
        setCurrentPage(1);
        setTimeout(() => setLoading(false), 500);
    };

    const paginatedData = useMemo(() => {
        const limit = itemsPerPage === 'all' ? filteredData.length : Number(itemsPerPage);
        const start = (currentPage - 1) * limit;
        return filteredData.slice(start, start + limit);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => {
        if (itemsPerPage === 'all') return 1;
        return Math.ceil(filteredData.length / Number(itemsPerPage)) || 1;
    }, [filteredData, itemsPerPage]);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await myAppWebService.GetAllUserData();
            const data = response?.item1 || [];
            setOriginalData(data);
            setFilteredData(data);
        } catch (error) {
            console.error("Error fetching user data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUserDetails(); }, []);

    useEffect(() => {
        setLoading(true);
        let result = [...originalData];
        if (selectedStatus && selectedStatus !== "0") {
            result = result.filter(item => String(item.userRole) === String(selectedStatus));
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                Object.values(item).some(val => String(val).toLowerCase().includes(query))
            );
        }
        setFilteredData(result);
        setCurrentPage(1);
         setTimeout(() => setLoading(false), 500);
    }, [searchQuery, selectedStatus, originalData]);

    const exportToExcel = () => {
        const exportedData = filteredData.map(item => ({
            Name: item.candidateName,
            Email: item.emailId,
            Mobile: item.mobileNumber,
            Role: item.userRole
        }));
        const ws = XLSX.utils.json_to_sheet(exportedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'Staff_Details.xlsx');
    };

    const getRoleLabel = (role: string) => {
        switch (role?.trim()) {
            case '400000': return <span className={styles.roleInternal}>Internal</span>;
            case '400001': return <span className={styles.roleExternal}>External</span>;
            case '400002': return <span className={styles.roleIndustry}>Industry</span>;
            default: return 'Unknown';
        }
    };

const AssignStaff = async (emailId: string | undefined) => {
    if (!emailId) return;
    setOpenModal(false);
    Swal.fire({
        title: 'Are you sure you want to change User State?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, accept current changes!',
        cancelButtonText: 'No, do not change it',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                setLoading(true);                  
                const formData = new FormData();
                formData.append('emailId', emailId);                
                const response = await myAppWebService.CIFLockUser(formData);

                if (response?.responseData === 'Cancel') {
                    Swal.fire('No Change!', 'The operation was not permitted.', 'error');
                } else {
                    Swal.fire('User Locked Successfully!', '', 'success').then(() => {                         
                        fetchUserDetails(); 
                    });
                }
            } catch (error) {
                console.error("Lock error:", error);
                Swal.fire('Error!', 'Something went wrong on the server.', 'error');
            } finally {
                setLoading(false);
            }
        } else {             
            Swal.fire('Cancelled', 'No changes were made.', 'error');
        }
    });
};
    

    return (
         <div className='section bgDarkYellow'>
             {loading && (
                <div className="fullScreenLoader">
                    <div className="customSpinnerOverlay">
                        <img src="/assets/images/spinner.gif" alt="Loading..." />
                    </div>
                </div>
            )}
        
        
        <Box sx={{ p: 4 }}>
            {loading && <div className="fullScreenLoader"><div className="customSpinnerOverlay"><img src="/assets/images/spinner.gif" alt="Loading" /></div></div>}
            
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom align="center" fontWeight="bold">All CIF User Details</Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid sx={{xs:12,md:2}}>
                        <Button fullWidth variant="contained" onClick={exportToExcel} sx={{ bgcolor: '#333', height: '40px' }}>Export</Button>
                    </Grid>
                    <Grid sx={{xs:12,md:2}}>
                        <TextField select size='small' fullWidth label="Rows" value={itemsPerPage} onChange={(e) => handlePageSizeChange(e.target.value)}>
                            {[5, 10, 20, 50].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                             <TextField
                             size='small'
                             select
                             fullWidth
                             label="User Type"
                             value={selectedStatus}
                             onChange={(e) => setSelectedStatus(e.target.value)}
                         >
                             <MenuItem value="">All Users</MenuItem>
                             <MenuItem value="400000">Internal User</MenuItem>
                             <MenuItem value="400001">External User</MenuItem>
                             <MenuItem value="400002">Industry User</MenuItem>
                         </TextField>
                     </Grid>
                    <Grid sx={{xs:12,md:5}}>
                        <TextField size='small' fullWidth placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <SearchIcon /> }} />
                    </Grid>
                </Grid>

                <TableContainer component={Paper} >
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.headerCell}>Name</TableCell>
                                <TableCell className={styles.headerCell}>Email</TableCell>
                                <TableCell className={styles.headerCell}>Mobile</TableCell>
                                <TableCell className={styles.headerCell}>Department</TableCell>
                                <TableCell className={styles.headerCell}>Organisation</TableCell>
                                <TableCell className={styles.headerCell}>Supervisor</TableCell>
                                <TableCell className={styles.headerCell}>Reg.Id</TableCell>
                                <TableCell className={styles.headerCell}>Role </TableCell>
                                <TableCell align="center" className={styles.headerCell}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.length > 0 ? paginatedData.map((row, idx) => (
                                <TableRow key={idx} hover>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{row.candidateName}</TableCell>
                                    <TableCell>{row.emailId}</TableCell>
                                    <TableCell>{row.mobileNumber}</TableCell>
                                    <TableCell>{row.departmentName}</TableCell>
                                    <TableCell>{row.organisation}</TableCell>
                                    <TableCell>{row.supervisorName}</TableCell>
                                    <TableCell>{row.idProofNumber}</TableCell>
                                    <TableCell>{getRoleLabel(row.userRole)}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="contained" size="small" onClick={() => { setEditEvent(row); setOpenModal(true); }}>
                                            Action
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <Typography sx={{ py: 3 }}>No Records Found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination count={totalPages} page={currentPage} onChange={(_, v) => setCurrentPage(v)} color="primary" />
                </Box>
            </Paper>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 500, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4
                }}>
                    <Typography variant="h6">Disabling User : {editEvent?.candidateName}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2"><strong>Registration ID:</strong> {editEvent?.idProofNumber}</Typography>
                        <Typography variant="body2"><strong>Email:</strong> {editEvent?.emailId}</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>Are you sure you want to perform this action for this user?</Typography>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => AssignStaff(editEvent?.emailId)}
                        >
                            Confirm Action
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
        </div>
    );
}
