"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import myAppWebService from '@/services/myAppWebService';
import Link from 'next/link';
import BookingDashboard from './BookingComponent';

function Bookings() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
      <BookingDashboard/>
    </>
  )
}

export default Bookings