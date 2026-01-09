'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Dummy API call placeholder
    console.log('Register payload:', form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" mb={2}>
        Register
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      <Button
        fullWidth
        variant="contained"
        type="submit"
        sx={{ mt: 2 }}
      >
        Register
      </Button>
    </Box>
  );
}
