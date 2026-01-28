"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Services
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import myAppWebService from '@/services/myAppWebService';

export default function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        mode: 'onChange',
        defaultValues: { Email: '', password: '', UserRoleS: '' }
    });

    const onSubmit = async (data: any) => {
        setLoading(true);

        try {

            const formData = new FormData();
            formData.append('Email', data.Email);
            formData.append('PasswordText', data.password);
            formData.append('UserRole', data.UserRoleS);
            const authResponse = await myAppWebService.getAuthoriseUserData(data.Email, data.password, data.UserRoleS);
            setLoading(false);

            if (authResponse?.item1 && authResponse.item1.length > 0) {
                const user = authResponse.item1[0];
                const tokenData = await authService.LoginJournalAccessTemp(user.email);
                storageService.saveUser(tokenData);
                handlePostLogin(user);
            } else {
                Swal.fire('Invalid Login', 'Check Details!', 'warning');
                setLoading(false);
            }
        } catch (error) {
            console.error("Login Flow Error:", error);
            Swal.fire('Error', 'Server communication failed', 'error');
            setLoading(false);
        }
    };

    const handlePostLogin = (user: any) => {
        const userCookiesData = {
            CandidateName: user.candidateName,
            UserId: user.emailId,
            Department: user.department,
            DepartmentName: user.departmentName,
            EmailId: user.emailId,
            MobileNo: user.mobileNumber,
            UserRole: user.userRole,
            SupervisorName: user.supervisorName,
            ProofNumber: btoa(user.idProofNumber || ''),
            ProofName: user.idProofType,
        };

        Cookies.set('InternalUserAuthData', JSON.stringify(userCookiesData));

        if (user.isPasswordUpdated !== true) {
            Swal.fire('Security Update', 'Please update your password to proceed.', 'info').then(() => {
                router.push('/SecurityIssue');
            });
            return;
        }
        Swal.fire({
            title: 'Terms & Conditions',
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
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Agreed',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                router.push('/InternalUserDashboard/Profile');
            } else {
                Cookies.remove('InternalUserAuthData');
                storageService.clean();
                setLoading(false);
            }
        });
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

            <section className="section bgDarkYellow py-5">
                <div className="container">
                    <div className="headingWraper mb-5">
                        <div className="mainHead">
                            <h1 >Central Instrumentation Facilitiation</h1>
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
                            <div className="cifLogin p-4 border-0">

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Email Field */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Login ID</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                                            placeholder="Provide your registered Email"
                                            {...register('Email', { required: 'Required', minLength: 5 })}
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div className="mb-4 text-start">
                                        <label className="form-label fw-bold">Password</label>
                                        <div className="input-group">
                                            <input
                                                placeholder="your password"
                                                type={showPassword ? 'text' : 'password'}
                                                className={`form-control border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                                                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                                {...register('password', { required: 'Required', minLength: 5 })}
                                            />
                                            <span
                                                className={`input-group-text bg-white border-start-0 ${errors.password ? 'border-danger text-danger' : ''}`}
                                                style={{ cursor: 'pointer', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff sx={{ fontSize: 20, color: '#666' }} />
                                                ) : (
                                                    <Visibility sx={{ fontSize: 20, color: '#666' }} />
                                                )}
                                            </span>
                                        </div>
                                        {errors.password && <small className="text-danger">{errors.password.message as string}</small>}
                                    </div>

                                    {/* Role Field */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Choose Role</label>
                                        <select className="form-select" {...register('UserRoleS', { required: 'Required' })}>
                                            <option value="">Select Role</option>
                                            <option value="400001">External Academia</option>
                                            <option value="400002">Industry User</option>
                                        </select>
                                    </div>




                                        <button type="submit" className="lpu-btn w-40" disabled={!isValid || loading}>
                                            {loading ? 'Processing...' : 'Submit'}
                                        </button>
                                    <div className="mb-4 mt-3 text-center">
                                        <div className="d-flex justify-content-between">
                                            <Link href="/lpuLogin" className="link-btn justify-content-start" >Internal User Login</Link>
                                            <Link href="/recover" className="link-btn justify-content-end" style={{ color: '#ef7d00' }}>Recover Account</Link>
                                        </div>

                                    </div>
                                    <div className="d-flex justify-content-center">
                                         <Link href="/StaffUser/StaffLogin" className="link-btn justify-content-end"  style={{ color: '#ef7d00' }}>Staff Login</Link>
                                    </div>
                                </form>


                                <div className="mt-4 text-center">
                                    Don't have an account? <Link href="/register" className="fw-bold text-decoration-none ms-5" style={{ color: '#ef7d00' }}>Register</Link>
                                </div>

                                <div className="mt-3 small text-center text-muted">
                                    By Login you agree with <Link href="/terms">terms and conditions</Link> and <Link href="/terms">privacy policy</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
// "use client";
// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import Swal from 'sweetalert2';
// import Cookies from 'js-cookie';
// import myAppWebService from '@/services/myAppWebService';
// interface Instrument {
//     id: string | number;
//     instrumentName: string;
//     categoryId: string | number;
//     imageUrl?: string;
// }

// export default function LoginPage() {

//     const [instruments, setInstruments] = useState<Instrument[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchInstruments = async () => {
//             try {
//                 const response = await myAppWebService.getAllInstruments();
//                 const data = response.item1 || response.data || response;
//                 setInstruments(Array.isArray(data) ? data : []);
//             } catch (err) {
//                 console.error('Error fetching instruments:', err);
//                 setError('Failed to load instruments');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchInstruments();
//     }, []);

//     const router = useRouter();
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [loginError, setLoginError] = useState<string | null>(null);
//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isValid },
//         reset,
//     } = useForm({
//         mode: 'onChange',
//         defaultValues: {
//             Email: '',
//             password: '',
//             UserRoleS: '',
//         },
//     });

//     const togglePasswordVisibility = () => setShowPassword(!showPassword);

//     const onSubmit = async (data: any) => {
//         setLoginError(null);

//         try {
//             const response = await myAppWebService.getAuthoriseUserData(
//                 data.Email,
//                 data.password,
//                 data.UserRoleS,

//             );

//             if (response?.item1?.length > 0) {
//                 handleLoginSuccess(response);
//             } else {
//                 setLoginError('Invalid login details.');
//                 Swal.fire('Invalid Login', 'Check Details!', 'warning');
//             }
//         } catch (error) {
//             setLoginError('An error occurred. Please try again.');
//             Swal.fire('Error', 'Server communication failed', 'error');
//         }
//     };
//     const handleLoginSuccess = (response: any) => {
//         const user = response.item1[0];
//         const userCookiesData = {
//             CandidateName: user.candidateName,
//             UserId: user.emailId,
//             EmailId: user.emailId,
//             UserRole: user.userRole,
//         };
//         Cookies.set('InternalUserAuthData', JSON.stringify(userCookiesData));
//         Swal.fire({
//             title: 'Terms & Conditions',
//             html: `
//         <div style="max-height: 400px; overflow-y: auto; text-align: left; padding: 10px;">
//           <p>Welcome to Lovely Professional University CIF...</p>
//           <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; line-height: 1.6;">
//             <li>We agree to acknowledge CIF, LPU in our publications...</li>
//             <li>I/We undertake to abide by the safety guidelines...</li>
//           </ul>
//         </div>`,
//             icon: 'info',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, Agreed',
//             cancelButtonText: 'No',
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 router.push('/InternalUserDashboard/Profile');
//             } else {
//                 Cookies.remove('InternalUserAuthData');
//                 router.push('/login');
//             }
//         });
//     };
//     useEffect(() => {
//         setLoading(true);
//         const timer = setTimeout(() => setLoading(false), 1500);
//         return () => clearTimeout(timer);
//     }, []);
//     return (
//         <>
//             {loading && (
//                 <div className="fullScreenLoader">
//                     <div className="customSpinnerOverlay">
//                         <img src="/assets/images/spinner.gif" alt="Loading..." />
//                     </div>
//                 </div>
//             )}

//             <section className="section bgDarkYellow py-5">
//                 <div className="container">
//                     <div className="headingWraper mb-5">
//                         <div className="mainHead">
//                             <h1 style={{ color: '#ef7d00' }}>Central Instrumentation Facilitiation</h1>
//                             <h2 className="text-center">User <span style={{ color: '#ef7d00' }}>Login</span> Page</h2>
//                         </div>
//                     </div>

//                     <div className="row justify-content-center">
//                         <div className="col-md-6 d-none d-md-block mt-5">
//                             <img
//                                 src="https://www.lpu.in/lpu-assets/images/cif/login-left.png"
//                                 alt="Login Illustration"
//                                 className="img-fluid"
//                             />
//                         </div>

//                         <div className="col-md-6">
//                             <div className="cifLogin p-4 border-0">
//                                 <form onSubmit={handleSubmit(onSubmit)}>
//                                     <div className="mb-4">
//                                         <label className="form-label fw-bold">Login ID</label>
//                                         <input
//                                             type="text"
//                                             className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
//                                             placeholder="Enter Login ID/ Email"
//                                             {...register('Email', { required: 'User Id is required', minLength: 5 })}
//                                         />
//                                         {errors.Email && <small className="text-danger">{errors.Email.message}</small>}
//                                     </div>

//                                     <div className="mb-4 position-relative">
//                                         <label className="form-label fw-bold">Password</label>
//                                         <div className="input-group">
//                                             <input
//                                                 type={showPassword ? 'text' : 'password'}
//                                                 className={`form-control ${errors.password ? 'is-invalid' : ''}`}
//                                                 placeholder="Enter password"
//                                                 {...register('password', { required: 'Password is required', minLength: 5 })}
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-outline-secondary"
//                                                 onClick={togglePasswordVisibility}
//                                             >
//                                                 {showPassword ? 'Hide' : 'Show'}
//                                             </button>
//                                         </div>
//                                         {errors.password && <small className="text-danger">{errors.password.message}</small>}
//                                     </div>

//                                     <div className="mb-4">
//                                         <label className="form-label fw-bold">Choose Role</label>
//                                         <select
//                                             className={`form-select ${errors.UserRoleS ? 'is-invalid' : ''}`}
//                                             {...register('UserRoleS', { required: 'Role is required' })}
//                                         >
//                                             <option value="">Select Role</option>
//                                             <option value="400001">External Academia</option>
//                                             <option value="400002">Industry User</option>
//                                         </select>
//                                         {errors.UserRoleS && <small className="text-danger">{errors.UserRoleS.message}</small>}
//                                     </div>

//                                     {loginError && <div className="alert alert-danger text-center py-2">{loginError}</div>}

//                                     <div className="mb-4 text-center">
//                                         <button
//                                             type="submit"
//                                             className="lpu-btn w-20"
//                                             disabled={!isValid}
//                                         >
//                                             Submit
//                                         </button>
//                                     </div>

//                                     <div className="d-flex justify-content-between small">
//                                         <Link href="/lpuLogin" className="text-decoration-none text-secondary">Internal User Login</Link>
//                                         <Link href="/recover" className="text-decoration-none" style={{ color: '#ef7d00' }}>Recover Account</Link>
//                                     </div>

//                                     <div className="text-center mt-3">
//                                         <Link href="/StaffLogins" className="small text-decoration-none" style={{ color: '#ef7d00' }}>Staff Login</Link>
//                                     </div>
//                                 </form>
//                             </div>

//                             <div className="mt-4 text-center">
//                                 Don't have an account? <Link href="/register" className="fw-bold text-decoration-none" style={{ color: '#ef7d00' }}>Register</Link>
//                             </div>

//                             <div className="mt-3 small text-center text-muted">
//                                 By Login you agree with <Link href="/terms">terms and conditions</Link> and <Link href="/terms">privacy policy</Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }