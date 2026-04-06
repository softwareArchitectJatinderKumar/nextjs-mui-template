"use client";
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { apiService } from '@/services/endpoint';
import { DynamicGrid } from '@/components/common/dynamicGrid';
import myAppWebService from '@/services/myAppWebService';

// 1. Defined Interface
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

export default function DashboardPage() {
  // 2. Applied type to state
  const [data, setData] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const startTime = Date.now();
      try {
        const response = await myAppWebService.GetAllPaymentDetails();
        const apiData = response?.item1 || [];
        // Sort by Booking ID Descending
        const sorted = [...apiData].sort((a, b) => Number(b.bookingId) - Number(a.bookingId));
        setData(sorted);
        setError('');
      } catch (err: any) {
        console.error("Error fetching data", err);
        setError(err.message || 'Failed to load payment details. Please try again.');
        setData([]);
      } finally {
        const elapsed = Date.now() - startTime;
        setTimeout(() => setLoading(false), Math.max(1500 - elapsed, 0));
      }
    };
    loadData();
  }, []);

  const columns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'candidateName', label: 'Candidate Name' },
    { key: 'instrumentName', label: 'Instrument' },
    { 
      key: 'totalCharges', 
      label: 'Charges',
      render: (val: string) => `₹ ${Number(val).toLocaleString('en-IN')}` 
    },
    { 
      key: 'paymentStatus', 
      label: 'Status',
      render: (val: string) => {
        const status = val?.toLowerCase();
        if (status === 'success') return <span style={{ color: 'green', fontWeight: 'bold' }}>Paid</span>;
        if (status === 'failure') return <span style={{ color: 'red', fontWeight: 'bold' }}>Failed</span>;
        return <span style={{ color: 'black', fontWeight: 'bold' }}>Pending</span>;
      }
    },
    { 
        key: 'requestDate', 
        label: 'Request Date',
        render: (val: string) => val ? new Date(val.trim().replace(/\s+/g, ' ')).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'
    },
    { key: 'organisationName', label: 'Organization' },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
        <Typography color="text.secondary">Manage and export your data records</Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ mb: 3 }}>
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        </Box>
      )}

      <DynamicGrid 
        dataArray={data} 
        columns={columns} 
      />
    </Container>
  );
}