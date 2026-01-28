"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { instrumentService } from '@/services/instrumentService';
import styles from '@/styles/RecoverUser.module.css'; // Optional custom styles
import swal from 'sweetalert2';
import router from 'next/router';
import { useRouter } from 'next/navigation';
import { Height } from '@mui/icons-material';
interface UserDetails {
    idProofType: string | number;
    idProofNumber: string | number;
    returnMessage: string;
}


export default function AccountRecovery() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [userDetails, setUserDetails] = useState<UserDetails[]>([]);

    const {
        register,
        handleSubmit,
        trigger,
        getValues,
        watch,
        formState: { errors, isValid },
    } = useForm({ mode: "onTouched" });

    const password = watch("password");
    const checkEmail = async () => {
        const isEmailValid = await trigger("email");
        if (!isEmailValid) return;

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await instrumentService.CIFGetUserDetails(getValues("email"));
            const data = response.item1 || response.data || response;
            if (data && data.length > 0) {
                const user = data[0];
                if (user.returnMessage === "FoundUser") {
                    setUserDetails(Array.isArray(data) ? data : []);
                    setCurrentStep(2);
                } else {
                    setErrorMessage("User not found in our records.");
                }
            } else {
                setErrorMessage("No user data returned from the server.");
            }
        } catch (error) {
            console.error("Parsing Error:", error);
            setErrorMessage("System error while fetching user details.");
        } finally {
            setLoading(false);
        }
    };
    const verifyIdProof = async () => {
        const isFormValid = await trigger("idProofNumber");
        if (!isFormValid) return;

        const enteredId = getValues("idProofNumber");

        if (userDetails[0].idProofNumber === enteredId) {
            setErrorMessage("");
            setCurrentStep(3);
        } else {
            setErrorMessage("ID Proof number does not match");
        }
    };
    const onResetPassword = async (data: any) => {
        setLoading(true);
        const userId = getValues("email");

        const formData = new FormData();
        formData.append('UserId', userId);
        formData.append('Password', password);

        try {

            const response = await instrumentService.CIFUpdateUserDetails(formData);
            const data = response.item1 || response.data || response;

            if (data && data.length > 0) {
                const resultMsg = data[0].msg;

                if (resultMsg === 'Success') {
                    swal.fire({
                        title: 'Details Updated Successfully!',
                        text: 'You will be logged out',
                        icon: 'success'
                    }).then(() => {
                        router.push('/login');
                    });
                } else {
                    const msg = resultMsg === 'Failed' ? 'Unable to Update Details' : 'Something Went Wrong';
                    swal.fire({ title: msg, icon: 'error' }).then(() => {
                        window.location.reload();
                    });
                }
            }
        } catch (error) {
            swal.fire({ title: 'Error', text: 'Failed to Update.', icon: 'error' })
                .then(() => window.location.reload());
        } finally {
            setLoading(false);
        }
        setLoading(false);
    };

    const previousStep = () => {
        setErrorMessage("");
        setCurrentStep((prev) => prev - 1);
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

            <section className="bgDarkYellow py-5 vh-100">
                <div className="container">
                    <div className="headingWraper mb-5">
                        <div className="mainHead">
                            <h1 style={{ color: '#ef7d00' }}>Central Instrumentation Facilitiation</h1>
                            <h2 className="text-center">Account <span style={{ color: '#ef7d00' }}>Recovery</span> Page</h2>
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
                            <div
                                className="p-4 shadow-lg border-0 d-flex flex-column"
                                style={{ height: '31rem' }}
                            >
                                {/* ===== MAIN CONTENT (Steps) ===== */}
                                <div className="flex-grow-1">
                                    {currentStep === 1 && (
                                        <div className="step-container">
                                            <h3 className="fs-5 mb-3">Provide Your Email</h3>
                                            <div className="form-group mb-3">
                                                <input
                                                    type="email"
                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                    placeholder="Enter Registered Email"
                                                    {...register("email", {
                                                        required: "Email is required",
                                                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                                    })}
                                                />
                                                {errors.email && (
                                                    <small className="text-danger">
                                                        {errors.email.message as string}
                                                    </small>
                                                )}
                                            </div>
                                            <button
                                                className="btn btn-outline-danger w-50"
                                                onClick={checkEmail}
                                                disabled={loading}
                                            >
                                                {loading ? "Searching..." : "Next"}
                                            </button>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="step-container">
                                            <h3 className="fs-5 mb-3">
                                                Verify {userDetails[0].idProofType}
                                            </h3>
                                            <div className="form-group mb-3">
                                                <input
                                                    type="password"
                                                    className={`form-control ${errors.idProofNumber ? 'is-invalid' : ''}`}
                                                    placeholder={`Enter your ${userDetails[0].idProofType} number`}
                                                    {...register("idProofNumber", {
                                                        required: "Identity verification is required"
                                                    })}
                                                />
                                                {errors.idProofNumber && (
                                                    <small className="text-danger">
                                                        This field is required.
                                                    </small>
                                                )}
                                            </div>
                                            <div className="d-flex justify-content-between gap-2">
                                                <button
                                                    className="btn btn-outline-dark w-50"
                                                    onClick={previousStep}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger w-50"
                                                    onClick={verifyIdProof}
                                                    disabled={loading}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <form onSubmit={handleSubmit(onResetPassword)} className="step-container">
                                            <h3 className="fs-5 mb-3">Reset Your Password</h3>

                                            <div className="mb-3">
                                                <label className="form-label small">New Password</label>
                                                <input
                                                    type="password"
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                    {...register("password", { required: true, minLength: 8 })}
                                                />
                                                {errors.password && (
                                                    <small className="text-danger d-block">
                                                        Min 8 characters required.
                                                    </small>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label small">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                    {...register("confirmPassword", {
                                                        required: true,
                                                        validate: (val) => val === password || "Passwords do not match"
                                                    })}
                                                />
                                                {errors.confirmPassword && (
                                                    <small className="text-danger d-block">
                                                        {errors.confirmPassword.message as string}
                                                    </small>
                                                )}
                                            </div>

                                            <div className="d-flex justify-content-between gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark w-50"
                                                    onClick={previousStep}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-danger w-50"
                                                    disabled={!isValid || loading}
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {errorMessage && (
                                        <div className="alert alert-danger mt-3 small p-2 text-center">
                                            {errorMessage}
                                        </div>
                                    )}
                                </div>

                                {/* ===== FOOTER (ALWAYS AT BOTTOM) ===== */}
                                <hr />

                                <div className="mt-auto text-center">
                                    <div className="d-flex justify-content-between mb-2">
                                        <Link href="/lpuLogin" className="text-decoration-none fw-bold">
                                            Internal Login
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="text-decoration-none fw-bold"
                                            style={{ color: '#ef7d00' }}
                                        >
                                            Login
                                        </Link>
                                    </div>
                                    <p className="mb-0">
                                        Don't have an account?{" "}
                                        <Link href="/register" className="fw-bold text-danger">
                                            Register
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
 
                    </div>
                </div>
        </section >
          </>
        
    );
}

function setError(arg0: string) {
    throw new Error('Function not implemented.');
}
