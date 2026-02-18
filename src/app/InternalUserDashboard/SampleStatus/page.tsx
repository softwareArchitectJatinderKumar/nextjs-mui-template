"use client";

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import SampleStatusTable from '@/components/CIF/SampleStatusTable';
import { instrumentService } from '@/services/instrumentService';

export default function SampleStatusPage() {
    const [samplesData, setSamplesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSamples = async () => {
            try {
                const cookieData = Cookies.get('InternalUserAuthData');
                if (!cookieData) {
                    console.warn("No auth cookie found");
                    setLoading(false);
                    return;
                }

                const userEmail = JSON.parse(cookieData).EmailId;
                const response = await instrumentService.GetSampleStatusByUserId(userEmail);

                // Handle both response structures (wrapped in item1 or direct array)
                const dataArray = response?.item1 || response || [];

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
                // Ensure loader shows for at least a brief moment for UX
                setTimeout(() => setLoading(false), 500);
            }
        };

        loadSamples();
    }, []);

    return (
        <>
            {/* Full Screen Loader - shown during initial load */}
            {loading && (
                <div className="fullScreenLoader">
                    <div className="customSpinnerOverlay">
                        <img src="/assets/images/spinner.gif" alt="Loading..." />
                    </div>
                </div>
            )}

            <Box 
                sx={{ 
                    minHeight: '100vh', 
                    py: 4,
                    // backgroundColor: '#f8f9fa'
                }}
            >
                <Container maxWidth="xl">
                    {/* Header Section */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography 
                            variant="h4" 
                            component="h1"
                            sx={{ 
                                fontWeight: 700, 
                                color: '#333',
                                mb: 1
                            }}
                        >
                            Sample Status
                        </Typography>
                        {/* <Typography 
                            variant="body1" 
                            color="text.secondary"
                        >
                            View the status of your submitted samples
                        </Typography> */}
                    </Box>

                    {/* Content Card */}
                    <Box className='bgLightYellow'
                        sx={{ 
                            // backgroundColor: '#fff',
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                            minHeight: '60vh'
                        }}
                    >
                        {/* Data Table */}
                        {!loading && samplesData.length > 0 && (
                            <SampleStatusTable data={samplesData} loading={loading} />
                        )}

                        {/* Empty State */}
                        {!loading && samplesData.length === 0 && (
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    py: 8,
                                    px: 2
                                }}
                            >
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 600, 
                                        color: '#dc3545',
                                        mb: 2
                                    }}
                                >
                                    No Records Found
                                </Typography>
                                {/* <Typography 
                                    variant="body1" 
                                    color="text.secondary"
                                >
                                    No samples found for your account.
                                </Typography> */}
                            </Box>
                        )}
                    </Box>
                </Container>
            </Box>
        </>
    );
}
