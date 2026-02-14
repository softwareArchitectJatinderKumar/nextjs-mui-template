'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import myAppWebService from '@/services/myAppWebService';
import styles from '../styles/homePage.module.css';
import Eventsstyles from '@/styles/EventsCard.module.css';
import HeroSection from '@/components/CIF/HeroSection';
import FacilitiesSection from '@/components/CIF/FacilitiesSection';
import EventsSection from '@/components/CIF/EventsSection';

interface Instrument {
  id: string | number;
  instrumentName: string;
  categoryId: string | number;
  imageUrl?: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await myAppWebService.getAllInstruments();
        const data = response.item1 || response.data || response;
        setInstruments(Array.isArray(data) ? data : []);
        setError(''); // Clear any previous errors
      } catch (err: any) {
        console.error('Error fetching instruments:', err);
        // Show user-friendly error message
        const errorMessage = 'Server issue. Please try again later.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstruments();
  }, []);

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

      {/* Error Alert - Show inline instead of blocking page */}
      {error && (
        <div className="container mt-3">
          <div className="alert alert-secondary d-flex align-items-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      )}
      
      <HeroSection />
      <FacilitiesSection instruments={instruments} />

      <EventsSection />
      {/* <EventsSection styles={Eventsstyles} /> */}
      
      
    </>
  );
}
