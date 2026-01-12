import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { instrumentService } from '../../services/instrumentService';
import { Instrument, Specification } from '../../types/instruments';

import AboutSection from '../../components/CIF/AboutSection';
import InstrumentGrid from '../../components/CIF/InstrumentGrid';
import InstrumentDetails from '../../components/CIF/InstrumentDetails';
import FaqSection  from '@/components/CIF/FaqSection';
// import Faq from '../../components/CIF/FaqSection';

const OurInstrumentsPage: React.FC = () => {
  const router = useRouter();
  const { id, categoryId } = router.query;

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [allSpecs, setAllSpecs] = useState<Specification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPage = async () => {
      try {
        const [instList, specList] = await Promise.all([
          instrumentService.getAllInstruments(),
          instrumentService.getSpecifications()
        ]);
        setInstruments(instList);
        setAllSpecs(specList);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, []);

  const handleSelect = (catId: number, instId: number) => {
    router.push(`/OurInstruments?id=${instId}&categoryId=${catId}`, undefined, { shallow: true });
  };

  if (loading) return <div>Loading...</div>;

  const selectedInstrument = instruments.find(ins => ins.id === Number(id));
  const filteredSpecs = allSpecs.filter(s => s.categoryId === Number(categoryId));

  return (
    <>
      {/* SECTION 1 & 2: About and Selection (Always visible) */}
      <AboutSection />
      <InstrumentGrid 
        instruments={instruments} 
        selectedId={Number(id)} 
        onSelect={handleSelect} 
      />

      {/* SECTION 3: Specific details (Visible only if params are present) */}
      {/* {selectedInstrument && (
        <InstrumentDetails 
          instrument={selectedInstrument} 
          specs={filteredSpecs} 
        />
      )} */}

      {/* SECTION 4: FAQs (Always visible) */}
      <FaqSection  />
    </>
  );
};

export default OurInstrumentsPage;