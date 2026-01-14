"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from '@/styles/Instruments.module.css';
import Cookies from 'js-cookie';
import myAppWebService from '@/services/myAppWebService';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        mode: 'onChange'
    });

    const onSubmit = async (data: any) => {
        const { Email, password, UserRoleS } = data;
        await getToken(Email, password, UserRoleS);
    };

    const getToken = async (id: any, key: any, Role: any) => {
        try {
            const response = await myAppWebService.loginInternalUser(id, key);
            myAppWebService.saveUser(response.token);
            if (Role === 'Staff') {
                await getEmployeeDetails(response.token);
            } else if (Role === 'Student') {
                await getStudentById(id, key);
            }
        } catch (error) {
            loginFailed();
        }
    };

    const getStudentById = async (regNo: any, secretKey: any) => {
        try {
            const response = await myAppWebService.getStudentById(regNo);
            if (response.item1 && response.item1.length > 0) {
                const student = response.item1[0];
                const userData = {
                    CandidateName: student.studentName,
                    UserId: student.registerationNumber,
                    Department: student.schoolName || 'LPU',
                    EmailId: student.officialEmail || student.studentEmail,
                    PasswordText: secretKey,
                    UserRole: '400000'
                };

                await proceedWithTerms(userData);
            }
        } catch (error) {
            loginFailed();
        }
    };

    const getEmployeeDetails = async (secretKey: any) => {
        try {
            const token = localStorage.getItem('token');
            const response = await myAppWebService.GetEmployeeDetails(secretKey);
            const data = response.data ? response.data : response;

            if (data && data.item1 && data.item1.length > 0) {
                const emp = data.item1[0];

                const userData = {
                    CandidateName: emp.employeeName,
                    UserId: emp.employeeCode,
                    EmailId: emp.officialEmailId || emp.email,
                    Department: emp.departmentName,
                    PasswordText: secretKey,
                    UserRole: '400000'
                };
                await proceedWithTerms(userData);
            } else {
                console.error("API returned success but item1 is empty or missing");
                loginFailed();
            }
        } catch (error: any) {
            console.error("API Error Details:" );
            loginFailed();
        }
    };
 
    const proceedWithTerms = async (userData: any) => {
        const result = await Swal.fire({
            title: 'Terms Conditions',
            html: `<div style="text-align: left; font-size: 14px;">
                    <p>Welcome to LPU. Do you agree to acknowledge CIF in publications?</p>
                    <ul><li>I abide by safety guidelines...</li></ul>
                   </div>`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Agreed',
            cancelButtonText: 'No'
        });

        if (result.isConfirmed) {
           
            await myAppWebService.NewUserRecord(userData);
            router.push('/NewBookings');
        } else {
            router.push('/login');
        }
    };

    const loginFailed = () => {
        Swal.fire('Login Failed', 'Invalid credentials!', 'warning');
    };

 
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            {loading && (
                <div className="fullScreenLoader">
                    <div className="customSpinnerOverlay">
                        <img src="/assets/images/spinner.gif" alt="Loading..." />
                    </div>
                </div>
            )}

            <section className="section py-5">
                <div className="container">
                    <div className="headingWraper mb-5">
                        <div className="mainHead">
                            <h1 style={{ color: '#ef7d00' }}>Central Instrumentation Facility</h1>
                            <h2 className="text-center">User <span style={{ color: '#ef7d00' }}>Login</span> Page</h2>
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
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className={styles.inputGroup}>
                                        <label>Login ID</label>
                                        <input
                                            {...register('Email', { required: true })}
                                            className="form-control w-full p-2 border rounded"
                                            placeholder="Enter Login ID / Email"
                                        />
                                        {errors.Email && <span className="text-red-500 text-sm">ID is required</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                {...register('password', { required: true })}
                                                className="form-control w-full p-2 border rounded"
                                                placeholder="Enter password"
                                            />
                                            <span
                                                className={styles.inputEye}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? '🙈' : '👁️'}
                                            </span>
                                        </div>
                                        {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Choose Role</label>
                                        <select
                                            {...register('UserRoleS', { required: true })}
                                            className="form-select w-full p-2 border rounded"
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Student">Student</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                        {errors.UserRoleS && <span className="text-red-500 text-sm">Role is required</span>}
                                    </div>

                                    <button
                                        type="submit"
                                        className={`${styles.loginBtn} w-full mt-4`}
                                        disabled={!isValid}
                                    >
                                        Login
                                    </button>
                                </form>

                                <div className="flex justify-between mt-6 text-sm">
                                    <a href="/recoverAccount" className="text-orange-600 font-semibold">Recover Account</a>
                                    <a href="/login" className="text-orange-600 font-semibold">Staff Login</a>
                                </div>
                            </div>

                            <div className="text-center mt-6">
                                Don't have an account? <a href="/register" className={styles.regLink}>Register</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}