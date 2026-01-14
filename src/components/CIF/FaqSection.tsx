"use client";
import React, { useState } from 'react';
import styles from '@/styles/Instruments.module.css';

interface FAQ {
  question: string;
  answer: string;
}

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: 'Field Emission Scanning Electron Microscope (FE SEM)',
      answer: `<dl><dt><strong>Q1:</strong> How many samples can be submitted in a single request form?</dt><dd><strong>Ans:</strong> Maximum of 5 samples</dd><dt><strong>Q2:</strong> Does the Gold sputtering process affect the sample?</dt><dd><strong>Ans:</strong> No, the process only creates a very thin coating on the sample surface to enhance the conductivity for good imaging.</dd><dt><strong>Q3:</strong> What amount of sample is required for FESEM?</dt><dd><strong>Ans:</strong> Powder: Minimum of 2.5 to 5mg. Film: Maximum allowed size 1cm x 1cm.</dd><dt><strong>Q4:</strong> How will we come to know about the slot allocation?</dt><dd><strong>Ans:</strong> The concerned operator/office assistant will intimate you at least a week before your slot by calling you.</dd></dl>`
    },
    {
      question: 'UV-Vis Spectrophotometer',
      answer: `<dl><dt><strong>Q1:</strong> What wavelength range is used for your UV-Vis instrument?</dt><dd><strong>Ans:</strong> 200 nm to 800 nm</dd><dt><strong>Q2:</strong> Can I reuse the sample after the analysis for other experiments?</dt><dd><strong>Ans:</strong> Yes, if your sample is not UV sensitive you can reuse it. UV-Vis spectrometer analysis is a non-destructive method.</dd><dt><strong>Q3:</strong> Is it necessary to provide final dilution of sample for UV analysis?</dt><dd><strong>Ans:</strong> Yes, user must provide the sample in final diluted form.</dd></dl>`
    },
    {
      question: 'Thermogravimetric Analysis (TGA)',
      answer: `<dl><dt><strong>Q1:</strong> How much sample is required for TGA analysis?</dt><dd><strong>Ans:</strong> 5–8mg</dd><dt><strong>Q2:</strong> What is the normally used heating rate in TGA analysis?</dt><dd><strong>Ans:</strong> 10°C/Min</dd><dt><strong>Q3:</strong> Can we do TGA analysis of Liquid samples?</dt><dd><strong>Ans:</strong> No! TGA analysis can only be performed on Powder or Film samples.</dd><dt><strong>Q4:</strong> What is the maximum possible heating range of the TGA instrument available in CIF?</dt><dd><strong>Ans:</strong> 1000°C</dd></dl>`
    },
    {
      question: 'Differential Scanning Calorimeter (DSC)',
      answer: `<dl><dt><strong>Q1:</strong> How much sample is required for DSC analysis?</dt><dd><strong>Ans:</strong> 8–10mg</dd><dt><strong>Q2:</strong> Which gases are used for the analysis process?</dt><dd><strong>Ans:</strong> Nitrogen</dd><dt><strong>Q3:</strong> Which type of sample pan is used in DSC?</dt><dd><strong>Ans:</strong> Aluminium type</dd></dl>`
    },
    {
      question: 'Powder X-ray Diffractometer (XRD)',
      answer: `<dl><dt><strong>Q1:</strong> Can I use the sample after XRD analysis?</dt><dd><strong>Ans:</strong> Yes! XRD is non-destructive. The sample can be reused.</dd><dt><strong>Q2:</strong> I have an unknown mineral sample. Can I use XRD to identify it?</dt><dd><strong>Ans:</strong> Yes! XRD can identify crystal patterns or phases. For better results, run XRF first to know composition.</dd><dt><strong>Q3:</strong> Which databases are available?</dt><dd><strong>Ans:</strong> ICSD, PDF2 ICDD (JCPDS), Software: Highscore Plus</dd><dt><strong>Q4:</strong> What amount of sample is required?</dt><dd><strong>Ans:</strong> Powder: Minimum 400–500 mg</dd></dl>`
    },
    {
      question: 'FTIR Spectrometer',
      answer: `<dl><dt><strong>Q1:</strong> What type of samples can be analyzed?</dt><dd><strong>Ans:</strong> Powder and Liquid samples</dd><dt><strong>Q2:</strong> Can we analyze liquid samples?</dt><dd><strong>Ans:</strong> Yes</dd><dt><strong>Q3:</strong> In which ranges can we obtain IR spectra?</dt><dd><strong>Ans:</strong> 4000–400 cm-1</dd><dt><strong>Q4:</strong> How much sample is required?</dt><dd><strong>Ans:</strong> 5–10 mg</dd></dl>`
    },
    {
      question: 'Gas Chromatography with Mass Spectrometry (GC-MS/MS)',
      answer: `<dl><dt><strong>Q1:</strong> Can gas samples be analyzed?</dt><dd><strong>Ans:</strong> No, only solid and liquid samples</dd><dt><strong>Q2:</strong> Do I have to submit reference standards?</dt><dd><strong>Ans:</strong> Yes, required for quantitative analysis</dd><dt><strong>Q3:</strong> Are results provided with library comparison?</dt><dd><strong>Ans:</strong> Yes, NIST library comparison data is provided</dd><dt><strong>Q4:</strong> Can direct injection mass spectra be obtained?</dt><dd><strong>Ans:</strong> Yes, using MS/MS in CIF</dd></dl>`
    },
    {
      question: 'High Performance Liquid Chromatography (HPLC)',
      answer: `<dl><dt><strong>Q1:</strong> What is the minimum quantity required?</dt><dd><strong>Ans:</strong> Powder: 5–10 mg; Liquid: Minimum 2 ml final dilution</dd><dt><strong>Q2:</strong> Do I have to submit reference standards?</dt><dd><strong>Ans:</strong> Yes, required for quantitative analysis</dd><dt><strong>Q3:</strong> What detectors are available?</dt><dd><strong>Ans:</strong> PDA (Photo Diode Array), RID (Refractive Index Detector)</dd></dl>`
    },
    {
      question: 'Particle Size Analyser (Zetasizer Nano)',
      answer: `<dl><dt><strong>Q1:</strong> What are some specifications?</dt><dd><strong>Ans:</strong> Laser λ=633 nm, Temp 2°C–90°C</dd><dt><strong>Q2:</strong> What cuvettes are available?</dt><dd><strong>Ans:</strong> Quartz low volume, Disposable polystyrene, Folded capillary cuvettes</dd><dt><strong>Q3:</strong> What sample volume is needed?</dt><dd><strong>Ans:</strong> 1 ml (polystyrene), 0.75 ml (capillary), 12 μL (quartz)</dd><dt><strong>Q4:</strong> What is a good concentration?</dt><dd><strong>Ans:</strong> Depends on particle properties and polydispersity</dd></dl>`
    },
    {
      question: 'Fluorescence Spectrometer',
      answer: `<dl><dt><strong>Q1:</strong> What type of samples can be analyzed?</dt><dd><strong>Ans:</strong> Powder and Liquid</dd><dt><strong>Q2:</strong> How much sample is required?</dt><dd><strong>Ans:</strong> Powder: 200 mg; Liquid: 2 ml</dd><dt><strong>Q3:</strong> Do I need excitation/emission ranges?</dt><dd><strong>Ans:</strong> Yes, must be provided</dd><dt><strong>Q4:</strong> What if I don’t know the wavelength region?</dt><dd><strong>Ans:</strong> Run UV spectroscopy first; fluorescence follows UV peaks</dd></dl>`
    },
    {
      question: 'ICP-OES',
      answer: `<dl><dt><strong>Q1:</strong> Should I submit final dilution?</dt><dd><strong>Ans:</strong> Yes, only final diluted sample with digestion is accepted</dd><dt><strong>Q2:</strong> What is the minimum quantity required?</dt><dd><strong>Ans:</strong> 40–50 ml final dilution</dd><dt><strong>Q3:</strong> Do I need reference standards?</dt><dd><strong>Ans:</strong> Yes, required for quantitative analysis</dd></dl>`
    },
    {
      question: 'Electrochemical Workstation',
      answer: `<dl><dt><strong>Q1:</strong> What areas are covered?</dt><dd><strong>Ans:</strong> Supercapacitors, Batteries, Biosensors, Corrosion, Electrodepositions</dd><dt><strong>Q2:</strong> Do you provide photo-sensitive measurements?</dt><dd><strong>Ans:</strong> No, light source not available</dd><dt><strong>Q3:</strong> Which electrodes are provided?</dt><dd><strong>Ans:</strong> Ag/AgCl, Platinum wire, Glass carbon, Carbon electrodes</dd><dt><strong>Q4:</strong> Do I need to provide parameters?</dt><dd><strong>Ans:</strong> Yes, must be provided</dd><dt><strong>Q5:</strong> Do you prepare working electrodes?</dt><dd><strong>Ans:</strong> Normally provided by user; may be prepared with extra charges</dd><dt><strong>Q6:</strong> Can I reuse samples?</dt><dd><strong>Ans:</strong> Depends case by case; ask operator</dd></dl>`
    },
    {
      question: 'Viscometer',
      answer: `<dl><dt><strong>Q1:</strong> Can I analyse solid samples?</dt><dd><strong>Ans:</strong> No, only liquids (free-flowing or slightly viscous)</dd><dt><strong>Q2:</strong> Can I analyse liquid samples at high temperature?</dt><dd><strong>Ans:</strong> No, only ambient temperature</dd><dt><strong>Q3:</strong> How much sample is required?</dt><dd><strong>Ans:</strong> At least 40–50 ml liquid</dd></dl>`
    }
  ];

  return (
    <section className={styles.section + " py-5"}>
      <div className="container">
        <div className={styles.headingWrapper + " mb-4 border-bottom pb-2"}>
          <div className={styles.mainHead}>
            <h2 className="fw-bold" style={{ color: '#ef7d00' }}>Instrument FAQs</h2>
          </div>
        </div>

        <div className={styles.accordion}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={styles.accordionItem}>
                <div
                  className={`${styles.accordionHeader} ${isOpen ? styles.activeHeader : ''}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="fw-bold">{faq.question}</span>
                  <span className={styles.accordionIcon}>
                    {isOpen ? '-' : '+'}
                  </span>
                </div>

                <div className={`${styles.accordionCollapse} ${isOpen ? styles.show : ''}`}>
                  <div
                    className={styles.accordionContent}
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;