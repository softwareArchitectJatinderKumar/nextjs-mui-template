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
      } catch (error) {
        console.error("Error fetching data", error);
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

      <DynamicGrid 
        dataArray={data} 
        columns={columns} 
      />
    </Container>
  );
}