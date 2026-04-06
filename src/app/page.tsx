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
        const data = response?.item1 || response?.data || response;
        // Only set instruments if we have valid array data, otherwise keep empty to trigger fallback
        if (Array.isArray(data) && data.length > 0) {
          setInstruments(data);
        }
        setError(''); // Clear any previous errors
      } catch (err: any) {
        console.error('Error fetching instruments:', err);
        // Don't set error message - just let the static data show as fallback
        // This ensures user always sees instrument data
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
      
      <HeroSection />
      <FacilitiesSection 
        instruments={instruments} 
        isLoading={isLoading}
        error={error}
      />

      <EventsSection />
      {/* <EventsSection styles={Eventsstyles} /> */}
      
      
    </>
  );
}
