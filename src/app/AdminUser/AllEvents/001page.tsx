'use client';
import Grid from '@mui/material/Grid';
import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Paper, TextField, MenuItem, Button, Select, Modal,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Pagination, Card, CardContent, Divider
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import Cookies from 'js-cookie';
import * as XLSX from 'xlsx';
import myAppWebService from '@/services/myAppWebService';
import styles from './UserFeedbackDetails.module.css';
import Swal from 'sweetalert2';


interface UserRecord {
    eventName: string;
    eventDate: string;
    eventCategory: string;
    eventDetails: string;
    imageUrl: string;
    eventId: string;

}

export default function UserFeedbackDetails() {
    const [originalData, setOriginalData] = useState<UserRecord[]>([]);
    const [filteredData, setFilteredData] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    // const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number | string>(10);

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

    const getAllEvents = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('Action', 'View');

            const response = await myAppWebService.getEvents();
            const data = response?.item1 || [];
            setOriginalData(data);
            setFilteredData(data);
        } catch (error) {
            console.error("Error fetching user data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { getAllEvents(); }, []);

    useEffect(() => {
        // setLoading(true);
        let result = [...originalData];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                Object.values(item).some(val => String(val).toLowerCase().includes(query))
            );
        }
        setFilteredData(result);
        setCurrentPage(1);
        //  setTimeout(() => setLoading(false), 500);
    }, [searchQuery, originalData]);

    const exportToExcel = () => {
        const exportedData = filteredData.map(item => ({
            Name: item.eventName,
            Category: item.eventCategory,
            EventDate: item.eventDate,
            EventDetails: item.eventDetails

        }));
        const ws = XLSX.utils.json_to_sheet(exportedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'Events_Details.xlsx');
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
                    <Typography variant="h5" gutterBottom align="center" fontWeight="bold">All Events Details</Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid sx={{ xs: 12, md: 2 }}>
                            <Button fullWidth variant="contained" onClick={exportToExcel} sx={{ bgcolor: '#333', height: '40px' }}>Export</Button>
                        </Grid>
                        <Grid sx={{ xs: 12, md: 2 }}>
                            <TextField select size='small' fullWidth label="Rows" value={itemsPerPage} onChange={(e) => handlePageSizeChange(e.target.value)}>
                                {[5, 10, 20, 50].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                            </TextField>
                        </Grid>

                        <Grid sx={{ xs: 12, md: 5 }}>
                            <TextField size='small' fullWidth placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <SearchIcon /> }} />
                        </Grid>
                    </Grid>
                    {/* EventId,    		                EventName , EventDate,  EventCategory, EventDetails,   		            ImageUrl  */}
                    <TableContainer component={Paper} >
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={styles.headerCell}>Name</TableCell>
                                    <TableCell className={styles.headerCell}>Date </TableCell>
                                    <TableCell className={styles.headerCell}>Category </TableCell>
                                    <TableCell className={styles.headerCell}>Details </TableCell>
                                    <TableCell className={styles.headerCell}>Image Url</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.length > 0 ? paginatedData.map((row, idx) => (
                                    <TableRow key={idx} hover>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{row.eventName}</TableCell>
                                        <TableCell>{row.eventDate}</TableCell>
                                        <TableCell>{row.eventCategory}</TableCell>
                                        <TableCell>{row.eventDetails}</TableCell>
                                        <TableCell>{row.imageUrl}</TableCell>

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


            </Box>
        </div>
    );
}
