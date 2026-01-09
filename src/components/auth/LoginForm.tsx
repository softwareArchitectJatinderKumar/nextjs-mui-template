'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function LoginForm() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy API call placeholder
    console.log('Login payload:', form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" mb={2}>
        Login
      </Typography>

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

      <Button
        fullWidth
        variant="contained"
        type="submit"
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
}
