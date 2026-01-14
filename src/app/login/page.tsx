"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import styles from '@/styles/Instruments.module.css'; // Using your existing style module
import myAppWebService from '@/services/myAppWebService';
import FacilitiesSection from '@/components/CIF/FacilitiesSection';
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
    const [loginError, setLoginError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            Email: '',
            password: '',
            UserRoleS: '',
        },
    });

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const onSubmit = async (data: any) => {
        setLoginError(null);

        try {
            const response = await myAppWebService.getAuthoriseUserData(
                data.Email,
                data.password,
                data.UserRoleS,

            );

            if (response?.item1?.length > 0) {
                handleLoginSuccess(response);
            } else {
                setLoginError('Invalid login details.');
                Swal.fire('Invalid Login', 'Check Details!', 'warning');
            }
        } catch (error) {
            setLoginError('An error occurred. Please try again.');
            Swal.fire('Error', 'Server communication failed', 'error');
        }
    };
    const handleLoginSuccess = (response: any) => {
        const user = response.item1[0];
        const userCookiesData = {
            CandidateName: user.candidateName,
            UserId: user.emailId,
            EmailId: user.emailId,
            UserRole: user.userRole,
        };
        Cookies.set('InternalUserAuthData', JSON.stringify(userCookiesData));
        Swal.fire({
            title: 'Terms & Conditions',
            html: `
        <div style="max-height: 400px; overflow-y: auto; text-align: left; padding: 10px;">
          <p>Welcome to Lovely Professional University CIF...</p>
          <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; line-height: 1.6;">
            <li>We agree to acknowledge CIF, LPU in our publications...</li>
            <li>I/We undertake to abide by the safety guidelines...</li>
          </ul>
        </div>`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Agreed',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                router.push('/NewBookings');
            } else {
                Cookies.remove('InternalUserAuthData');
                router.push('/login');
            }
        });
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
                            <h1 style={{ color: '#ef7d00' }}>Central Instrumentation Facilitiation</h1>
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
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Login ID</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                                            placeholder="Enter Login ID/ Email"
                                            {...register('Email', { required: 'User Id is required', minLength: 5 })}
                                        />
                                        {errors.Email && <small className="text-danger">{errors.Email.message}</small>}
                                    </div>

                                    <div className="mb-4 position-relative">
                                        <label className="form-label fw-bold">Password</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder="Enter password"
                                                {...register('password', { required: 'Password is required', minLength: 5 })}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                        {errors.password && <small className="text-danger">{errors.password.message}</small>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Choose Role</label>
                                        <select
                                            className={`form-select ${errors.UserRoleS ? 'is-invalid' : ''}`}
                                            {...register('UserRoleS', { required: 'Role is required' })}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="400001">External Academia</option>
                                            <option value="400002">Industry User</option>
                                        </select>
                                        {errors.UserRoleS && <small className="text-danger">{errors.UserRoleS.message}</small>}
                                    </div>

                                    {loginError && <div className="alert alert-danger text-center py-2">{loginError}</div>}

                                    <div className="mb-4 text-center">
                                        <button
                                            type="submit"
                                            className="lpu-btn w-20"
                                            disabled={!isValid}
                                        >
                                            Submit
                                        </button>
                                    </div>

                                    <div className="d-flex justify-content-between small">
                                        <Link href="/lpuLogin" className="text-decoration-none text-secondary">Internal User Login</Link>
                                        <Link href="/recoverAccount" className="text-decoration-none" style={{ color: '#ef7d00' }}>Recover Account</Link>
                                    </div>

                                    <div className="text-center mt-3">
                                        <Link href="/StaffLogins" className="small text-decoration-none" style={{ color: '#ef7d00' }}>Staff Login</Link>
                                    </div>
                                </form>
                            </div>

                            <div className="mt-4 text-center">
                                Don't have an account? <Link href="/register" className="fw-bold text-decoration-none" style={{ color: '#ef7d00' }}>Register</Link>
                            </div>

                            <div className="mt-3 small text-center text-muted">
                                By Login you agree with <Link href="/terms">terms and conditions</Link> and <Link href="/terms">privacy policy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <FacilitiesSection instruments={instruments} /> */}
        </>
    );
}