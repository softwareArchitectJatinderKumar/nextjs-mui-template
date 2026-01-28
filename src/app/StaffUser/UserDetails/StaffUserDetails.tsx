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
import styles from './StaffUserDetails.module.css';

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
}

export default function StaffUserDetails() {
    const [originalData, setOriginalData] = useState<UserRecord[]>([]);
    const [filteredData, setFilteredData] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

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
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const response = await myAppWebService.GetAllUserData();
            const data = response?.item1 || [];
            const sorted = [...data].sort((a, b) => Number(b.idProofNumber) - Number(a.idProofNumber));
            setOriginalData(sorted);
            setFilteredData(sorted);
        } catch (error) {
            console.error("Error fetching user data", error);
        } finally {
            const elapsed = Date.now() - startTime;
            setTimeout(() => setLoading(false), Math.max(1500 - elapsed, 0));
        }
    };

    useEffect(() => {
        let result = [...originalData];

        if (selectedStatus) {
            setLoading(true);
            const timer = setTimeout(() => setLoading(false), 1500);
            result = result.filter(item => item.userRole === selectedStatus);
            return () => clearTimeout(timer);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                Object.values(item).some(val => String(val).toLowerCase().includes(query))
            );
        }

        setFilteredData(result);
        setCurrentPage(1);
    }, [searchQuery, selectedStatus, originalData]);

    const exportToExcel = () => {
        const exportedData = filteredData.map(item => ({
            EmailId: item.emailId,
            CandidateName: item.candidateName,
            MobileNo: item.mobileNumber,
            Department: item.departmentName,
            SchoolName: item.organisation,
            SupervisorName: item.supervisorName,
            Designation: item.designation || 'NA',
            Role: item.userRole === '400000' ? 'Internal' : item.userRole === '400001' ? 'External' : 'Industry'
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
                        Staff User Details
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

                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={styles.headerCell}>Candidate Name</TableCell>
                                    <TableCell className={styles.headerCell}>Email Id</TableCell>
                                    <TableCell className={styles.headerCell}>Mobile</TableCell>
                                    <TableCell className={styles.headerCell}>Department</TableCell>
                                    <TableCell className={styles.headerCell}>Organisation</TableCell>
                                    <TableCell className={styles.headerCell}>Supervisor</TableCell>
                                    <TableCell className={styles.headerCell}>Reg. ID</TableCell>
                                    <TableCell className={styles.headerCell}>Role</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{row.candidateName}</TableCell>
                                            <TableCell>{row.emailId || 'NA'}</TableCell>
                                            <TableCell>{row.mobileNumber || 'NA'}</TableCell>
                                            <TableCell>{row.departmentName || 'NA'}</TableCell>
                                            <TableCell>{row.organisation || 'NA'}</TableCell>
                                            <TableCell>{row.supervisorName || 'NA'}</TableCell>
                                            <TableCell>{row.idProofNumber || 'NA'}</TableCell>
                                            <TableCell>{getRoleLabel(row.userRole)}</TableCell>
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
// 'use client';
// import Grid from '@mui/material/Grid';
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//     Box, Container, Paper, TextField, MenuItem, Button, Select,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Typography, Pagination, Card, CardContent, Divider
// } from '@mui/material';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import SearchIcon from '@mui/icons-material/Search';
// import Cookies from 'js-cookie';
// import * as XLSX from 'xlsx';
// import myAppWebService from '@/services/myAppWebService';
// import styles from './StaffUserDetails.module.css';

// interface UserRecord {
//     candidateName: string;
//     emailId: string;
//     mobileNumber: string;
//     departmentName: string;
//     organisation: string;
//     supervisorName: string;
//     idProofNumber: string;
//     userRole: string;
//     designation?: string;
// }

// export default function StaffUserDetails() {
//     // State
//     const [originalData, setOriginalData] = useState<UserRecord[]>([]);
//     const [filteredData, setFilteredData] = useState<UserRecord[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedStatus, setSelectedStatus] = useState('');

//     // Pagination
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     useEffect(() => {
//         fetchUserDetails();
//     }, []);

//     const fetchUserDetails = async () => {
//         setLoading(true);
//         const startTime = Date.now();
//         try {
//             const response = await myAppWebService.GetAllUserData();
//             const data = response?.item1 || [];
//             // Sorting logic from Angular: b.idProofNumber - a.idProofNumber
//             const sorted = [...data].sort((a, b) => Number(b.idProofNumber) - Number(a.idProofNumber));
//             setOriginalData(sorted);
//             setFilteredData(sorted);
//         } catch (error) {
//             console.error("Error fetching user data", error);
//         } finally {
//             const elapsed = Date.now() - startTime;
//             setTimeout(() => setLoading(false), Math.max(1500 - elapsed, 0));
//         }
//     };

//     // Logic: Search and Filter combined (mimicking Angular filterData + search)
//     useEffect(() => {
//         let result = [...originalData];

//         // Status Filter
//         if (selectedStatus) {
//             setLoading(true);
//             const timer = setTimeout(() => setLoading(false), 1500);
//             result = result.filter(item => item.userRole === selectedStatus);
//              return () => clearTimeout(timer);
//         }

//         // Search Query
//         if (searchQuery) {
//             const query = searchQuery.toLowerCase();
//             result = result.filter(item =>
//                 Object.values(item).some(val => String(val).toLowerCase().includes(query))
//             );
//         }

//         setFilteredData(result);
//         setCurrentPage(1);
//     }, [searchQuery, selectedStatus, originalData]);

//     // Pagination Slice
//     const paginatedData = useMemo(() => {
//         const start = (currentPage - 1) * itemsPerPage;
//         return filteredData.slice(start, start + itemsPerPage);
//     }, [filteredData, currentPage]);

//     const exportToExcel = () => {
//         const exportedData = filteredData.map(item => ({
//             EmailId: item.emailId,
//             CandidateName: item.candidateName,
//             MobileNo: item.mobileNumber,
//             Department: item.departmentName,
//             SchoolName: item.organisation,
//             SupervisorName: item.supervisorName,
//             Designation: item.designation || 'NA',
//             Role: item.userRole === '400000' ? 'Internal' : item.userRole === '400001' ? 'External' : 'Industry'
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportedData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'User_Details');
//         XLSX.writeFile(wb, 'User_Details_Report.xlsx');
//     };

//     const getRoleLabel = (role: string) => {
//         switch (role?.trim()) {
//             case '400000': return <span className={styles.roleInternal}>Internal User</span>;
//             case '400001': return <span className={styles.roleExternal}>External Academia</span>;
//             case '400002': return <span className={styles.roleIndustry}>Industry User</span>;
//             default: return 'Unknown Role';
//         }
//     };

//     return (
//           <> 
//             {loading && (
//                 <div className="fullScreenLoader">
//                     <div className="customSpinnerOverlay">
//                         <img src="/assets/images/spinner.gif" alt="Loading..." />
//                     </div>
//                 </div>
//             )}
//         <div className="container-fluid p-4">
  
//             <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
//                 <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
//                     Staff User Details
//                 </Typography>
//                 <Divider sx={{ mb: 3 }} />

//                 <Grid container spacing={12} alignItems="center" justifyContent="start">
//                     <Grid size={{ xs: 12, sm: 2 }}>
//                         <Button
//                             fullWidth
//                             variant="contained"
//                             onClick={exportToExcel}
//                             sx={{ bgcolor: '#333' }}
//                         >
//                             Excel
//                         </Button>
//                     </Grid>

//                     <Grid size={{ xs: 12, sm: 5 }}>
//                         <TextField size='small' sx={{ width: '30%' }}
//                             select 
//                             // fullWidth 
//                             label="User Type"
//                             value={selectedStatus}
//                             onChange={(e) => setSelectedStatus(e.target.value)}
//                         >
//                             <MenuItem value="">All Users</MenuItem>
//                             <MenuItem value="400000">Internal User</MenuItem>
//                             <MenuItem value="400001">External User</MenuItem>
//                             <MenuItem value="400002">Industry User</MenuItem>
//                         </TextField>
//                     </Grid>



//                     <Grid size={{ xs: 12, sm: 5 }}>
//                         <TextField size='small' sx={{ width: '30%' }}
//                             // fullWidth
//                             placeholder="Search by name, email, etc..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             InputProps={{
//                                 startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
//                             }}
//                         />
//                     </Grid>
//                 </Grid>

//                 <Box sx={{ mt: 3, mb: 1 }}>
//                     <Typography variant="body2" className="themeClr" sx={{ fontWeight: 'bold', border: '1px solid #ef7d00', display: 'inline-block', p: 1, borderRadius: 1 }}>
//                         Record Count: {filteredData.length} | Total Pages: {Math.ceil(filteredData.length / itemsPerPage)}
//                     </Typography>
//                 </Box>

//                 <TableContainer component={Paper} className={styles.tableContainer}>
//                     <Table stickyHeader>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell className={styles.headerCell}>Candidate Name</TableCell>
//                                 <TableCell className={styles.headerCell}>Email Id</TableCell>
//                                 <TableCell className={styles.headerCell}>Mobile</TableCell>
//                                 <TableCell className={styles.headerCell}>Department</TableCell>
//                                 <TableCell className={styles.headerCell}>Organisation</TableCell>
//                                 <TableCell className={styles.headerCell}>Supervisor</TableCell>
//                                 <TableCell className={styles.headerCell}>Reg. ID</TableCell>
//                                 <TableCell className={styles.headerCell}>Role</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {paginatedData.length > 0 ? (
//                                 paginatedData.map((row, index) => (
//                                     <TableRow key={index} hover>
//                                         <TableCell sx={{ fontWeight: 'bold' }}>{row.candidateName}</TableCell>
//                                         <TableCell>{row.emailId || 'NA'}</TableCell>
//                                         <TableCell>{row.mobileNumber || 'NA'}</TableCell>
//                                         <TableCell>{row.departmentName || 'NA'}</TableCell>
//                                         <TableCell>{row.organisation || 'NA'}</TableCell>
//                                         <TableCell>{row.supervisorName || 'NA'}</TableCell>
//                                         <TableCell>{row.idProofNumber || 'NA'}</TableCell>
//                                         <TableCell>{getRoleLabel(row.userRole)}</TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan={8} align="center">
//                                         <Typography variant="h6" color="error" sx={{ py: 5 }}>No Grid Data Available.</Typography>
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//                 <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//                     <Pagination
//                         count={Math.ceil(filteredData.length / itemsPerPage)}
//                         page={currentPage}
//                         onChange={(_, value) => setCurrentPage(value)}
//                         color="primary"
//                         shape="rounded"
//                     />
//                 </Box>
//             </Paper>
//         </div>
//         </>
//     );
// }