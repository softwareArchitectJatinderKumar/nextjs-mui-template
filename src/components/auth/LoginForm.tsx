"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

export default function LoginForm({ onSubmit, loginError }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });

  return (
    <div className="cifLogin p-4 bg-white shadow-sm rounded">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label fw-bold">Login ID</label>
          <input
            type="text"
            className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
            placeholder="Enter Login ID"
            {...register('Email', { required: true, minLength: 5 })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              {...register('password', { required: true })}
            />
            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Role</label>
          <select className="form-select" {...register('UserRoleS', { required: true })}>
            <option value="">Select Role</option>
            <option value="400001">External Academia</option>
            <option value="400002">Industry User</option>
          </select>
        </div>

        {loginError && <div className="alert alert-danger py-1 small">{loginError}</div>}

        <button type="submit" className="lpu-btn w-100 mb-3" disabled={!isValid}>
          Submit
        </button>

        <div className="text-center small">
            <Link href="/register" className="text-decoration-none fw-bold" style={{color:'#ef7d00'}}>Register Now</Link>
        </div>
      </form>
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import { Box, Button, TextField, Typography } from '@mui/material';

// export default function LoginForm() {
//   const [form, setForm] = useState({
//     email: '',
//     password: ''
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Dummy API call placeholder
//     console.log('Login payload:', form);
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit}>
//       <Typography variant="h5" mb={2}>
//         Login
//       </Typography>

//       <TextField
//         fullWidth
//         margin="normal"
//         label="Email"
//         name="email"
//         value={form.email}
//         onChange={handleChange}
//         required
//       />

//       <TextField
//         fullWidth
//         margin="normal"
//         label="Password"
//         name="password"
//         type="password"
//         value={form.password}
//         onChange={handleChange}
//         required
//       />

//       <Button
//         fullWidth
//         variant="contained"
//         type="submit"
//         sx={{ mt: 2 }}
//       >
//         Login
//       </Button>
//     </Box>
//   );
// }
