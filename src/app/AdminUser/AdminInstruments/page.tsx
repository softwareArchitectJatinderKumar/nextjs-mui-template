"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, TextField, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
  InputAdornment, IconButton
} from '@mui/material';
import { Search, FileDownload, CloudUpload, Visibility } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import styles from './AdminInstruments.module.css';
import myAppWebService from '@/services/myAppWebService'
export default function AdminNewInstruments() {
  const [loading, setLoading] = useState(false);
  const [instruments, setInstruments] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // File selection state with base64 data
  const [fileData, setFileData] = useState<{ [key: string]: { fileData: string; fileName: string } }>({});

  useEffect(() => {
    loadAllInstruments();
  }, []);

  // Replicates: getAllInstrumentData()
  const loadAllInstruments = async () => {
    setLoading(true);
    try {
      const res = await myAppWebService.GetAllInstruments();
      setInstruments(res.item1 || []);
      setFilteredData(res.item1 || []);
    } finally {
      setLoading(false);
    }
  };

  // Replicates: searchx() logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredData(instruments);
      return;
    }
    const filtered = instruments.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  // Replicates: exportToExcel()
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Instruments");
    XLSX.writeFile(wb, "Instrument_Details.xlsx");
  };

  // Replicates: onFileXSelected()
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;

    if (!file) return;

    // Check file size (max 10MB = 10148576 bytes)
    if (file.size > 10148576) {
      Swal.fire({
        title: 'File size exceeds 10 MB. Please upload a smaller file.',
        text: 'Invalid File size',
        icon: 'warning'
      });
      target.value = '';
      return;
    }

    // Validate file name (only alphanumeric and ._- characters)
    const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
    let validFileName = file.name;
    
    if (!fileNameRegex.test(file.name)) {
      validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    }

    // Read file as base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Array = result.split(',');
      const fileDataBase64 = base64Array[1]; // Get the base64 data without the prefix
      
      setFileData(prev => ({
        ...prev,
        [id]: { fileData: fileDataBase64, fileName: validFileName }
      }));
    };

    // Clear the input
    target.value = '';
  };

  // Replicates: UpdateFileDocument() and CIFInstrumentUpdateDetails()
  const handleUpload = async (item: any) => {
    const fileInfo = fileData[item.instrumentId];
    if (!fileInfo) return;

    setLoading(true);
    const startTime = new Date().getTime();

    try {
      const formData = new FormData();
      formData.append('InstrumentId', item.instrumentId);
      formData.append('InstrumentName', item.instrumentName);
      formData.append('Description', item.description || '');
      formData.append('IsActive', 'true');
      formData.append('FilePath', fileInfo.fileName);
      // formData.append('FileDataX', fileInfo.fileData);
      formData.append('fileName', fileInfo.fileName);
      formData.append('File', fileInfo.fileData);

      const res = await myAppWebService.CIFInstrumentUpdateDetails(formData);
      const msg = res.item1[0]?.msg;

      if (msg === 'ok') {
        Swal.fire('Success', 'Document uploaded successfully!', 'success')
          .then(() => window.location.reload());
      } else {
        Swal.fire('Error', msg || 'Upload failed', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Internal Server Error', 'error');
    } finally {
      const elapsed = new Date().getTime() - startTime;
      setTimeout(() => setLoading(false), Math.max(1500 - elapsed, 0));
    }
  };

  return (
    <Box className={styles.container}>
      {loading && <div className={styles.loaderOverlay}><CircularProgress color="warning" /></div>}

      <Box className={styles.card}>
        <Typography variant="h5" className={styles.headerTitle}>Update Instrument Images</Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid sx={{xs:12,md:4}}>
            <Button 
              variant="contained" 
              className={styles.exportBtn}
              startIcon={<FileDownload />}
              onClick={exportToExcel}
              disabled={filteredData.length === 0}
            >
              Export to Excel
            </Button>
          </Grid>
          <Grid sx={{xs:12,md:8}}>
            <TextField
              fullWidth
              placeholder="Type Search Text..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
              }}
              className={styles.searchField}
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Instrument Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Current Image</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Upload New Image</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.instrumentId} hover>
                  <TableCell>{item.instrumentName}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => {
                        const imgUrl = item.imageUrl || '/assets/images/no-image.png';
                        Swal.fire({
                          title: item.instrumentName,
                          imageUrl: imgUrl,
                          imageAlt: item.instrumentName,
                          showCloseButton: true,
                          showConfirmButton: false,
                          imageWidth: 800,
                          imageHeight: 'auto',
                        });
                      }}
                    >
                      {/* View Current Image */}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => handleFileSelect(e, item.instrumentId)}
                      style={{ fontSize: '0.8rem' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="contained" 
                      className={styles.uploadBtn}
                      disabled={!fileData[item.instrumentId]}
                      onClick={() => handleUpload(item)}
                    >
                      Upload
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}