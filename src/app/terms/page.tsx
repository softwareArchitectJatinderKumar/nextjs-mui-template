"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import myAppWebService from '@/services/myAppWebService';
import Link from 'next/link';
import styles from '@/styles/TermsCondition.module.css';
import FacilitiesSection from '@/components/CIF/FacilitiesSection';
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
      } catch (err) {
        console.error('Error fetching instruments:', err);
        setError('Failed to load instruments');
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

                                <div className={styles.footerLinks}>
                                    <div className="text-center mb-3">
                                        Don't have an account? <Link href="/register" className={styles.registerLink}>Create an Account</Link>
                                    </div>

                                    <div className="small text-center text-muted">
                                        By using this service, you agree with our
                                        <Link href="/terms" className="ms-1 text-decoration-none text-primary">Privacy Policy</Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FacilitiesSection instruments={instruments} />
        </>
    );
}