"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from './LpuloginPage.module.css';
import Cookies from 'js-cookie';
import myAppWebService from '@/services/myAppWebService';
import Link from 'next/link';

export default function StaffLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({
        mode: 'onTouched'
    });

    // 1. Initial Page Loader
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const loginFailed = (message: string) => {
        setLoading(false);
        Swal.fire('Login Failed', message, 'warning');
    };

    // 2. Main Submit Handler
    const onSubmit = async (data: any) => {
        setLoading(true);
        const { Email, password } = data;
        
        try {
            // Get Auth Token
            const response = await myAppWebService.loginInternalUser(Email, password);
            
            if (response && response.token) {
                myAppWebService.saveUser(response.token);
                // Fetch details using the new token
                await getEmployeeDetails(response.token);
            } else {
                loginFailed('Invalid Username or Password');
            }
        } catch (error) {
            console.error("Login Step Error:", error);
            loginFailed('Server connection error. Please try again.');
        }
    };

    // 3. Fetch Employee Metadata
    const getEmployeeDetails = async (secretKey: string) => {
        try {
            const response = await myAppWebService.GetEmployeeDetails(secretKey);
            const data = response.data ? response.data : response;

            if (data && data.item1 && data.item1.length > 0) {
                const emp = data.item1[0];
                
                const userData = {
                    CandidateName: emp.employeeName,
                    UserId: String(emp.employeeCode), // Cast to string for comparison
                    Department: emp.departmentName,
                    Designation: emp.department,
                    EmailId: emp.email,
                    MobileNo: emp.contactNo,
                    UserRole: 'Admin-User',
                    SupervisorName: emp.employeeName,
                    PasswordText: btoa(secretKey), // Basic obfuscation as per your original logic
                };

                // 4. Authorization Access Control
                const allowedIds = ['24374', '31309']; // Add your ID here if testing
                const isAllowed = allowedIds.includes(userData.UserId);

                if (!isAllowed) {
                    loginFailed('You are not authorized to access the Admin Panel');
                } else {
                    await proceedWithTerms(userData);
                }
            } else {
                loginFailed('No profile data found for this ID');
            }
        } catch (error) {
            console.error("Employee Details Error:", error);
            loginFailed('Failed to verify employee permissions');
        }
    };

    // 5. Terms Acceptance & Cookie Storage
    const proceedWithTerms = async (userData: any) => {
        const userCookies = JSON.stringify(userData);

        // Save Cookies (Expires in 1 Hour)
        Cookies.set('authData', userCookies, {
            expires: 1/24, 
            path: '/',
            secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
            sameSite: 'Lax'
        });

        setLoading(false);

        const result = await Swal.fire({
            title: 'Terms & Conditions',
            html: `
                <div style="max-height: 300px; overflow-y: auto; text-align: left; font-size: 14px; padding: 10px; border: 1px solid #eee;">
                    <p><strong>Please read carefully:</strong></p>
                    <ul>
                        <li>I acknowledge CIF, LPU in publications/theses if results are used.</li>
                        <li>I abide by safety and standard sample preparation guidelines.</li>
                        <li>I will not claim loss/damage for samples submitted to CIF.</li>
                        <li>CIF results will not be used for legal settlements.</li>
                    </ul>
                </div>`,
            showCancelButton: true,
            confirmButtonText: 'I Agree',
            confirmButtonColor: '#ef7d00',
            cancelButtonText: 'Decline',
        });

        if (result.isConfirmed) {
            try {
                // Record user entry in database
                await myAppWebService.NewUserRecord(userData);
            } catch (e) {
                console.warn("User record logging failed, but proceeding to dashboard.");
            }
            router.push('/AdminUser/AssignTest'); // Ensure this route exists in your app folder
        }
    };

    return (
        <>
            {loading && (
                <div className="fullScreenLoader">
                    <div className="customSpinnerOverlay">
                        <img src="/assets/images/spinner.gif" alt="Loading..." />
                    </div>
                </div>
            )}
            {/* {loading && (
                <div className={styles.fullScreenLoader} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="text-center">
                        <img src="/assets/images/spinner.gif" alt="Loading..." width="80" />
                        <p className="mt-2" style={{ color: '#ef7d00', fontWeight: 'bold' }}>Authenticating...</p>
                    </div>
                </div>
            )} */}

            <section className="section bgDarkYellow py-5" style={{ minHeight: '100vh' }}>
                <div className="container">
                    <div className="headingWraper mb-5 text-center">
                        <div className="mainHead">
                            <h1>Central Instrumentation Facility</h1>
                            <h2>Admin <span style={{ color: '#ef7d00' }}>Login</span> Page</h2>
                        </div>
                    </div>

                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-6 d-none d-md-block">
                            <img
                                src="https://www.lpu.in/lpu-assets/images/cif/login-left.png"
                                alt="Login Illustration"
                                className="img-fluid"
                            />
                        </div>

                        <div className="col-md-5">
                            <div className="card shadow-lg p-4 bg-white rounded">
                                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                                    {/* User ID Field */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">User ID</label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                                            placeholder="Enter Staff ID"
                                            {...register("Email", {
                                                required: "User ID is required",
                                                pattern: {
                                                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}|^[A-Za-z0-9_-]{3,30}$/i,
                                                    message: "Invalid ID format"
                                                }
                                            })}
                                        />
                                        {errors.Email && <div className="invalid-feedback">{errors.Email.message as string}</div>}
                                    </div>

                                    {/* Password Field */}
                                    <div className="mb-3 position-relative">
                                        <label className="form-label fw-bold">Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="••••••••"
                                            {...register("password", { required: "Password is required" })}
                                        />
                                        <button 
                                            type="button"
                                            className="btn btn-sm position-absolute end-0 top-50 mt-2 me-2"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ zIndex: 10, background: 'transparent', border: 'none' }}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                        {errors.password && <div className="invalid-feedback">{errors.password.message as string}</div>}
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn w-100 mt-3 text-white fw-bold" 
                                        style={{ backgroundColor: '#ef7d00' }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </form>

                                <div className="mt-4 text-center">
                                    <span className="text-muted small">Don't have an account? </span>
                                    <Link href="/register" className="text-decoration-none fw-bold" style={{ color: '#ef7d00' }}>Register</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
