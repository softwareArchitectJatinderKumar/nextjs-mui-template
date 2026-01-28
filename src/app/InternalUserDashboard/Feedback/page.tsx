"use client";

import React, { useState } from 'react';
import FeedbackForm from '@/components/CIF/FeedbackForm';
import { instrumentService } from '@/services/instrumentService';
import swal from 'sweetalert2';
import Cookies from 'js-cookie';

export default function FeedbackPage() {
    const [isLoading, setIsLoading] = useState(false);
   const handleFeedbackSubmit = async (data: any) => {
    setIsLoading(true);
    try {
        const cookieData = Cookies.get('InternalUserAuthData');
        const userEmail = cookieData ? JSON.parse(cookieData).EmailId : "";

        // Create a clean POJO (Plain Old JavaScript Object)
        const payload = {
            EmailId: userEmail,
            Rating: data.rating,
            Comments: data.CifComments,
            Suggestions: data.suggestions
        };


        const response = await instrumentService.NewCifFeedback(payload);
        
        setIsLoading(false);

        const finalResult = response?.item1?.[0] || response?.[0];

        if (finalResult?.msg === 'Success' || finalResult?.returnId > 0) {
            await swal.fire({ 
                title: 'Success', 
                text: 'Feedback Submitted Successfully', 
                icon: 'success',
                confirmButtonColor: '#ff9219'
            });
            window.location.reload();
        } else if (finalResult?.returnId === -1) {
            swal.fire({ title: 'Already Submitted', icon: 'warning' });
        } else {
            swal.fire({ title: 'Error', text: finalResult?.msg || 'Submission failed', icon: 'error' });
        }
    } catch (error) {
        setIsLoading(false);
        console.error("Submission Error:", error);
        swal.fire({ title: 'Error', text: 'Server connection failed', icon: 'error' });
    } finally {
        setIsLoading(false);
    }
};

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <FeedbackForm
                            onSubmit={handleFeedbackSubmit}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// without using feedback page component

// "use client";

// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { instrumentService } from '@/services/instrumentService';
// import styles from '@/styles/Feedback.module.css';
// import swal from 'sweetalert2';
// import Cookies from 'js-cookie';

// export default function FeedbackForm() {
//     const [isLoading, setIsLoading] = useState(false);
//     const [submissionSuccess, setSubmissionSuccess] = useState(false);
//     const [submissionError, setSubmissionError] = useState(false);
//     const [userEmail, setUserEmail] = useState("");

//     const {
//         register,
//         handleSubmit,
//         watch,
//         setValue,
//         formState: { errors, isSubmitted }
//     } = useForm({
//         defaultValues: {
//             rating: "",
//             CifComments: "",
//             suggestions: "",
//             name: "",
//             email: ""
//         }
//     });

//     const selectedRating = watch("rating");

//     // Pre-fill user data from cookies (equivalent to Angular's ngOnInit)
//     useEffect(() => {
//         const cookieData = Cookies.get('InternalUserAuthData');
//         if (cookieData) {
//             const parsed = JSON.parse(cookieData);
//             setUserEmail(parsed.EmailId || "");
//             setValue("email", parsed.EmailId || "");
//             setValue("name", parsed.UserName || "User");
//         }
//     }, [setValue]);

//     const onSubmit = async (data: any) => {
//         setIsLoading(true);
//         setSubmissionError(false);
//         setSubmissionSuccess(false);

//         const formData = new FormData();
//         formData.append('Email', userEmail);
//         formData.append('Rating', data.rating);
//         formData.append('Comments', data.CifComments);
//         formData.append('Suggestions', data.suggestions);

//         try {
//             const response = await instrumentService.NewCifFeedback(formData);
//             if (response) {
//                 setSubmissionSuccess(true);
//                 swal.fire("Thank You!", "Feedback submitted successfully.", "success");
//             }
//         } catch (error) {
//             setSubmissionError(true);
//             swal.fire("Error", "Could not submit feedback. Please try again.", "error");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <>
//             {isLoading && (
//                 <div className={styles.fullPageLoader}>
//                     <div className={styles.loaderSpinner}>
//                         {/* Note: Ensure you have Material Icons loaded or replace with a Bootstrap icon */}
//                         <i className={`bi bi-arrow-repeat ${styles.spinIcon}`}></i>
//                     </div>
//                 </div>
//             )}

//             <div className="container mt-5 mb-5">
//                 <div className="row justify-content-center">
//                     <div className="col-md-10">
//                         <div className={`card ${styles.cardCustom}`}>
//                             <div className={`card-header text-white ${styles.cardHeader}`}>
//                                 <h3 className="mb-2">Feedback Form</h3>
//                                 <p className="mb-2">We value your opinion!</p>
//                             </div>

//                             <div className="card-body p-4">
//                                 <form onSubmit={handleSubmit(onSubmit)}>

//                                     {/* Rating Field */}
//                                     <div className="mb-4">
//                                         <label className="form-label d-block fw-bold">Overall Satisfaction Rating</label>
//                                         <div className="btn-group" role="group">
//                                             {[1, 2, 3, 4, 5].map((num) => (
//                                                 <label
//                                                     key={num}
//                                                     className={`btn btn-outline-primary ${styles.ratingStar} ${selectedRating == num.toString() ? styles.ratingStarActive : ''}`}
//                                                 >
//                                                     <input
//                                                         type="radio"
//                                                         className="btn-check"
//                                                         value={num}
//                                                         {...register("rating", { required: true })}
//                                                     />
//                                                     {num}
//                                                 </label>
//                                             ))}
//                                         </div>
//                                         {errors.rating && <div className="text-danger small mt-1">Please rate your experience</div>}
//                                     </div>

//                                     {/* Feedback Comments */}
//                                     <div className="mb-4">
//                                         <label className="form-label fw-bold">Your Feedback</label>
//                                         <textarea
//                                             className={`form-control ${errors.CifComments ? 'is-invalid' : ''}`}
//                                             rows={4}
//                                             {...register("CifComments", { required: true })}
//                                         ></textarea>
//                                     </div>

//                                     {/* Suggestions */}
//                                     <div className="mb-4">
//                                         <label className="form-label fw-bold">Suggestions (if Any)</label>
//                                         <textarea
//                                             className="form-control"
//                                             rows={4}
//                                             {...register("suggestions")}
//                                         ></textarea>
//                                     </div>

//                                     <div className="d-grid">
//                                         <button type="submit" className="btn btn-primary btn-lg" style={{ background: '#ff9219', border: 'none' }}>
//                                             Submit Feedback
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }