"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import styles from '@/styles/UserRegisterPage.module.css';
import { registerSchema } from './registerSchema';
import myAppWebService from '@/services/myAppWebService';

export default function UserRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onTouched'
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("UserEmail", data.EmailId);
      formData.append("CandidateName", data.CandidateName);
      formData.append("SupervisorName", data.Supervisorname);
      formData.append("MobileNumber", data.MobileNumber);
      formData.append("SchoolName", data.InstituteName);
      formData.append("DepartmentName", data.DepartmentName);
      formData.append("IdProofType", data.IdProofType);
      formData.append("IdProofNumber", data.IdProofNumber);
      formData.append("UserType", data.UserRole);
      formData.append("Address", data.Address);
      formData.append("PasswordText", data.Password);

      const res = await myAppWebService.NewUserRecord(formData);

      const resultMsg = res.item1[0]?.msg;
      const errorCode = res.item1[0]?.returnId;

      if (resultMsg === 'Success') {
        Swal.fire({
          title: 'User Login Created Successfully',
          text: resultMsg,
          icon: 'success',
        }).then(() => router.push('/login'));
      } else if (errorCode === -1) {
        Swal.fire({ title: 'User Already Exists', icon: 'error' });
      } else {
        Swal.fire({ title: 'Technical Issue', text: resultMsg, icon: 'error' });
      }
    } catch (error) {
      Swal.fire({ title: 'Error Occurred', text: 'Unable to complete request.', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className={styles.fullscreenLoader}>
          <div className={styles.customSpinnerOverlay}>
            <img src="/assets/images/spinner.gif" alt="Loading..." />
          </div>
        </div>
      )}

      <section className="section py-5">
        <div className="container">
          <div className="headingWraper mb-5">
            <div className="mainHead">
              <h1 style={{ color: '#ef7d00' }}>Central Instrumentation Facility</h1>
              <h2 className="text-center">User <span style={{ color: '#ef7d00' }}>Registration</span> Page</h2>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-6 d-none d-md-block mt-5">
              <img
                src="https://www.lpu.in/lpu-assets/images/cif/login-left.png"
                alt="Login Illustration"
                className="img-fluid"
              />
            </div>

            <div className="col-md-6">
              <div className="card p-4 shadow-sm border-0 bg-light">
                <form onSubmit={handleSubmit(onFormSubmit)} >
                  <div className="mb-3">
                    If you already have an account, just <Link href="/login" className="text-danger fw-bold">sign in</Link>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input {...register('EmailId')} className={`form-control ${errors.EmailId ? 'is-invalid' : ''}`} placeholder="Enter Email" />
                      <div className="invalid-feedback">{errors.EmailId?.message}</div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Candidate Name</label>
                      <input {...register('CandidateName')} className={`form-control ${errors.CandidateName ? 'is-invalid' : ''}`} placeholder="Enter Name" />
                      <div className="invalid-feedback">{errors.CandidateName?.message}</div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Supervisor Name</label>
                      <input {...register('Supervisorname')} className={`form-control ${errors.Supervisorname ? 'is-invalid' : ''}`} placeholder="Supervisor Name" />
                      <div className="invalid-feedback">{errors.Supervisorname?.message}</div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Mobile</label>
                      <input {...register('MobileNumber')} className={`form-control ${errors.MobileNumber ? 'is-invalid' : ''}`} placeholder="10 Digit Mobile" />
                      <div className="invalid-feedback">{errors.MobileNumber?.message}</div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Organization</label>
                      <input {...register('InstituteName')} className={`form-control ${errors.InstituteName ? 'is-invalid' : ''}`} placeholder="Institute Name" />
                      <div className="invalid-feedback">{errors.InstituteName?.message}</div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Department</label>
                      <input {...register('DepartmentName')} className={`form-control ${errors.DepartmentName ? 'is-invalid' : ''}`} placeholder="Department Name" />
                      <div className="invalid-feedback">{errors.DepartmentName?.message}</div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">ID Proof Type</label>
                      <select {...register('IdProofType')} className={`form-select ${errors.IdProofType ? 'is-invalid' : ''}`}>
                        <option value="">Select</option>
                        <option value="AadharCard">Aadhar Card</option>
                        <option value="RegistrationCard">Organisation Card</option>
                        <option value="PanCard">Pan Card</option>
                        <option value="LicenseCard">License Card</option>
                      </select>
                      <div className="invalid-feedback">{errors.IdProofType?.message}</div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">ID Proof Number</label>
                      <input {...register('IdProofNumber')} className={`form-control ${errors.IdProofNumber ? 'is-invalid' : ''}`} placeholder="ID Number" />
                      <div className="invalid-feedback">{errors.IdProofNumber?.message}</div>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Address</label>
                      <textarea {...register('Address')} className={`form-control ${errors.Address ? 'is-invalid' : ''}`} placeholder="Full Address"></textarea>
                      <div className="invalid-feedback">{errors.Address?.message}</div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Password</label>
                      <input type="password" {...register('Password')} className={`form-control ${errors.Password ? 'is-invalid' : ''}`} placeholder="Password" />
                      <div className="invalid-feedback">{errors.Password?.message}</div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Confirm Password</label>
                      <input type="password" {...register('ConfirmPassword')} className={`form-control ${errors.ConfirmPassword ? 'is-invalid' : ''}`} placeholder="Confirm Password" />
                      <div className="invalid-feedback">{errors.ConfirmPassword?.message}</div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Role</label>
                      <select {...register('UserRole')} className={`form-select ${errors.UserRole ? 'is-invalid' : ''}`}>
                        <option value="">Select Role</option>
                        <option value="400001">External Academia</option>
                        <option value="400002">Industry Users</option>
                      </select>
                      <div className="invalid-feedback">{errors.UserRole?.message}</div>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <button type="submit" className={styles.lpuBtn} disabled={!isValid || loading}>
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button type="button" className="btn btn-secondary ms-2 px-4" onClick={() => reset()}>Reset</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}