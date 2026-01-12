"use client";
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { apiService } from '@/services/endpoint';
import { DynamicGrid } from '@/components/common/dynamicGrid';

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const loadData = async () => {
    //   try {
    //     const response = await apiService.getProducts(); // Dummy API call
    //     setData(response.data);
    //   } catch (error) {
    //     console.error("Failed to fetch data", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // loadData();
  }, []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Post Title' },
    { key: 'userId', label: 'User ID' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Project Dashboard</Typography>
        <Typography color="text.secondary">Manage and export your data records</Typography>
      </Box>

      <DynamicGrid 
        dataArray={data} 
        columns={columns} 
      />
    </Container>
  );
}