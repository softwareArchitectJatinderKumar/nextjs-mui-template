"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from './LpuloginPage.module.css';
import Cookies from 'js-cookie';
import myAppWebService from '@/services/myAppWebService';
import Link from 'next/link';

export default function staffLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        mode: 'onTouched'
    });

    const onSubmit = async (data: any) => {
        const { Email, password } = data;
        await getToken(Email, password);
    };

    const getToken = async (id: any, key: any) => {
        try {
            const response = await myAppWebService.loginInternalUser(id, key);
            myAppWebService.saveUser(response.token);
            await getEmployeeDetails(response.token);
        } catch (error) {
            loginFailed(' Server Error');
        }
    };

  
    const getEmployeeDetails = async (secretKey: any) => {
        try {
            const response = await myAppWebService.GetEmployeeDetails(secretKey); // Removed secretKey if not needed by API
            const data = response.data ? response.data : response;

            if (data && data.item1 && data.item1.length > 0) {
                const emp = data.item1[0];
                const userData = {
                    CandidateName: emp.employeeName,
                    UserId: emp.employeeCode,
                    Department: emp.departmentName,
                    Designation: emp.department,
                    EmailId: emp.email,
                    MobileNo: emp.contactNo,
                    UserRole: 'Admin-User',
                    SupervisorName: emp.employeeName,
                    PasswordText: btoa(secretKey),
                };

                const AllallowedIds = [
                    { uid: '24374' },
                    { uid: '20362' },
                    { uid: '25760' },
                    { uid: '34228' },
                    { uid: '34185' },
                    { uid: '16477' },
                    { uid: '27727' },
                    { uid: '27808' },
                    { uid: '26918' },
                    { uid: '30694' },
                    { uid: '29159' },
                    { uid: '31691' },
                    { uid: '33476' },
                    { uid: '31309' },
                ];

                const isAllowed = AllallowedIds.some(item => item.uid === userData.UserId);
                if (!isAllowed) {
                    loginFailed('Not Authorised to access the Interface');
                } else {
                    await proceedWithTerms(userData);
                }
            }
            else {
                console.error("API returned success but item1 is empty or missing");
                loginFailed('Invalid Login Details ');
            }
        } catch (error: any) {
            console.error("API Error Details:");
            loginFailed('Invalid Login Details');
        }
    };

    const proceedWithTerms = async (userData: any) => {

const UserCookies = JSON.stringify(userData);
    const expirationMinutes = 45;
    
    
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + expirationMinutes);

    
    Cookies.set('StaffUserAuthData', UserCookies, {
        expires: expirationDate,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
    });
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
            router.push('/StaffUser/MyUploads');
        } else {
            router.push('/StaffUser/StaffLogin');
        }
    };

    const loginFailed = (Message: any) => {
        Swal.fire('Login Failed', Message, 'warning');
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

            <section className="section bgDarkYellow py-5">
                <div className="container">
                    <div className="headingWraper mb-5">
                        <div className="mainHead">
                            <h1>Central Instrumentation Facilitiation</h1>
                            <h2 className="text-center" > Staff <span style={{ color: '#ef7d00' }}>Login </span>Page</h2>
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

                                    <button type="submit" className={styles.loginBtn + " w-20 mt-3"}>
                                        Login
                                    </button>

                                    <div className="d-flex justify-content-between mt-4">
                                        <Link href="/login" className={styles.regLink}>User Login</Link>
                                        <Link href="/recover" className={styles.regLink}>Recover Account</Link>
                                    </div>

                                </form>
                            </div>

                            <div className="mt-4 text-center">
                                Don't have an account? <Link href="/register" className={styles.regLink}>Register</Link>
                            </div>
                            <div className="mt-3 small text-center text-muted">
                                By Login you agree with <Link href="/terms">terms and conditions</Link> and <Link href="/terms">privacy policy</Link>
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