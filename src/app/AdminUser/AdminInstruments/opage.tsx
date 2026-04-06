"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, 
  CircularProgress, Divider, InputAdornment, IconButton, Tooltip 
} from '@mui/material';
import { CloudUpload, Delete, Science, Description } from '@mui/icons-material';
import Swal from 'sweetalert2';
import styles from './AdminInstruments.module.css';
import myAppWebService from '@/services/myAppWebService'
export default function AdminNewInstruments() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State matching your Angular file model
  const [formData, setFormData] = useState({
    instrumentName: '',
    description: '',
    isActive: 'true',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Handle File Selection (matches onFileXSelected logic)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 3. Submit Data (refactored CIFInstrumentUpdateDetails logic)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.instrumentName || !selectedFile) {
      Swal.fire('Required', 'Please provide Instrument Name and Image', 'warning');
      return;
    }

    setLoading(true);
    const startTime = new Date().getTime();

    try {
      // Replicating the FormData structure from your .ts file
      const postData = new FormData();
      postData.append('InstrumentName', formData.instrumentName);
      postData.append('Description', formData.description);
      postData.append('IsActive', formData.isActive);
      postData.append('File', selectedFile); 
      postData.append('FilePath', selectedFile.name);

      // Calling your existing API function
      const res = await myAppWebService.CIFInstrumentUpdateDetails(postData);
      
      const result = res.item1[0]?.msg;
      if (result === 'ok') {
        Swal.fire({
          title: 'Success!',
          text: 'Instrument added successfully!',
          icon: 'success',
          timer: 3000
        }).then(() => {
          // Reset form or redirect
          window.location.reload();
        });
      } else {
        Swal.fire('Failed', result || 'Upload failed', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Internal Server Error', 'error');
    } finally {
      const elapsed = new Date().getTime() - startTime;
      const remainingDelay = Math.max(1500 - elapsed, 0);
      setTimeout(() => setLoading(false), remainingDelay);
    }
  };

  return (
    <Box className={styles.container}>
      {loading && (
        <div className={styles.loaderOverlay}>
          <CircularProgress color="warning" />
        </div>
      )}

      <Paper className={styles.formCard} elevation={0}>
        <Typography variant="h4" className={styles.sectionTitle}>
          Register New <span>Instrument</span>
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Instrument Details */}
            <Grid  sx={{xs:12, md:7}}>
              <Grid container spacing={3}>
                <Grid  sx={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Instrument Name"
                    name="instrumentName"
                    variant="outlined"
                    value={formData.instrumentName}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Science color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid  sx={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Description / Specifications"
                    name="description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter technical details..."
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Image Upload Section */}
            <Grid sx={{xs:12, md:5}}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Instrument Image
              </Typography>
              <Box 
                className={styles.uploadSection}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <Box sx={{ position: 'relative' }}>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }} 
                    />
                    <Tooltip title="Remove Image">
                      <IconButton 
                        sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.8)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  <Box py={4}>
                    <CloudUpload sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                    <Typography color="textSecondary">
                      Click to upload instrument image
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      (Accepted: PNG, JPG, JPEG)
                    </Typography>
                  </Box>
                )}
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
            </Grid>

            {/* Actions */}
            <Grid sx={{ display: 'flex', xs:12, justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                className={styles.submitBtn}
                disabled={!formData.instrumentName || !selectedFile}
              >
                Submit Instrument
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}