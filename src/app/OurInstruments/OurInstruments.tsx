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

  // Static fallback data when API returns no data
  const InstrumentData: Instrument[] = [
    {
      id: 100000,
      instrumentName: "Electrochemical workstation, Metrohm: Multi-Channel",
      imageUrl: "/images/instruments/Instrument_1060204202_3_2025_100000_A.png",
      categoryId: 9,
      description: "Electrochemical workstation for multi-channel measurements",
      isActive: true
    },
    {
      id: 100001,
      instrumentName: "Viscometer (LABMAN model of LMDV-200 with small sample adapter)",
      imageUrl: "/images/instruments/Instrument_696381150_2_2025_100001_AD.png",
      categoryId: 12,
      description: "High-precision viscometer for various samples",
      isActive: true
    },
    {
      id: 100002,
      instrumentName: "Density meter (Axis Density Meter with analytical balance)",
      imageUrl: "/images/instruments/Instrument_382530855_2_2025_100002_De.png",
      categoryId: 10,
      description: "Precise density measurement instrument",
      isActive: true
    },
    {
      id: 100003,
      instrumentName: "Refrigerated Centrifuge (Eppendorf 5804R)",
      imageUrl: "/images/instruments/Instrument_259413724_2_2025_100003_Re.png",
      categoryId: 11,
      description: "High-speed refrigerated centrifuge",
      isActive: true
    },
    {
      id: 100004,
      instrumentName: "Shimadzu UV-1800 UV-Vis",
      imageUrl: "/images/instruments/Instrument_1647089899_2_2025_100004_U.png",
      categoryId: 1,
      description: "UV-Visible spectrophotometer",
      isActive: true
    },
    {
      id: 100005,
      instrumentName: "ICP-OES, PerkinElmer Optima 8000",
      imageUrl: "/images/instruments/Instrument_323568347_3_2025_100005_IC.png",
      categoryId: 2,
      description: "Inductively Coupled Plasma Optical Emission Spectrometer",
      isActive: true
    },
    {
      id: 100006,
      instrumentName: "Field Emission Scanning Electron Microscope, FESEM JEOL",
      imageUrl: "/images/instruments/Instrument_23899918_2_2025_100006_FE.png",
      categoryId: 3,
      description: "High-resolution field emission scanning electron microscope",
      isActive: true
    },
    {
      id: 100007,
      instrumentName: "High Performance and Liquid Chromatography, Shimadzu",
      imageUrl: "/images/instruments/Instrument_34620374_2_2025_100007_HP.png",
      categoryId: 4,
      description: "High performance liquid chromatograph",
      isActive: true
    },
    {
      id: 100008,
      instrumentName: "Gas Chromatography and Mass Spectroscopy, Shimadzu",
      imageUrl: "/images/instruments/Instrument_2009182246_2_2025_100008_G.png",
      categoryId: 5,
      description: "GC-MS system for qualitative and quantitative analysis",
      isActive: true
    },
    {
      id: 100009,
      instrumentName: "Powder XRD (Bruker D8 Advance)",
      imageUrl: "/images/instruments/Instrument_2005552723_2_2025_100009_Xi.png",
      categoryId: 6,
      description: "X-ray diffractometer for powder analysis",
      isActive: true
    },
    {
      id: 100010,
      instrumentName: "Particle size and Zeta potential analyzer (Malvern Zetasizer)",
      imageUrl: "/images/instruments/Instrument_284316046_2_2025_100010_Pa.png",
      categoryId: 7,
      description: "Particle size and zeta potential analyzer",
      isActive: true
    },
    {
      id: 100011,
      instrumentName: "Fluorescence Spectrometer (Perkin Elmer LS6500)",
      imageUrl: "/images/instruments/Instrument_1449097892_2_2025_100011_Fl.png",
      categoryId: 8,
      description: "Multi-purpose fluorescence spectrometer",
      isActive: true
    },
    {
      id: 100012,
      instrumentName: "Thermogravimetric analyzer (Perkin Elmer TGA 4000)",
      imageUrl: "/images/instruments/Instrument_543001469_2_2025_100012_TG.png",
      categoryId: 9,
      description: "TGA for thermal analysis",
      isActive: true
    },
    {
      id: 100013,
      instrumentName: "Differential scanning calorimeter (Perkin Elmer DSC 6000)",
      imageUrl: "/images/instruments/Instrument_1507892084_2_2025_100013_Di.png",
      categoryId: 10,
      description: "High-sensitivity DSC",
      isActive: true
    },
    {
      id: 100014,
      instrumentName: "FTIR with Diamond ATR & Pellet accessories (Perkin Elmer)",
      imageUrl: "/images/instruments/Instrument_926534728_2_2025_100014_FTI.png",
      categoryId: 11,
      description: "Fourier Transform Infrared Spectrometer",
      isActive: true
    }
  ];

  const [instruments, setInstruments] = useState<Instrument[]>(InstrumentData);
  const [allSpecs, setAllSpecs] = useState<Specification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPage = async () => {
      try {
        const [instList, specList] = await Promise.all([
          instrumentService.getAllInstruments(),
          instrumentService.getSpecifications()
        ]);
        // Only update state if we have valid data with items
        if (Array.isArray(instList) && instList.length > 0) {
          setInstruments(instList);
        }
        if (Array.isArray(specList) && specList.length > 0) {
          setAllSpecs(specList);
        }
      } catch (err) {
        console.error('Error fetching instruments:', err);
        // Keep using static InstrumentData as fallback
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