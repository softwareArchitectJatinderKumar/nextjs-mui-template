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
    const [serverDown, setServerDown] = useState(false);

    useEffect(() => {
        const fetchInstruments = async () => {
            try {
                const response = await myAppWebService.getAllInstruments();
                const data = response.item1 || response.data || response;
                setInstruments(Array.isArray(data) ? data : []);
                setError(''); // Clear any previous errors
                setServerDown(false);
            } catch (err: any) {
                console.error('Error fetching instruments:', err);
                // Check if server is down (network error or 5xx)
                const errorMessage = err?.message || '';
                // Check for network error message from axios interceptor
                const isNetworkError = errorMessage.includes('Network error') || 
                                      errorMessage.includes('Network Error') ||
                                      errorMessage.includes('ECONNREFUSED') ||
                                      errorMessage.includes('Failed to fetch') ||
                                      errorMessage.includes('fetch failed') ||
                                      err?.code === 'ECONNREFUSED' ||
                                      err?.code === 'ERR_NETWORK';
                
                if (isNetworkError || err?.status >= 500) {
                    setServerDown(true);
                    setError('Server down. Please try after a while.');
                } else {
                    // Show user-friendly error message for other errors
                    const userMessage = err?.data?.message || 'Server issue. Please try again later.';
                    setError(userMessage);
                }
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
            const token = localStorage.getItem('token');
            const response = await myAppWebService.GetEmployeeDetails(secretKey); // Removed secretKey if not needed by API

            const data = response.data ? response.data : response;

            if (data && data.item1 && data.item1.length > 0) {
                const emp = data.item1[0];
                const userData = {
                    CandidateName: emp.employeeName,
                    UserId: emp.employeeCode,
                    Department: emp.departmentName,
                    Designation: emp.department,
                    EmailId:  emp.email,
                    MobileNo: emp.contactNo,
                    UserRole: '400000',
                    SupervisorName: emp.employeeName,
                    PasswordText: secretKey,
                };
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
            html: `<div style="max-height: 400px; overflow-y: auto; text-align: left; padding: 10px;">
            <p>Welcome to Lovely Professional University. These terms and conditions outline the rules and regulations for the use of Lovely Professional University's Website, located at lpu.co.in</p>
            <p><strong>You specifically agree to all of the following undertakings:</strong></p>
            <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; line-height: 1.6;">
              <li>We agree to acknowledge CIF, LPU in our publications and thesis if the results from CIF instrumentation are incorporated/used in them.</li>
              <li>I/We undertake to abide by the safety, standard sample preparation guidelines and precautions during testing of samples.</li>
              <li>I/We understand the possibility of samples getting damaged during handling and analysis. I/We shall not claim for any loss/damage of the sample submitted to CIF and agree to resubmit the new sample requested by CIF for analysis.</li>
              <li>CIF, LPU reserves the rights to return the samples without performing analysis and will refund the analytical charges (after deduction of GST, if applicable) under special circumstances.</li>
              <li>I/we agree to maintain decorum during the visit in CIF labs for sample analysis and fully agree that CIF has full right to take action if decorum of CIF’s labs functionality is disturbed/hampered by me.</li>
              <li>CIF shall not take any responsibility about the analysis, interpretation and publication of data acquired by the end user.</li>
              <li>I/We hereby declare that the results of the analysis will not be used for the settlement of any legal issue.</li>
            </ul>
          </div>`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Agreed',
            cancelButtonText: 'No'
        });

        if (result.isConfirmed) {

            await myAppWebService.NewUserRecord(userData);
            router.push('/InternalUserDashboard/ViewBookings');
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

            {/* Error Alert */}
            {error && (
                <div className="container mt-3">
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        <div>
                            <strong>Error:</strong> {error}
                        </div>
                    </div>
                </div>
            )}
        
            <section className="section bgDarkYellow py-5">
                <div className="container">
                    <div className="headingWraper mb-5">
                        <div className="mainHead">
                            <h1>Central Instrumentation Facilitiation</h1>
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
                                {serverDown ? (
                                    <div className="alert alert-danger text-center py-3">
                                        <strong>Server down. Please try after a while.</strong>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className={styles.inputGroup}>
                                        <label className="form-label">User Id</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                                            placeholder="Staff Id / Student Id"
                                            {...register("Email", {
                                                required: "ID is required",
                                                validate: (value) => {
                                                    const emailRegex =
                                                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                                                    const idRegex =
                                                        /^[A-Za-z0-9_-]{4,30}$/; 
                                                    if (emailRegex.test(value) || idRegex.test(value)) {
                                                        return true;
                                                    }

                                                    return "Enter a valid Email or Login ID";
                                                }
                                            })}
                                        />
                                
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
                                        <Link href="/StaffUser/StaffLogin" className={styles.regLink}>Staff Login</Link>
                                    </div>
                                </form>
                                )}
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