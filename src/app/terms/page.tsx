"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import myAppWebService from '@/services/myAppWebService';
import Link from 'next/link';
import styles from '@/styles/TermsCondition.module.css';
import FacilitiesSection from '@/components/CIF/FacilitiesSection';
import EventsCarousel from '@/components/CIF/EventsSection';

interface Instrument {
  id: string | number;
  instrumentName: string;
  categoryId: string | number;
  imageUrl?: string;
}
export default function TermsandConditions() {
    const [loading, setLoading] = useState(true);
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
        const errorMessage = err?.message || err?.data?.message || 'Server issue. Please try again later.';
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

            {/* Error Alert */}
            {error && (
                <div className="container mt-3">
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        <div>
                            <strong>Error:</strong> {error}
                        </div>
                    </div>
                </div>
            )}

            <section className={styles.section + ' '}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className={styles.termsContainer}>
                                <div className={styles.termsHeader}>
                                    <h1>Our Terms and Conditions</h1>
                                </div>

                                <div className={styles.termsContent}>
                                    <h2>Introduction</h2>
                                    <p className={styles.introText}>
                                        Welcome to <strong>Lovely Professional University</strong>. These terms and conditions outline
                                        the rules and regulations for the use of Lovely Professional University's Website,
                                        located at <em>lpu.co.in</em>. By accessing this facility, we assume you accept these terms and conditions.
                                    </p>

                                    <p className={styles.undertakingHeading}>
                                        You specifically agree to all of the following undertakings:
                                    </p>

                                    <ul className={styles.termsList}>
                                        <li>
                                            We agree to acknowledge CIF, LPU in our publications and thesis if the results from
                                            CIF instrumentation are incorporated/used in them.
                                        </li>
                                        <li>
                                            I/We undertake to abide by the safety, standard sample preparation guidelines
                                            and precautions during testing of samples.
                                        </li>
                                        <li>
                                            I/We do understand the possibility of samples getting damaged during handling and analysis.
                                            I/We shall not claim for any loss/damage of the sample submitted to CIF.
                                        </li>
                                        <li>
                                            CIF, LPU reserves the rights to return the samples without performing analysis and will refund
                                            the analytical charges under special circumstances.
                                        </li>
                                        <li>
                                            I/we do agree to maintain the decorum during the visit in CIF labs and agree that CIF
                                            has full right to take action if functionality is disturbed.
                                        </li>
                                        <li>
                                            CIF shall not take any responsibility about the analysis, interpretation and publication
                                            of data acquired by the end user.
                                        </li>
                                        <li>
                                            I/We hereby declare that the results of the analysis will not be used for the
                                            settlement of any legal issue.
                                        </li>
                                    </ul>
                                </div>

                                {/* <div className={styles.footerLinks}>
                                    <div className="text-center mb-3">
                                        Don't have an account? <Link href="/register" className={styles.registerLink}>Create an Account</Link>
                                    </div>

                                    <div className="small text-center text-muted">
                                        By using this service, you agree with our
                                        <Link href="/terms" className="ms-1 text-decoration-none text-primary">Privacy Policy</Link>
                                    </div>
                                </div> */}

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FacilitiesSection instruments={instruments} />
            <EventsCarousel/>
        </>
    );
}