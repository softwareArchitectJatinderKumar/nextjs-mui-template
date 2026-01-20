"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from './LpuloginPage.module.css';
// import styles from './LoginPage.module.css';
import Cookies from 'js-cookie';
// Mocking the services structure to match your API names import myAppWebService from '@/services/myAppWebService';
import myAppWebService from '@/services/myAppWebService';
import FacilitiesSection from '@/components/CIF/FacilitiesSection';
import Link from 'next/link';

interface Instrument {
    id: string | number;
    instrumentName: string;
    categoryId: string | number;
    imageUrl?: string;
}


export default function LoginPage() {

    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInstruments = async () => {
            try {
                const response = await myAppWebService.getAllInstruments();
                const data = response.item1 || response.data || response;
                setInstruments(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching instruments:', err);
                setError('Failed to load instruments');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInstruments();
    }, []);


    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        mode: 'onTouched'
    });

    const onSubmit = async (data: any) => {
        const { Email, password, UserRoleS } = data;
        await getToken(Email, password, UserRoleS);
    };

    // MATCHING API LOGIC: getToken
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

    // MATCHING API LOGIC: getStudentById
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

    // MATCHING API LOGIC: GetEmployeeDetails
    const getEmployeeDetails = async (secretKey: any) => {
        try {
            // 1. Double check the token exists in storage
            const token = localStorage.getItem('token');
            console.log("Current Token:", token);

            const response = await myAppWebService.GetEmployeeDetails(secretKey); // Removed secretKey if not needed by API

            console.log('Raw Response:', response);

            // Handle both possible structures (raw axios vs data only)
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

                // console.log('Mapped User Data:', userData);
                await proceedWithTerms(userData);
            } else {
                console.error("API returned success but item1 is empty or missing");
                loginFailed();
            }
        } catch (error: any) {
            console.error("API Error Details:");
            loginFailed();
        }
    };

    const proceedWithTerms = async (userData: any) => {
        Cookies.set('InternalUserAuthData', JSON.stringify(userData));

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
            router.push('/InternalUserDashboard/Profile');
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
            {/* <section className={styles.section + ' bgDarkYellow py-5'}>
                <div className="container">
                    <div className={styles.mainHead + " mb-5"}>
                        <h1>Central Instrumentation Facilitiation - Login</h1>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-md-6 d-none d-lg-block">
                            <img
                                src="https://www.lpu.in/lpu-assets/images/cif/login-left.png"
                                alt="Login"
                                className="img-fluid"
                            />
                        </div>

                        <div className="col-md-6">
                            <div className={styles.cifLogin}>
                                <h2 className="mb-4 text-center">
                                    <span>Internal</span> User Login
                                </h2> */}
            <section className="section bgDarkYellow py-5">
                <div className="container">
                    <div className="headingWraper mb-5">
                        <div className="mainHead">
                            <h1 style={{ color: '#ef7d00' }}>Central Instrumentation Facilitiation</h1>
                            <h2 className="text-center" >Internal <span style={{ color: '#ef7d00' }}>User </span> Login</h2>
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
                            <div className="cifLogin p-md-4">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className={styles.inputGroup}>
                                        <label className="form-label">Login ID / Email</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                                            placeholder="Enter Login ID / Email"
                                            {...register("Email", {
                                                required: "Login ID or Email is required",
                                                validate: (value) => {
                                                    const emailRegex =
                                                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

                                                    const idRegex =
                                                        /^[A-Za-z0-9_-]{4,30}$/; // adjust length if needed

                                                    if (emailRegex.test(value) || idRegex.test(value)) {
                                                        return true;
                                                    }

                                                    return "Enter a valid Email or Login ID";
                                                }
                                            })}
                                        />
                                        {/* <input
                                            type="text"
                                            className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                                            placeholder="Enter Login ID / Email"
                                            {...register("Email", {
                                                required: "Id is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                        /> */}
                                        {errors.Email && (
                                            <span className="text-danger mt-1 d-block">
                                                {errors.Email.message as string}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className="form-label">Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className={styles.formControl}
                                            placeholder="Enter password"
                                            {...register("password", { required: "Password is required" })}
                                        />
                                        <i
                                            className={`${styles.inputEye} bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                        {errors.password && <span className="text-danger small">{errors.password.message as string}</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className="form-label">Choose Role</label>
                                        <select
                                            className={styles.formControl}
                                            {...register("UserRoleS", { required: "Role is required" })}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Student">Student</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                    </div>

                                    <button type="submit" className={styles.loginBtn + " w-20 mt-3"}>
                                        Login
                                    </button>

                                    <div className="d-flex justify-content-between mt-4">
                                        <Link href="/login" className={styles.regLink}>User Login</Link>
                                        <Link href="/recover" className={styles.regLink}>Recover Account</Link>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Link href="/StaffLogins" className={styles.regLink}>Staff Login</Link>
                                    </div>
                                </form>
                            </div>

                            <div className="mt-4 text-center">
                                Don't have an account? <Link href="/register" className={styles.regLink}>Register</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.stickyBar}>
                    <ul>
                        <li>
                            <img src="/icons/apply.png" alt="" width="20" className="me-2" />
                            <span>Apply Now</span>
                        </li>
                        <li>
                            <img src="/icons/query.png" alt="" width="20" className="me-2" />
                            <span>Enquire Now</span>
                        </li>
                    </ul>
                </div>
            </section>
        </>
    );
}