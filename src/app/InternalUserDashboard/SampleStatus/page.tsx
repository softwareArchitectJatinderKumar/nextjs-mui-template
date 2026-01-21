"use client";

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import SampleStatusTable from '@/components/CIF/SampleStatusTable';
import { instrumentService } from '@/services/instrumentService';

export default function SampleStatusPage() {
    const [samplesData, setSamplesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSamples = async () => {
            setLoading(true);
            try {
                const cookieData = Cookies.get('InternalUserAuthData');
                if (!cookieData) {
                    console.warn("No auth cookie found");
                    setLoading(false);
                    return;
                }

                const userEmail = JSON.parse(cookieData).EmailId;
                const response = await instrumentService.GetSampleStatusByUserId(userEmail);
                // const response = await instrumentService.GetSampleStatusByUserId('prashant.16477@lpu.co.in');

                // Handle both response structures (wrapped in item1 or direct array)
                const dataArray = response?.item1 || response || [];
                
                console.log("Data received in Page:", dataArray);
                
                if (Array.isArray(dataArray)) {
                    setSamplesData(dataArray);
                } else {
                    console.error("API did not return an array", response);
                    setSamplesData([]);
                }
            } catch (error) {
                console.error("Failed to fetch sample status:", error);
                setSamplesData([]);
            } finally {
                setLoading(false);
            }
        };

        loadSamples();
    }, []);

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container maxWidth="xl">
                {/* 1. Loading Indicator (Only show if no data yet) */}
                {loading && samplesData.length === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
                        <CircularProgress size={50} sx={{ color: '#ff9219', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">Fetching Records...</Typography>
                    </Box>
                )}

                {/* 2. Data Table */}
                {!loading && samplesData.length > 0 && (
                    <SampleStatusTable data={samplesData} loading={loading} />
                )}

                {/* 3. Empty State (Only show if truly empty and not loading) */}
                {!loading && samplesData.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography variant="h3" color="error" sx={{ fontWeight: 'bold', mb: 2 }}>
                            No Record !
                        </Typography>
                        <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, boxShadow: 1, display: 'inline-block' }}>
                            <Typography variant="h6" color="error">
                                No Samples Found for your account.
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Container>
        </div>
    );
}