"use client";
import { useState } from 'react';
import { Box, Paper, Tabs, Tab, TextField, Button, Typography, Container } from '@mui/material';

export default function LoginRegisterPage() {
  const [activeTab, setActiveTab] = useState(0); // 0 = Login, 1 = Register

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ borderRadius: 2 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} variant="fullWidth">
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            {activeTab === 0 ? "Welcome Back" : "Create Account"}
          </Typography>
          {activeTab === 1 && <TextField fullWidth label="Full Name" sx={{ mb: 2 }} />}
          <TextField fullWidth label="Email" sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" type="password" sx={{ mb: 3 }} />
          <Button variant="contained" fullWidth size="large">
            {activeTab === 0 ? "Sign In" : "Sign Up"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}