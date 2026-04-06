"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, TextField, Select, MenuItem, InputLabel, 
  FormControl, CircularProgress, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, Grid, Switch, FormControlLabel
} from '@mui/material';
import { 
  CloudUpload, FileDownload, Edit, Refresh, Search, Save 
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import styles from './UpdateInstrumentPrice.module.css';
import myAppWebService from '@/services/myAppWebService'; // Your existing API service

export default function AdminInstrumentPanel() {
  const [loading, setLoading] = useState(false);
  const [instruments, setInstruments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Pricing States
  const [priceForm, setPriceForm] = useState({
    userRole: 'Select',
    instrumentId: 'Select',
    analysisId: 'Select',
    durationId: 'Select',
    currentPrice: 0,
    newPrice: ''
  });

  const [analysisData, setAnalysisData] = useState([]);
  const [durations, setDurations] = useState([]);

  useEffect(() => {
    fetchInstruments();
  }, []);

  const fetchInstruments = async () => {
    setLoading(true);
    try {
      const response = await myAppWebService.GetAllInstruments();
      setInstruments(response.item1 || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Instrument Actions ---
  
  const handleToggleStatus = async (instrument: any) => {
    const result = await Swal.fire({
      title: 'Change State?',
      text: `Do you want to toggle visibility for ${instrument.instrumentName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef7d00'
    });

    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append('Id', instrument.instrumentId);
      try {
        await myAppWebService.CIFUpdateStatusInstruments(formData);
        Swal.fire('Updated!', 'Status changed successfully.', 'success');
        fetchInstruments();
      } catch (e) {
        Swal.fire('Error', 'Failed to update status', 'error');
      }
    }
  };

  const handleExcelUpload = async (instrument: any) => {
    if (!selectedFile) return Swal.fire('Error', 'Please select a file first', 'error');

    const formData = new FormData();
    formData.append('InstrumentId', instrument.instrumentId);
    formData.append('FilePath', selectedFile.name);
    // Converting file to base64 as per your Angular logic requirement
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      formData.append('File', base64);
      
      try {
        setLoading(true);
        await myAppWebService.ReplaceExcelSheetSample(formData);
        Swal.fire('Success', 'Excel sheet replaced', 'success');
        setSelectedFile(null);
      } catch (e) {
        Swal.fire('Upload Failed', 'Check file format', 'error');
      } finally {
        setLoading(false);
      }
    };
  };

  // --- Pricing Logic ---

  const onInstrumentChange = async (val: any) => {
    setPriceForm({ ...priceForm, instrumentId: val, analysisId: 'Select' });
    const res = await myAppWebService.GetAnalysisDetails(val);
    setAnalysisData(res.item1 || []);
  };

  const onAnalysisChange = async (val: any) => {
    setPriceForm({ ...priceForm, analysisId: val, durationId: 'Select' });
    const res = await myAppWebService.GetAnalysisData(val, priceForm.userRole);
    setDurations(res.item1 || []);
  };

  const handleUpdatePrice = async () => {
    const auth = JSON.parse(Cookies.get('authData') || '{}');
    const payload = {
      instrumentId: priceForm.instrumentId,
      analysisId: priceForm.analysisId,
      newPrice: priceForm.newPrice,
      updatedBy: auth.EmailId
    };
    // Call your specific price update API here
    Swal.fire('Success', 'Price updated in system', 'success');
  };

  const filteredData = instruments.filter((item: any) => 
    item.instrumentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className={styles.container}>
      {loading && <div className={styles.fullScreenLoader}><CircularProgress color="warning" /></div>}

      {/* 1. PRICING SECTION */}
      <Paper className={styles.card}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
          Update Instrument <span style={{ color: '#ef7d00' }}>Pricing</span>
        </Typography>
        <Grid container spacing={3} mt={1}>
          <Grid  sx={{xs:12, md:4}}>
            <FormControl fullWidth>
              <InputLabel>User Role</InputLabel>
              <Select 
                value={priceForm.userRole} 
                onChange={(e) => setPriceForm({...priceForm, userRole: e.target.value})}
              >
                <MenuItem value="400000">Internal User</MenuItem>
                <MenuItem value="400001">External Academia</MenuItem>
                <MenuItem value="400002">Industry User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid  sx={{xs:12, md:4}}>
            <FormControl fullWidth>
              <InputLabel>Instrument</InputLabel>
              <Select 
                value={priceForm.instrumentId} 
                onChange={(e) => onInstrumentChange(e.target.value)}
              >
                {instruments.map((ins: any) => (
                  <MenuItem key={ins.instrumentId} value={ins.instrumentId}>{ins.instrumentName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid  sx={{xs:12, md:4}}>
            <TextField 
              fullWidth 
              label="Updated Price" 
              type="number" 
              value={priceForm.newPrice}
              onChange={(e) => setPriceForm({...priceForm, newPrice: e.target.value})}
            />
          </Grid>
          <Grid sx={{ textAlign: 'right',xs:12 }}>
            <Button 
              variant="contained" 
              startIcon={<Save />}
              sx={{ bgcolor: '#ef7d00', '&:hover': { bgcolor: '#d66f00' } }}
              onClick={handleUpdatePrice}
            >
              Update Price
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. INSTRUMENT TABLE SECTION */}
      <Paper className={styles.card}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={700}>Instrument Management</Typography>
          <TextField 
            size="small"
            placeholder="Search instrument..."
            InputProps={{ startAdornment: <Search sx={{ color: 'gray', mr: 1 }} /> }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        <TableContainer className={styles.tableContainer}>
          <Table>
            <TableHead sx={{ bgcolor: '#f4f4f4' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Instrument Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row: any) => (
                <TableRow key={row.instrumentId}>
                  <TableCell>{row.instrumentId}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.instrumentName}</TableCell>
                  <TableCell>
                    <span className={row.isActive ? styles.statusAvailable : styles.statusUnavailable}>
                      {row.isActive ? 'Available' : 'Unavailable'}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Box className={styles.actionButtons}>
                      <IconButton onClick={() => handleToggleStatus(row)} color="primary">
                        <Refresh />
                      </IconButton>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        component="label"
                        startIcon={<CloudUpload />}
                        sx={{ ml: 1 }}
                      >
                        Excel
                        <input hidden type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                      </Button>
                      {selectedFile && (
                         <IconButton onClick={() => handleExcelUpload(row)} color="success">
                            <Save />
                         </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}