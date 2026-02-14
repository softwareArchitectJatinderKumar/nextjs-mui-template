"use client";
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';

export const RemoteFooter = () => {
  const [footerHtml, setFooterHtml] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
    const fetchFooter = async () => {
      try {
        const response = await fetch('/api/remote-footer');
        if (!response.ok) throw new Error();
        const html = await response.text();
        setFooterHtml(html);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  if (!isMounted) return <div style={{ minHeight: '50px' }} />; 

  if (loading) return <CircularProgress size={20} sx={{ m: 2 }} />;

  if (error) return <Alert severity="warning">External Footer Unavailable</Alert>;

  if (!isMounted) return <div style={{ minHeight: '50px' }} />; 

  if (loading) return <CircularProgress size={20} sx={{ m: 2 }} />;

  if (error) return <Alert severity="warning">External Header Unavailable</Alert>;

  return (
    <Box 
      id="remote-footer-wrapper"
      dangerouslySetInnerHTML={{ __html: footerHtml }} 
    />
  );
};