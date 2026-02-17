"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { instrumentService } from '@/services/instrumentService';
import InstrumentGrid from '@/components/CIF/InstrumentGrid';
import InstrumentDetails from '@/components/CIF/InstrumentDetails';
import ChargesModal from '@/components/CIF/ChargesModal';
import FaqSection from '@/components/CIF/FaqSection';
import styles from '@/styles/Instruments.module.css';
import FacilitiesSection from '@/components/CIF/FacilitiesSection';
import { Link } from 'lucide-react';

function InstrumentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const name = searchParams.get('name');
  const id = searchParams.get('id');
  const catId = searchParams.get('categoryId');

  const [data, setData] = useState<any[]>([]);
  const [specs, setSpecs] = useState<any[]>([]);
  const [charges, setCharges] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [insts, allSpecs] = await Promise.all([
          instrumentService.getAllInstruments(),
          instrumentService.getSpecifications()
        ]);
        setData(Array.isArray(insts) ? insts : []);
        setSpecs(Array.isArray(allSpecs) ? allSpecs : []);
        setError('');
      } catch (err: any) {
        console.error('Error fetching instruments:', err);
        setError('Failed to load instruments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSelect = (categoryId: number, instrumentId: number) => {
    router.push(`/OurInstruments?id=${instrumentId}&categoryId=${categoryId}`, { scroll: false });
  };

  const handleViewCharges = async () => {
    if (!id) return;
    try {
      const response = await instrumentService.getCharges(Number(id));
      setCharges(response);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching charges:", error);
    }
  };

  const selectedInstrument = data.find(ins => ins.id === Number(id));
  const filteredSpecs = specs.filter(s => s.categoryId === Number(catId));

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

      <main>
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
        <section className={styles.section + " py-5"}>
          <div className="container">
            <InstrumentGrid
              instruments={data}
              selectedId={id ? Number(id) : null}
              onSelect={handleSelect}
            />
          </div>
        </section>

        {selectedInstrument && (
          <InstrumentDetails
            instrument={selectedInstrument}
            specs={filteredSpecs}
            onViewCharges={handleViewCharges}
          />
        )}

        <FaqSection />

        {showModal && (
          <ChargesModal
            charges={charges}
            onClose={() => setShowModal(false)}
          />
        )}
      </main>
    </>
  );
}

export default function OurInstrumentsPage() {
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <InstrumentsContent />
    </Suspense>
  );
}