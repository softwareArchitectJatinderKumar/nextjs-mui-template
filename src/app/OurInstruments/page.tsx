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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [insts, allSpecs] = await Promise.all([
          instrumentService.getAllInstruments(),
          instrumentService.getSpecifications()
        ]);
        setData(insts);
        setSpecs(allSpecs);
      } finally {
        // setLoading(false);
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