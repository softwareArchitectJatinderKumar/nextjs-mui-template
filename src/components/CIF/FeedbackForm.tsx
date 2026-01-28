"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import styles from '@/styles/Feedback.module.css';


interface FeedbackProps {
    onSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
}

export default function FeedbackForm({ onSubmit, isLoading }: FeedbackProps) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: { rating: "", CifComments: "", suggestions: "" }
    });

    const selectedRating = watch("rating");

    return (
        <>
            {isLoading && (
                <div className={styles.fullPageLoader}>
                    <div className={styles.loaderSpinner}>
                        <i className={`bi bi-arrow-repeat ${styles.spinIcon}`}></i>
                        <p className="text-white mt-2 mb-0">Submitting...</p>
                    </div>
                </div>
            )}

            <div className={`card ${styles.cardCustom}`}>
                <div className={`card-header text-white ${styles.cardHeader}`}>
                    <h3 className="mb-1">Feedback Form</h3>
                    <p className="mb-0 opacity-90">We value your opinion!</p>
                </div>

                <div className="card-body p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Rating Section */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">Overall Satisfaction Rating</label>
                            <div className="d-flex gap-2 flex-wrap">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <label key={num} 
                                        className={`btn btn-outline-primary ${styles.ratingStar} ${selectedRating == String(num) ? styles.ratingStarActive : ''}`}>
                                        <input 
                                            type="radio" 
                                            value={num} 
                                            className="d-none" 
                                            {...register("rating", { required: "Please select a rating" })} 
                                        />
                                        {num}
                                    </label>
                                ))}
                            </div>
                            {errors.rating && <small className="text-danger fw-bold mt-1 d-block">{errors.rating.message}</small>}
                        </div>

                        {/* Comments */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">Your Feedback</label>
                            <textarea 
                                className={`form-control ${errors.CifComments ? 'is-invalid' : ''}`}
                                rows={4}
                                placeholder="Enter your feedback here..."
                                {...register("CifComments", { required: "Feedback is required" })}
                            ></textarea>
                            {errors.CifComments && <div className="invalid-feedback fw-bold">{errors.CifComments.message}</div>}
                        </div>

                        {/* Suggestions */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">Suggestions (if Any)</label>
                            <textarea 
                                className="form-control"
                                rows={4}
                                placeholder="Any suggestions for us?"
                                {...register("suggestions")}
                            ></textarea>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary btn-lg fw-bold" 
                                    style={{ background: '#ff9219', border: 'none' }} 
                                    disabled={isLoading}>
                                {isLoading ? 'Please Wait...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}