"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { Box, CircularProgress } from '@mui/material';
import { instrumentService } from '@/services/instrumentService';

export default function ChangePassword() {
    const router = useRouter();

    // --- States ---
     const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [pageLoading, setPageLoading] = useState(true); // Fixed: Start as true for initial load
    const [actionLoading, setActionLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);

    const {
        register,
        handleSubmit,
        trigger,
        getValues,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm({ mode: "onChange" });

    const password = watch("password");

    // --- Password Strength Logic (Memoized) ---
    const strength = useMemo(() => {
        if (!password) return { score: 0, label: "", color: "bg-danger" };
        let score = 0;
        if (password.length >= 8) score += 25;
        if (/[A-Z]/.test(password)) score += 25;
        if (/\d/.test(password)) score += 25;
        if (/[!@#$%^&*]/.test(password)) score += 25;

        if (score <= 25) return { score, label: "Weak", color: "bg-danger" };
        if (score <= 75) return { score, label: "Good", color: "bg-warning" };
        return { score, label: "Strong", color: "bg-success" };
    }, [password]);

    // --- Initialization & Auth Guard ---
    
      useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
      }, []);
    useEffect(() => {
        const initializeAccountSettings = async () => {
            const cookieData = Cookies.get('InternalUserAuthData');
            
            if (!cookieData) {
                router.push('/login');
                return;
            }

            try {
                const parsed = JSON.parse(cookieData);
                const email = parsed.EmailId;
                setValue("email", email);

                const response = await instrumentService.CIFGetUserDetails(email);
                const data = response.item1 || response.data || response;
                const user = Array.isArray(data) ? data[0] : data;

                if (user) {
                    setUserDetails(user);
                    setCurrentStep(2); // Move to Identity Verification
                } else {
                    throw new Error("User record not found");
                }
            } catch (error) {
                console.error("Session Error:", error);
                setErrorMessage("Unable to verify session. Please login again.");
            } finally {
                // Ensure loader shows for at least a brief moment for UX
                setTimeout(() => setPageLoading(false), 500);
            }
        };

        initializeAccountSettings();
    }, [router, setValue]);

    // --- Handlers ---
    const verifyIdProof = async () => {
        const isInputValid = await trigger("idProofNumber");
        if (!isInputValid) return;

        const enteredId = String(getValues("idProofNumber")).trim();
        const storedId = String(userDetails?.idProofNumber).trim();

        if (enteredId === storedId) {
            setErrorMessage("");
            setCurrentStep(3);
        } else {
            setErrorMessage("ID Proof number does not match our records.");
        }
    };

    const onResetPassword = async () => {
        setActionLoading(true);
        const formData = new FormData();
        formData.append('UserId', getValues("email"));
        formData.append('Password', password);

        try {
            const response = await instrumentService.CIFUpdateUserDetails(formData);
            const resData = response.item1 || response.data || response;

            if (resData?.[0]?.msg === 'Success') {
                await Swal.fire({
                    title: 'Success!',
                    text: 'Your password has been updated. Please login with your new credentials.',
                    icon: 'success',
                    confirmButtonColor: '#ef7d00'
                });
                Cookies.remove('InternalUserAuthData');
                router.push('/login');
            } else {
                throw new Error(resData?.[0]?.msg || 'Update failed');
            }
        } catch (error: any) {
            Swal.fire({ title: 'Error', text: error.message || 'Server error', icon: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    // --- Global Loader ---
    if (pageLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
                <CircularProgress sx={{ color: '#ef7d00' }} />
                <span className="fw-bold text-secondary">Loading Account Settings...</span>
            </Box>
        );
    }

    return (
        <>
            {loading && (
                <div className="fullScreenLoader">
                    <div className="customSpinnerOverlay">
                        <img src="/assets/images/spinner.gif" alt="Loading..." />
                    </div>
                </div>
            )}

            <section className="min-vh-100 mt-3">
                <div className="container">
                    <div className="text-center mt-2 mb-4">
                        <h2 className="fw-bold">Account Settings</h2>
                    </div>

                    <div className="section row justify-content-center g-0 shadow-lg rounded-4 overflow-hidden bgLightYellow">
                        {/* LEFT SIDE: Visual */}
                        <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center p-5">
                            <img
                                src="https://www.lpu.in/lpu-assets/images/cif/login-left.png"
                                alt="Security"
                                className="img-fluid floating-img"
                                style={{ maxHeight: '350px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}
                            />
                        </div>

                        {/* RIGHT SIDE: Wizard Form */}
                        <div className="col-md-5 p-4 p-lg-5 shadow-lg rounded-2">
                            <div className="d-flex justify-content-between mb-4">
                                <span className={`badge ${currentStep >= 2 ? 'bg-success' : 'bg-secondary'} rounded-pill`}>1. Identity</span>
                                <span className={`badge ${currentStep >= 3 ? 'bg-success' : 'bg-secondary'} rounded-pill`}>2. Security</span>
                            </div>

                            {/* STEP 2: Identity Verification */}
                            {currentStep === 2 && (
                                <div className="fade-in">
                                    <h2 className="fw-bold text-dark">Identity Verification</h2>
                                    <p className="text-muted small mb-4">Confirm your <strong>{userDetails?.idProofType || 'Identity Proof'}</strong> to proceed.</p>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-lg border-2 ${errors.idProofNumber ? 'is-invalid' : ''}`}
                                            placeholder="Enter ID Proof Number"
                                            {...register("idProofNumber", { required: "ID Proof is required" })}
                                        />
                                    </div>
                                    <button className="btn btn-primary btn-lg w-100 fw-bold shadow-sm" onClick={verifyIdProof} style={{ backgroundColor: '#ef7d00', border: 'none' }}>
                                        Continue
                                    </button>
                                </div>
                            )}

                            {/* STEP 3: Password Reset */}
                            {currentStep === 3 && (
                                <form onSubmit={handleSubmit(onResetPassword)} className="fade-in">
                                    <h4 className="fw-bold text-dark mb-4">Choose New Password</h4>

                                    <div className="mb-3">
                                        <label className="small fw-bold text-secondary">NEW PASSWORD</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control border-2 border-end-0"
                                                {...register("password", { required: "Required", minLength: { value: 8, message: "Min 8 characters" } })}
                                            />
                                            <button className="btn btn-outline-secondary border-2 border-start-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                            </button>
                                        </div>
                                        {password && (
                                            <div className="mt-2">
                                                <div className="progress" style={{ height: '4px' }}>
                                                    <div className={`progress-bar ${strength.color}`} style={{ width: `${strength.score}%` }}></div>
                                                </div>
                                                <div className="d-flex justify-content-between mt-1">
                                                    <small className="text-muted">Security:</small>
                                                    <small className={`fw-bold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</small>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="small fw-bold text-secondary">CONFIRM PASSWORD</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control border-2 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            {...register("confirmPassword", {
                                                required: "Passwords must match",
                                                validate: (val) => val === password || "The passwords you entered do not match."
                                            })}
                                        />
                                        {errors.confirmPassword && <small className="text-danger fw-bold">{errors.confirmPassword.message as string}</small>}
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button type="button" className="btn btn-outline-secondary w-25" onClick={() => setCurrentStep(2)}>Back</button>
                                        <button type="submit" className="btn btn-success w-75 fw-bold shadow-sm" disabled={!isValid || actionLoading}>
                                            {actionLoading ? <CircularProgress size={20} color="inherit" /> : "Update Password"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {errorMessage && <div className="alert alert-danger mt-4 border-0 shadow-sm">{errorMessage}</div>}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                .fade-in { animation: fadeIn 0.5s ease-in; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .floating-img { animation: float 3s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            `}</style>
            </section>
        </>
    );
}

// "use client";

// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { instrumentService } from '@/services/instrumentService';
// import swal from 'sweetalert2';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';

// export default function ChangePassword() {
//     const [currentStep, setCurrentStep] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [strength, setStrength] = useState({ score: 0, label: "", color: "bg-danger" });
//     const router = useRouter();
//     const [userDetails, setUserDetails] = useState<any[]>([]);

//     const {
//         register,
//         handleSubmit,
//         trigger,
//         getValues,
//         watch,
//         setValue,
//         formState: { errors, isValid },
//     } = useForm({ mode: "onChange" });

//     const password = watch("password");

//      useEffect(() => {
//         setLoading(true);
//         const timer = setTimeout(() => setLoading(false), 1500);
//         return () => clearTimeout(timer);
//       }, []);

//     // Professional Strength Calculator
//     useEffect(() => {
//         const calculateStrength = (pwd: string) => {
//             if (!pwd) return { score: 0, label: "", color: "bg-danger" };
//             let score = 0;
//             if (pwd.length >= 8) score += 25;
//             if (/[A-Z]/.test(pwd)) score += 25;
//             if (/\d/.test(pwd)) score += 25;
//             if (/[!@#$%^&*]/.test(pwd)) score += 25;

//             if (score <= 25) return { score, label: "Weak", color: "bg-danger" };
//             if (score <= 75) return { score, label: "Good", color: "bg-warning" };
//             return { score, label: "Strong", color: "bg-success" };
//         };
//         setStrength(calculateStrength(password || ""));
//     }, [password]);

//     // Cookie Logic
//     useEffect(() => {
//         const fetchUserOnLoad = async () => {
//             const cookieData = Cookies.get('InternalUserAuthData');
//             if (!cookieData) { router.push('/login'); return; }
//             try {
//                 const parsed = JSON.parse(cookieData);
//                 const email = parsed.EmailId;
//                 if (email) {
//                     setLoading(true);
//                     setValue("email", email); 
//                     const response = await instrumentService.CIFGetUserDetails(email);
//                     const data = response.item1 || response.data || response;
//                     if (data && data.length > 0) {
//                         setUserDetails(Array.isArray(data) ? data : []);
//                         setCurrentStep(2); 
//                     }
//                 }
//             } catch (error) { setErrorMessage("Session error."); } finally { setLoading(false); }
//         };
//         fetchUserOnLoad();
//     }, [router, setValue]);

//     const verifyIdProof = async () => {
//         const isFormValid = await trigger("idProofNumber");
//         if (!isFormValid) return;
//         if (userDetails.length > 0 && String(userDetails[0].idProofNumber) === String(getValues("idProofNumber"))) {
//             setErrorMessage("");
//             setCurrentStep(3);
//         } else {
//             setErrorMessage("ID Proof number does not match our records.");
//         }
//     };

//     const onResetPassword = async (data: any) => {
//         setLoading(true);
//         const formData = new FormData();
//         formData.append('UserId', getValues("email"));
//         formData.append('Password', password);
//         try {
//             const response = await instrumentService.CIFUpdateUserDetails(formData);
//             const resData = response.item1 || response.data || response;
//             if (resData?.[0]?.msg === 'Success') {
//                 await swal.fire({ title: 'Success!', text: 'Your password has been changed.', icon: 'success' });
//                 Cookies.remove('InternalUserAuthData');
//                 router.push('/login');
//             } else {
//                 swal.fire({ title: 'Error', text: resData?.[0]?.msg || 'Update failed', icon: 'error' });
//             }
//         } catch (error) { swal.fire({ title: 'Error', text: 'Server error', icon: 'error' }); } finally { setLoading(false); }
//     };

//     return (
//         <>
//             {loading && (
//                 <div className="fullScreenLoader">
//                     <div className="customSpinnerOverlay">
//                         <img src="/assets/images/spinner.gif" alt="Loading..." />
//                     </div>
//                 </div>
//             )}
//             <section className="min-vh-100  mt-3">
//                 <div className="container">
//                     <div className="text-center mt-2  mb-4">
//                         <h2 className="fw-bold "> Account Settings </h2>
//                         {/* <p className="opacity-75">Follow the steps to update your credentials.</p> */}
//                     </div>
//                     <div className="section row justify-content-center g-0 shadow-lg rounded-4 overflow-hidden bgLightYellow">

//                         {/* LEFT SIDE: Brand & Image */}
//                         <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center p-5" >

//                             <img
//                                 src="https://www.lpu.in/lpu-assets/images/cif/login-left.png"
//                                 alt="Security"
//                                 className="img-fluid floating-img"
//                                 style={{ maxHeight: '350px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}
//                             />
//                         </div>

//                         {/* RIGHT SIDE: Wizard Form */}
//                         <div className="col-md-5 p-4 p-lg-5 shadow-lg rounded-2 ">
//                             <div className="d-flex justify-content-between mb-4">
//                                 <span className={`badge ${currentStep >= 2 ? 'bg-success' : 'bg-secondary'} rounded-pill`}>1. Identity</span>
//                                 <span className={`badge ${currentStep >= 3 ? 'bg-success' : 'bg-secondary'} rounded-pill`}>2. Security</span>
//                             </div>

//                             {currentStep === 2 && (
//                                 <div className="fade-in">
//                                     <h2 className="fw-bold text-dark">Identity Verification</h2>
//                                     <h3 className="text-mute small mb-4">Confirm your <strong>{userDetails[0]?.idProofType}</strong> to proceed.</h3>
//                                     <div className="mb-4">
//                                         <input
//                                             type="text"
//                                             className={`form-control form-control-lg border-2 ${errors.idProofNumber ? 'is-invalid' : ''}`}
//                                             placeholder="Enter ID Proof Number"
//                                             style={{ borderRadius: '10px' }}
//                                             {...register("idProofNumber", { required: true })}
//                                         />
//                                     </div>
//                                     <button className="btn btn-primary btn-lg w-100 fw-bold shadow-sm" onClick={verifyIdProof} style={{ backgroundColor: '#ef7d00', border: 'none' }}>
//                                         Continue
//                                     </button>
//                                 </div>
//                             )}

//                             {currentStep === 3 && (
//                                 <form onSubmit={handleSubmit(onResetPassword)} className="fade-in">
//                                     <h4 className="fw-bold text-dark mb-4">Choose New Password</h4>

//                                     {/* New Password Field */}
//                                     <div className="mb-3">
//                                         <label className="small fw-bold text-secondary">NEW PASSWORD</label>
//                                         <div className="input-group">
//                                             <input
//                                                 type={showPassword ? "text" : "password"}
//                                                 className={`form-control border-2 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
//                                                 style={{ borderRadius: '10px 0 0 10px' }}
//                                                 {...register("password", { required: "Required", minLength: 8 })}
//                                             />
//                                             <button
//                                                 className="btn btn-outline-secondary border-2 border-start-0"
//                                                 type="button"
//                                                 onClick={() => setShowPassword(!showPassword)}
//                                                 style={{ borderRadius: '0 10px 10px 0' }}
//                                             >
//                                                 <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
//                                             </button>
//                                         </div>
//                                         {password && (
//                                             <div className="mt-2">
//                                                 <div className="progress" style={{ height: '4px' }}>
//                                                     <div className={`progress-bar ${strength.color}`} style={{ width: `${strength.score}%` }}></div>
//                                                 </div>
//                                                 <div className="d-flex justify-content-between mt-1">
//                                                     <small className="text-muted">Security Level:</small>
//                                                     <small className={`fw-bold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</small>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Confirm Password Field */}
//                                     <div className="mb-4">
//                                         <label className="small fw-bold text-secondary">CONFIRM PASSWORD</label>
//                                         <input
//                                             type={showPassword ? "text" : "password"}
//                                             className={`form-control border-2 ${errors.confirmPassword ? 'is-invalid' : ''}`}
//                                             style={{ borderRadius: '10px' }}
//                                             {...register("confirmPassword", {
//                                                 required: "Passwords must match",
//                                                 validate: (val) => val === password || "The passwords you entered do not match."
//                                             })}
//                                         />
//                                         {errors.confirmPassword && (
//                                             <div className="text-danger mt-2 small fw-bold d-flex align-items-center">
//                                                 <i className="bi bi-exclamation-circle-fill me-2"></i>
//                                                 {errors.confirmPassword.message as string}
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="d-flex gap-2">
//                                         <button type="button" className="btn btn-outline-secondary w-25" onClick={() => setCurrentStep(2)}>Back</button>
//                                         <button type="submit" className="btn btn-success w-75 fw-bold shadow-sm" disabled={!isValid || loading}>
//                                             {loading ? "Updating..." : "Update Password"}
//                                         </button>
//                                     </div>
//                                 </form>
//                             )}

//                             {errorMessage && <div className="alert alert-danger mt-4 border-0 shadow-sm">{errorMessage}</div>}
//                         </div>
//                     </div>
//                 </div>

//                 <style jsx>{`
//                 .fade-in { animation: fadeIn 0.5s ease-in; }
//                 @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//                 .floating-img { animation: float 3s ease-in-out infinite; }
//                 @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
//             `}</style>
//             </section>
//         </>
//     );
// }