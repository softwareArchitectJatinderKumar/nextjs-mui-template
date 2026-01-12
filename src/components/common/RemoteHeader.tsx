"use client";
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';

export const RemoteHeader = () => {
  const [headerHtml, setHeaderHtml] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false); // New state to track mounting

  useEffect(() => {
    setIsMounted(true); // Set to true once the component hits the browser
    const fetchHeader = async () => {
      try {
        const response = await fetch('/api/remote-header');
        if (!response.ok) throw new Error();
        const html = await response.text();
        setHeaderHtml(html);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchHeader();
  }, []);

  // IMPORTANT: If not mounted, return null or a simple div placeholder.
  // This prevents the Server from rendering the CircularProgress and 
  // causing a mismatch with the Client.
  if (!isMounted) return <div style={{ minHeight: '80px' }} />; 

  if (loading) return <CircularProgress size={20} sx={{ m: 2 }} />;

  if (error) return <Alert severity="warning">External Header Unavailable</Alert>;

  return (
    <Box 
      id="remote-header-wrapper"
      dangerouslySetInnerHTML={{ __html: headerHtml }} 
    />
  );
};