'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import myAppWebService from '@/services/myAppWebService';
import styles from '../styles/homePage.module.css';
import Eventsstyles from '@/styles/EventsCard.module.css';
import HeroSection from '@/components/CIF/HeroSection';
import FacilitiesSection from '@/components/CIF/FacilitiesSection';
import PartnersSection from '@/components/CIF/PartnersAndEvents';
import ResourcesSection from '@/components/CIF/ResourcesSection';
import EventsSection from '@/components/CIF/EventsSection';
import ContactSection from '@/components/CIF/ContactSection';

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
      } catch (err) {
        console.error('Error fetching instruments:', err);
        setError('Failed to load instruments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstruments();
  }, []);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
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
      
      <FacilitiesSection instruments={instruments} />

      <EventsSection styles={Eventsstyles} />
      {/* <PartnersSection />

      <ResourcesSection />

      <ContactSection /> */}

      {/* <section className="section industry-partners-grid d-none">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <h2>In Collaboration with</h2>
              <p>The Center of Excellence facilitates research and exchange of ideas.</p>
            </div>
            <div className="col-md-8">
              <div className="row g-3">
                {['brunker', 'jeol', 'malvern', 'shimadzu', 'perkin', 'metrohm'].map((logo) => (
                  <div className="col-4 col-md-2" key={logo}>
                    <img src={`https://www.lpu.in/lpu-assets/images/cif/logo/${logo}.png`} alt={logo} className="img-fluid" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} section-gray`}>
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <h2 className="fw-bold">Research and <br />Development Cell</h2>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.9996 15.4817V17.5893C19.0004 17.7849..." // Truncated for brevity
                    stroke="#EF7D00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
                <a href="tel:+911824444021" className="text-decoration-none">+91 1824-444021</a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2">
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                  <g clipPath="url(#clip0_4273_280)">
                    <path d="M16 0.523438L7.95831 6.52344L0 0.523438" stroke="#EF7D00" strokeWidth="1.5" />
                  </g>
                </svg>
                <a href="mailto:cif@lpu.co.in" className="text-decoration-none">cif@lpu.co.in</a>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}
