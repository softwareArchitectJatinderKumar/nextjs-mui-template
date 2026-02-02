"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, CircularProgress, InputAdornment } from '@mui/material';
import { Save } from '@mui/icons-material';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import myAppWebService from '@/services/myAppWebService'

interface InstrumentDuration {
  analysisId: number | string;
  typeName: string;
  price?: number | string;
}

export default function AdminUpdatePricing() {
 const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const [instrumentData, setInstrumentData] = useState([]);
  const [analysisData, setAnalysisData] = useState([]);
  const [instrumentsDuration, setInstrumentsDuration] = useState<InstrumentDuration[]>([]);

  const [formData, setFormData] = useState({
    userRole: 'Select',
    instrumentId: 'Select',
    selectedInstrument: 'Select',
    instrumentName: '',
    analysisId: 'Select',
    durationValue: 'Select',
    selectedType: '',
    charges: 0,
    totalAmount: ''
  });

  useEffect(() => {
    const auth = JSON.parse(Cookies.get('authData') || '{}');
    setUserEmail(auth.EmailId || '');
    loadInstruments();
  }, []);

  const loadInstruments = async () => {
    setLoading(true);
    const startTime = Date.now();
    const res = await myAppWebService.GetAllInstruments();
    setInstrumentData(res.item1 || []);
    const elapsed = Date.now() - startTime;
     setTimeout(() => setLoading(false), Math.max(2500 - elapsed, 0));
  };

  const handleUserTypeChange = (val: string) => {
    setLoading(true);
    const startTime = Date.now();
    setFormData({
      ...formData,
      userRole: val,
      instrumentId: 'Select',
      selectedInstrument: 'Select',
      instrumentName: '',
      analysisId: 'Select',
      durationValue: 'Select',
      charges: 0,
      totalAmount: ''
    });
    setAnalysisData([]);
    setInstrumentsDuration([]);
     const elapsed = Date.now() - startTime;
     setTimeout(() => setLoading(false), Math.max(2500 - elapsed, 0));
  };

  const handleInstrumentChange = async (val: string) => {
     setLoading(true);
    const startTime = Date.now();
    if (val === 'Select') {
      setAnalysisData([]);
      setFormData(prev => ({
        ...prev,
        instrumentId: 'Select',
        selectedInstrument: 'Select',
        instrumentName: '',
        analysisId: 'Select',
        durationValue: 'Select',
        charges: 0,
        totalAmount: ''
      }));
      setInstrumentsDuration([]);
       const elapsed = Date.now() - startTime;
     setTimeout(() => setLoading(false), Math.max(12500 - 0, 0));
      return;
    }
    
    const [id, name] = val.split('||');

    setFormData(prev => ({
      ...prev,
      instrumentId: id,
      selectedInstrument: val,
      instrumentName: name,
      analysisId: 'Select',
      durationValue: 'Select',
      charges: 0,
      totalAmount: ''
    }));
    setInstrumentsDuration([]);

    setLoading(true);
    const res = await myAppWebService.GetAnalysisDetails(id);
    setAnalysisData(res.item1 || []);
    setLoading(false);
  };

  const handleAnalysisChange = async (val: string) => {
    if (formData.userRole === 'Select') {
      Swal.fire('Info', 'Please select User Type first', 'info');
      return;
    }

    setFormData({ ...formData, analysisId: val, durationValue: 'Select', charges: 0, totalAmount: '' });

    setLoading(true);
    const res = await myAppWebService.GetAnalysisData(val, formData.userRole);
    setInstrumentsDuration(res.item1 || []);
    setLoading(false);
  };

  const handleDurationChange = async (analysisId: string, typeName: string) => {
    setFormData(prev => ({ ...prev, durationValue: analysisId, selectedType: typeName, charges: 0, totalAmount: '' }));

    if (analysisId !== 'Select') {
      setLoading(true);
      const res = await myAppWebService.GetDuationAndPrice(analysisId, formData.userRole, typeName);

      if (res.item1?.length > 0) {
        const match = res.item1.find((i: any) => i.typeName === typeName);
        const price = match ? match.price : 0;

        if (price === 'N/A' || price === 'NA') {
          Swal.fire('Warning', 'This analysis is not available for the selected User Type.', 'warning');
          setFormData(prev => ({ ...prev, charges: 0 }));
        } else {
          setFormData(prev => ({ ...prev, charges: price }));
        }
      }
      setLoading(false);
    }
  };

  const handleUpdatePrice = async () => {
    if (!formData.totalAmount) return Swal.fire('Error', 'Please enter updated price', 'error');

    const payload = {
      instrumentName: formData.instrumentName,
      instrumentId: formData.instrumentId,
      analysisId: formData.analysisId,
      duration: formData.selectedType,
      oldPrice: formData.charges,
      newPrice: formData.totalAmount,
      userRole: formData.userRole,
      email: userEmail
    };

    setLoading(true);
    try {
      await myAppWebService.CIFUpdatePrice(payload);
      Swal.fire('Success', 'Price update added to list.', 'success');
      setFormData(prev => ({ ...prev, charges: 0, totalAmount: '' }));
    } catch (e) {
      Swal.fire('Error', 'Failed to update', 'error');
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
    <Box className="container-fluid py-4 min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {loading && (
        <CircularProgress
          sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}
          color="warning"
        />
      )}

      <div className="card shadow-sm mx-auto" style={{ maxWidth: '1200px', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4 fw-bold" style={{ color: '#333' }}>
            Update Instrument <span style={{ color: '#1976d2' }}>Pricing</span>
          </h2>

          {/* Row 1: User Type, Instrument Name */}
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <label className="form-label fw-bold">User Type</label>
              <select
                className="form-select"
                value={formData.userRole}
                onChange={(e) => handleUserTypeChange(e.target.value)}
              >
                <option value="Select">-- Select Role --</option>
                <option value="400000">Internal User</option>
                <option value="400001">External Academia</option>
                <option value="400002">Industry User</option>
              </select>
            </div>

            <div className="col-md-9">
              <label className="form-label fw-bold">Instrument Name</label>
              <select
                className="form-select"
                value={formData.selectedInstrument || 'Select'}
                onChange={(e) => handleInstrumentChange(e.target.value)}
              >
                <option value="Select">-- Select Instrument --</option>
                {instrumentData.map((item: any) => (
                  <option key={item.instrumentId} value={`${item.instrumentId}||${item.instrumentName}`}>
                    {item.instrumentName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Analysis Type, Duration/Unit */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Analysis Type</label>
              <select
                className="form-select"
                value={formData.analysisId}
                onChange={(e) => handleAnalysisChange(e.target.value)}
              >
                <option value="Select">-- Select Analysis --</option>
                {analysisData.map((a: any) => (
                  <option key={a.analysisId} value={a.analysisId}>{a.analysisType}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Duration/Unit</label>
              <select
                className="form-select"
                value={formData.durationValue}
                onChange={(e) => {
                  const val = e.target.value;
                  const selectedObj = instrumentsDuration.find(d => String(d.analysisId) === String(val));
                  if (selectedObj) {
                    handleDurationChange(val as string, selectedObj.typeName);
                  }
                }}
              >
                <option value="Select">-- Select Duration --</option>
                {instrumentsDuration.map((d, index) => (
                  <option key={index} value={d.analysisId}>
                    {d.typeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Current Price, Updated Price */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Current Market Price</label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={formData.charges}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Updated Price</label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="number"
                  className="form-control"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  min={0}
                  placeholder="Enter updated price"
                />
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Button Row */}
          <div className="d-flex justify-content-end">
            <Button
              variant="contained"
              onClick={handleUpdatePrice}
              className="px-4"
              style={{
                backgroundColor: '#1976d2',
                minWidth: '150px'
              }}
              startIcon={<Save />}
            >
              Update Price
            </Button>
          </div>
        </div>
      </div>
    </Box>
    </div>
  );
}
