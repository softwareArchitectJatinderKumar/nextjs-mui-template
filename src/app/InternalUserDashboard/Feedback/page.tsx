"use client";

import React, { useState } from 'react';
import FeedbackForm from '@/components/CIF/FeedbackForm';
import { instrumentService } from '@/services/instrumentService';

import swal from 'sweetalert2';
import Cookies from 'js-cookie';
import myAppWebService from '@/services/myAppWebService';

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


        const response = await myAppWebService.NewCifFeedback(payload);
        
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
