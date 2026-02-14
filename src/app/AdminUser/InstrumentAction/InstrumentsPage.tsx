'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography, TextField, Button, Grid, Divider, Modal,
    IconButton, Tooltip, Pagination, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArticleIcon from '@mui/icons-material/Article';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import styles from './Instruments.module.css';

import myAppWebService from '@/services/myAppWebService';
import { DownloadIcon, FileIcon, LockIcon, SaveAllIcon, UnlockIcon } from 'lucide-react';
interface Instrument {
    instrumentId: string;
    instrumentName: string;
    sampleExcelSheetUrl: string;
    isActive: boolean;
    instrumentExcelUrl?: string;
}

export default function AdminActionInstruments() {
    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [filteredData, setFilteredData] = useState<Instrument[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal States
    const [openReplaceModal, setOpenReplaceModal] = useState(false);
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/CIFSampleExcelSheets/';

    useEffect(() => {
        fetchAllInstruments();
    }, []);

    // API: GET ALL
    const fetchAllInstruments = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const response = await myAppWebService.GetAllInstruments();
            if (response.item1) {
                setInstruments(response.item1);
                setFilteredData(response.item1);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            const elapsed = Date.now() - startTime;
            setTimeout(() => setLoading(false), Math.max(2500 - elapsed, 0));
        }
    };

    // SEARCH LOGIC
    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = instruments.filter(item =>
            item.instrumentName.toLowerCase().includes(query) ||
            item.instrumentId.toString().includes(query)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchQuery, instruments]);

    // PAGINATION LOGIC
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    // EXCEL EXPORT
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Instruments");
        XLSX.writeFile(wb, "Instruments_Report.xlsx");
    };

    // ACTION: CHANGE STATE
    const handleStatusChange = async (instrument: Instrument) => {
        const result = await Swal.fire({
            title: 'Change Device State?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, change it!',
        });

        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('Id', instrument.instrumentId);
            try {
                const res = await myAppWebService.CIFUpdateStatusInstruments(formData);
                if (res.responseData !== 'Cancel') {
                    Swal.fire('Updated!', 'Status changed successfully.', 'success');
                    fetchAllInstruments();
                }
            } catch (err) {
                Swal.fire('Error', 'Failed to update status', 'error');
            }
        }
    };

    // FILE SELECTION
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 1148576) {
                Swal.fire('Warning', 'File exceeds 1MB', 'warning');
                return;
            }
            setUploadFile(file);
        }
    };

    // API: POST REPLACE EXCEL
    const handleReplaceExcel = async () => {
        if (!uploadFile || !selectedInstrument) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('InstrumentId', selectedInstrument.instrumentId);
        formData.append('FilePath', uploadFile.name);
        formData.append('File', uploadFile); // The service handles base64 if needed

        try {
            const res = await myAppWebService.ReplaceExcelSheetSample(formData);
            if (res.item1[0]?.msg.toLowerCase() === 'success') {
                Swal.fire('Success', 'Excel Sheet replaced!', 'success');
                setOpenReplaceModal(false);
                fetchAllInstruments();
            }
        } catch (error) {
            Swal.fire('Error', 'Upload failed', 'error');
        } finally {
            setLoading(false);
        }
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
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Instruments Management
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Grid sx={{ xs: 12, md: 4 }}>
                            <Button
                                variant="contained"
                                color="inherit"
                                startIcon={<FileDownloadIcon />}
                                onClick={exportToExcel}
                                sx={{ bgcolor: '#212121', color: 'white' }}
                            >
                                Export to Excel
                            </Button>
                        </Grid>
                        <Grid sx={{ xs: 12, md: 8 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search by Instrument Name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={styles.headerCell}>ID</TableCell>
                                    <TableCell className={styles.headerCell}>Instrument Name</TableCell>
                                    <TableCell className={styles.headerCell}>Excel Template</TableCell>
                                    <TableCell className={styles.headerCell}>Status</TableCell>
                                    <TableCell className={styles.headerCell} align="center">Disable </TableCell>
                                    <TableCell className={styles.headerCell} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((row) => (
                                    <TableRow key={row.instrumentId} hover>
                                        <TableCell>{row.instrumentId}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{row.instrumentName}</TableCell>
                                        <TableCell>
                                            {row.sampleExcelSheetUrl ? (
                                                <Tooltip title="View Excel">
                                                    <IconButton
                                                        color="info"
                                                        href={`${serverUrl}${row.sampleExcelSheetUrl}`}
                                                        target="_blank"
                                                    >
                                                        <DownloadIcon />
                                                        {/* <ArticleIcon /> */}
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Typography variant="caption" color="error">No Excel</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className={row.isActive ? styles.statusAvailable : styles.statusUnavailable}>
                                                {row.isActive ? 'Available' : 'Unavailable'}
                                            </span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Change Status">
                                                <IconButton color="error" onClick={() => handleStatusChange(row)}>
                                                    {row.isActive ? <LockIcon /> : <UnlockIcon />}
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                size="large"
                                                // variant="outlined" 
                                                color="error"
                                                startIcon={<UploadFileIcon />}
                                                onClick={() => { setSelectedInstrument(row); setOpenReplaceModal(true); }}
                                                sx={{ ml: 1 }}
                                            >
                                                {/* Replace */}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box className={styles.paginationContainer}>
                        <Pagination
                            count={Math.ceil(filteredData.length / itemsPerPage)}
                            page={currentPage}
                            onChange={(_, v) => setCurrentPage(v)}
                            color="primary"
                        />
                    </Box>
                </Paper>

                {/* REPLACE EXCEL MODAL */}
                <Modal open={openReplaceModal} onClose={() => setOpenReplaceModal(false)}>
                    <Box className={styles.modalBox}>
                        <Typography variant="h6">Replace Excel Sheet</Typography>
                        <Divider sx={{ my: 2 }} />
                        {selectedInstrument && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2">Instrument: {selectedInstrument.instrumentName}</Typography>
                                <Typography variant="caption">ID: {selectedInstrument.instrumentId}</Typography>
                            </Box>
                        )}
                        <input
                            type="file"
                            accept=".xls,.xlsx"
                            onChange={handleFileChange}
                            style={{ marginBottom: '20px' }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button onClick={() => setOpenReplaceModal(false)}>Cancel</Button>
                            <Button
                                variant="contained"
                                disabled={!uploadFile}
                                onClick={handleReplaceExcel}
                            >
                                Upload & Replace
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </div>
    );
}