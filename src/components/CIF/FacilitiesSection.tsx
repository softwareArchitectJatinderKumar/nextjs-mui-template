import React from 'react';
import Link from 'next/link';
import { Instrument } from '../../types/cif';
import styles from '@/styles/Facilities.module.css';

interface FacilitiesProps {
  instruments: Instrument[];
  isLoading?: boolean;
  error?: string;
}

const FacilitiesSection: React.FC<FacilitiesProps> = ({ instruments, isLoading, error }) => {
   const InstrumentData = [
  {
    id: 100000,
    instrumentName: "Electrochemical workstation, Metrohm: Multi-Channel",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1060204202_3_2025_100000_A.png",
    categoryId: 9,
    sampleExcelSheetUrl: "100000.xlsx"
  },
  {
    id: 100001,
    instrumentName: "Viscometer (LABMAN model of LMDV-200 with small sample adapter)",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_696381150_2_2025_100001_AD.png",
    categoryId: 12,
    sampleExcelSheetUrl: "100001.xlsx"
  },
  {
    id: 100002,
    instrumentName: "Density meter (Axis Density Meter with analytical balance)",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_382530855_2_2025_100002_De.png",
    categoryId: 10,
    sampleExcelSheetUrl: "100002.xlsx"
  },
  {
    id: 100003,
    instrumentName: "Refrigerated Centrifuge (Eppendorf 5804R)",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_259413724_2_2025_100003_Re.png",
    categoryId: 11,
    sampleExcelSheetUrl: "100003.xlsx"
  },
  {
    id: 100004,
    instrumentName: "Shimadzu UV-1800 UV-Vis",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1647089899_2_2025_100004_U.png",
    categoryId: null,
    sampleExcelSheetUrl: "100004.xlsx"
  },
  {
    id: 100005,
    instrumentName: "ICP-OES, PerkinElmer Optima 8000",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_323568347_3_2025_100005_IC.png",
    categoryId: null,
    sampleExcelSheetUrl: "100005.xlsx"
  },
  {
    id: 100006,
    instrumentName: "Field Emission Scanning Electron Microscope, FESEM JEOL",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_23899918_2_2025_100006_FE.png",
    categoryId: 1,
    sampleExcelSheetUrl: "100006.xlsx"
  },
  {
    id: 100007,
    instrumentName: "High Performance and Liquid Chromatography, Shimadzu",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_34620374_2_2025_100007_HP.png",
    categoryId: 8,
    sampleExcelSheetUrl: "100007.xlsx"
  },
  {
    id: 100008,
    instrumentName: "Gas Chromatography and Mass Spectroscopy, Shimadzu",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_2009182246_2_2025_100008_G.png",
    categoryId: 7,
    sampleExcelSheetUrl: "100008.xlsx"
  },
  {
    id: 100009,
    instrumentName: "Powder XRD (Bruker D8 Advance)",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_2005552723_2_2025_100009_Xi.png",
    categoryId: 2,
    sampleExcelSheetUrl: "100009.xlsx"
  },
  {
    id: 100010,
    instrumentName: "Particle size and Zeta potential analyzer (Malvern Zetasizer)",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_284316046_2_2025_100010_Pa.png",
    categoryId: 13,
    sampleExcelSheetUrl: "100010.xlsx"
  },
  {
    id: 100011,
    instrumentName: "Fluorescence Spectrometer (Perkin Elmer LS6500)",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1449097892_2_2025_100011_Fl.png",
    categoryId: 4,
    sampleExcelSheetUrl: "100011.xlsx"
  },
  {
    id: 100012,
    instrumentName: "Thermogravimetric analyzer (Perkin Elmer TGA 4000)",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_543001469_2_2025_100012_TG.png",
    categoryId: 5,
    sampleExcelSheetUrl: "100012.xlsx"
  },
  {
    id: 100013,
    instrumentName: "Differential scanning calorimeter (Perkin Elmer DSC 6000)",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1507892084_2_2025_100013_Di.png",
    categoryId: 6,
    sampleExcelSheetUrl: "100013.xlsx"
  },
  {
    id: 100014,
    instrumentName: "FTIR with Diamond ATR & Pellet accessories (Perkin Elmer)",
    imageUrl: "https://files.lpu.in/umsweb/CIFDocuments/Instrument_926534728_2_2025_100014_FTI.png",
    categoryId: 3,
    sampleExcelSheetUrl: "100014.xlsx"
  }
];

const  DataItems = [
        {
            "id": 1,
            "instrumentId": 0,
            "instrumentName": "Field Emission Scanning Electron Microscope, FESEM JEOL JSM-7610F-PLUS",
            "categoryId": 1,
            "isActive": true,
            "description": "The Jeol field emission scanning electron microscope is a versatile high resolution scanning electron microscope. This Machine combines two proven technologies – an electron column with semi-in-lens objective lens which can provide high resolution imaging by low accelerating voltage and an in-lens Schottky FEG which can provide stable large probe current – to deliver ultrahigh resolution with wide range of probe currents for all applications (A few pA to more than 200 nA). The in-lens Schottky FEG is a combination of a Schottky FEG and the first condenser lens and is designed to collect the electrons from the emitter efficiently. The Gentle Beam (GB) mode applies a negative voltage to a specimen and decelerates incident electrons just before they irradiate the specimen, thus the resolution is improved at an extremely low accelerating voltage. Therefore, this instrument is possible to observe a topmost surface by a few hundred eV which were difficult to observe conventionally and nonconductive samples \r\nsuch as ceramics and semiconductor etc. The High-Power Optics produces fine electron probe for both observation and analysis. The aperture angle control lens maintains a small probe diameter even at a larger probe current. Using both techniques, the machine is suitable for a wide variety of analysis with EDS.\r\nApart from giving the high resolution surface morphological images, this machine also has the analytical capabilities such as detecting the presence of elements down to boron (B) on any solid conducting materials through the energy dispersive X-ray spectrometry (EDX) providing crystalline information from the few nano meter depth of the material surface via electron back scattered detection (BSD) system attached with microscope. ",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_23899918_2_2025_100006_FESEM-Instrument.JPG"
        },
        {
            "id": 2,
            "instrumentId": 0,
            "instrumentName": "Powder XRD (Bruker D8 Advance)",
            "categoryId": 2,
            "isActive": true,
            "description": "This Bruker equipment benchmark when it comes to extracting structural information from X-Ray Powder Diffraction including Rietveld (TOPAS) analysis, \"total\" scattering (PDF analysis), and Small Angle X-Ray Scattering (SAXS). \r\n\r\nMonochromatic Ka1 radiation with Johansson monochromators for Co, Cu and Mo radiation Highest intensity with focusing Göbel mirrors for Cr, Co, Cu, Mo and Ag radiation.\r\nDynamic Beam Optimization\r\nDynamic Beam Optimization (DBO) provides best in class powder diffraction data by setting new benchmarks in terms of counting statistics and peak-to-background ratio, all without the need for manual instrument reconfiguration.\r\n\r\nThe high-speed energy-dispersive LYNXEYE XE-T detector uniquely combines fast data collection with unprecedented filtering of fluorescence and Kß radiation. Its proprietary Variable Active Detector Window and the Motorized Anti-Scatter Screen (MASS) enable data collection from lowest 2? angles without parasitic low-angle background scattering, in particular air scattering. The fully automated MASS retraction avoids beam cropping, even in combination with continuously variable slits that provide superb counting statistics over the whole angular range.\r\n•\tSuperb counting statistics allows for faster data collection and increased sample throughput\r\n•\tNo parasitic low-angle background scattering massively improves data quality of pharma, clay, zeolite and other samples having a large unit cell\r\n•\tBest peak-to-background enhances sensitivity for minor phases\r\n•\tFull quantification of crystalline and amorphous phases with DIFFRACTOPAS\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_2005552723_2_2025_100009_XRD-Instrument.JPG"
        },
        {
            "id": 3,
            "instrumentId": 0,
            "instrumentName": "FTIR with Diamond ATR & Pellet accessories (Perkin Elmer Spectrum 2)",
            "categoryId": 3,
            "isActive": true,
            "description": "In Infrared spectroscopy or vibrational spectroscopy is used to study the chemical composition of a sample. IR-radiations interact with the sample to produce infrared spectrum. Molecules with an overall electric dipole are when exposed to IR-radiation fluctuates the electromagnetic (EM) radiation. These fluctuations are the foot-prints of chemical compositions of the sample. Hence, to study the chemical composition of the sample the fluctuations of EM-radiations are recorded by the spectrophotometer. Fourier transform is employed to get the signal. Attenuated total reflection (ATR) is a sampling technique used in conjunction with infrared spectroscopy which enables samples to be examined directly in the solid or liquid state without further preparation. A unique humidity shield design protects Spectrum. Two from environmental effects allowing it to be used in more challenging environments, and with extended intervals between desiccant change to lower maintenance costs.\r\nAtmospheric Vapor Compensation (AVC) features an advanced digital filtering algorithm designated to subtract CO2 and H2O absorptions automatically in real time. The use of Sigma-Delta converters in the digitization of the FT-IR interferogram improves dynamic range, reduces spectral artifacts and increases ordinate linearity. Includes basic transmission functionality with optional fully integrated, robust universal sampling ensures trouble-free measurements.\r\nIt is equipped illuminated LCD display and user full set of extended special functions (i.e., counting of identical pieces, percentage indication, recipe making and many more) which are helpful during use of often repeated measurement activities. Further, RS232C connector allows for connecting computer, label printer or printer to print receipts, reports or weighing results archiving. Printed reports comply with requirements of GLP regulations. Procell software allows for direct transfer of weighing results to Excel spreadsheet\r\n\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_926534728_2_2025_100014_FTIR-Instrument.JPG"
        },
        {
            "id": 4,
            "instrumentId": 0,
            "instrumentName": "Fluorescence Spectrometer (Perkin Elmer LS6500)",
            "categoryId": 4,
            "isActive": true,
            "description": "Fluorescence spectrophotometry is a technique that analyze the state of sample (normally a biological system) by studying its interactions with fluorescent probe molecules. This interaction is monitored by measuring the changes in the fluorescent probe optical properties. The measurement of fluorescence signals provides a sensitive method of monitoring the biochemical environment of a fluorophore. Fluorophores are polyatomic fluorescent molecules. Instruments have been designed to measure fluorescence intensity, spectrum, lifetime and polarization. The apparatus is equipped with several advanced facilities that can be used for the measurement of a large range of samples. This can also be used measure to understand complex biological processes and enzyme inhibition mechanism. Dyes, LEDs, tracers, solar cells, and organic electroluminescent materials can be analyzed using this technique. \r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1449097689_2_2025_100011_Flourescence-Instrument.JPG"
        },
        {
            "id": 5,
            "instrumentId": 0,
            "instrumentName": "Thermogravimetric analyzer (Perkin Elmer TGA 4000)",
            "categoryId": 5,
            "isActive": true,
            "description": "\r\nThermogravimetric analysis is an equipment that measures the change in weight and hence mass of a sample with change in temperature. Mass of a sample changes due to various chemical or physical changes sensed by the equipment as thermal events. These chemical/physical changes or thermal evens may be desorption, absorption, sublimation, vaporization, oxidation, reduction and decomposition. The study is carried out by subjecting the sample over a range of temperature can be programmed using the software provided with the equipment.\r\nThe apparatus is equipped with large isothermal zone provides excellent temperature reproducibility. Apart from these rapid furnace cooling facilities using tap water and integral forced air are available that more samples can be studied in less time. A constant environment for the balance maintained by the balance purge gas. This purge gas protects the balance from the reactive sample purge gas as well as materials evolved by the sample. A microbalance is used to measure the change in weight of the sample. The equipment is provided with a corrosion resistant furnace.\r\nIntegrated mass flow controller extends applications flexibility; monitors and controls purge flow rates and allows switching between any two gases. \r\nFew important applications of TGA are listed below:\r\n•\tCompositional analysis\r\n•\tDecomposition temperatures\r\n•\tEngine oil volatility\r\n•\tFlammability studies\r\n•\tMeasurement of volatiles\r\n•\tOxidative and thermal stabilities\r\n•\tCatalyst and coking studies\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_543001469_2_2025_100012_TGA-Instrument.JPG"
        },
        {
            "id": 6,
            "instrumentId": 0,
            "instrumentName": "Differential scanning calorimeter (Perkin Elmer DSC 6000)",
            "categoryId": 6,
            "isActive": true,
            "description": "Differential Scanning Calorimetry is a thermal analysis technique that measures the exchange of heat energy of any material during a physical or chemical change at constant pressure. The equipment measures the thermal behavior of a sample with respect to an inert sample which does not undergo any change upon heating over the specified range of temperatures. Thermal analysis of the sample can be studied under a controlled heating rate of a very high precision in a wide range of temperatures. These measurements will be carried out under inert environment. Flowing nitrogen gas will be used to achieve inert atmosphere. Oxidative properties can also be studied in flowing oxygen or air environment. The equipment is single-furnace design and uses heat-flux measurement principle. The equipment uses thermocouple-based temperature sensors. It has optional UV photocalorimeter accessory as well.\r\nThe equipment can be used for several applications. A small list of applications are given below: \r\n•\tGlass transition temperature\r\n•\tMelting points\r\n•\tCrystallization time and temperatures\r\n•\tHeats of melting and crystallization\r\n•\tPercentage of crystallinity\r\n•\tOxidative stabilities\r\n•\tHeat capacity\r\n•\tPurities\r\n•\tThermal stabilities\r\n•\tPolymorphism\r\n•\tTo test the quality of a product\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1507892084_2_2025_100013_DSC-Instrument.JPG"
        },
        {
            "id": 9,
            "instrumentId": 0,
            "instrumentName": "Gas Chromatography and Mass Spectroscopy, Shimadzu GCMS TQ8040 NX",
            "categoryId": 7,
            "isActive": true,
            "description": "\r\nThe Gas Chromatograph - Mass Spectrometer, Shimadzu is Equipped with an ion source that features high sensitivity and long-term stability, and a high-efficiency collision cell, the system can provide sensitive, stable analyses over a long period of time. This device can be used for: \r\n•\tIn research and development, production, impurity profiling and quality control departments of pharmaceutical, chemical, agricultural, and biotechnological industries.\r\n•\tIn forensic toxicology to identify poisons and steroids in biological specimens.\r\n•\tIn detecting pollutants, metabolites in serum and fatty acid profiling in microbes.\r\n•\tFor the analysis of inorganic gases, aromatic solvents, detection of impurities and allergens in cosmetics.",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_2009182246_2_2025_100008_GCMS-Instrument.JPG"
        },
        {
            "id": 10,
            "instrumentId": 0,
            "instrumentName": "High Performance and Liquid Chromatography, Shimadzu Prominence LPGE",
            "categoryId": 8,
            "isActive": true,
            "description": "\r\n This Shimadzu equipment is used in the analysis of pharmaceutical, toxicological, environmental, and biological samples. \r\n\r\n•\tQualitative analysis - Separation of thermally unstable chemical and biological compounds, e.g., drugs, organic chemicals, herbal medicines and plant extracts.\r\n•\tQuantitative analysis - To determine the concentration of a compound in a sample by measuring the height and area of the peak.\r\n•\tTrace analysis – Analysis of compounds present in very low concentrations in a sample. \r\nRI detector (universal detector) - Any component that differs in refractive index from an elute can be detected despite its low sensitivity. difficult to observe conventionally and nonconductive samples such as ceramics and semiconductor etc.\r\nMultiple solvent delivery options, a broad range of flows, and isocratic or gradient elution. PDA and RI detector options to cover a range of sample chemistries. Expandable valving options from simple to complex flow paths.\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_34620374_2_2025_100007_HPLC-Instrument.JPG"
        },
        {
            "id": 11,
            "instrumentId": 0,
            "instrumentName": "Electrochemical workstation, Metrohm: Multi-Channel Autolab AUT.MAC.204",
            "categoryId": 9,
            "isActive": true,
            "description": "\r\nMetrohum is a multi-channel Potentiostat/galvanostat which is useful in electrochemical measurements. It is a multi-channel potentiostat/galvanostat based on the compact Autolab PGSTAT204. This machine can be controlled from up to three different computers simultaneously, allowing to share, the available channels among different users. Further, this instrument is connected with FRA32M - Impedance analyzer which can perform EIS measurements and comes with a powerful fit and simulation software for the analysis of impedance data. Hence addition of FRA32M in the main unit allows users to perform both potentiostatic and galvanostatic impedance measurements over a wide frequency range of 10 µHz to 32 MHz (limited to 1 MHz in combination with the Autolab PGSTAT). In addition to the classical EIS, the NOVA software also allows the users to modulate other outside signals such as rotation speed of a rotating disk electrode or the frequency of a light source to perform Electro-hydrodynamic or Photo-modulated impedance spectroscopy. Further, For high current applications, M204 module can be connected to a BOOSTER10A to increase the maximum current to 10 A and with its fast response time, the Autolab booster is able to perform electrochemical impedance measurements, in combination with the FRA32M module.\r\nThe in-house available features e.g., cyclic voltammetry, linear sweep voltammetry, chronoamperometry, impedance spectroscopy, charge discharge characteristics provide powerful techniques for understanding reaction kinetics, sensing materials, corrosion, energy conversion and storage studies etc.\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1060204202_3_2026_100000_ADP_2248.JPG"
        },
        {
            "id": 12,
            "instrumentId": 0,
            "instrumentName": "Density merer (Axis Density Meter with analytical balance ALN-220)",
            "categoryId": 10,
            "isActive": true,
            "description": "\r\nDensity Meter with analytical balance, Wensar MAB-220T is a mechanical tool which is used to determine the density of solids allowing efficient measuring object mass at immersion in a liquid. Weighing and density determining is done by balance equipped with HYDRO special function performing arithmetical calculations. The MAB-220T analytical balanced used for the density measurements is a very high precision analytical balance for weight measurement. This analytical balance has a calibration system with internal weight, which assures maintaining of measurements precision during operation without user’s intervention.\r\n\r\nIt is equipped illuminated LCD display and user full set of extended special functions (i.e., counting of identical pieces, percentage indication, recipe making and many more) which are helpful during use of often repeated measurement activities. Further, RS232C connector allows for connecting computer, label printer or printer to print receipts, reports or weighing results archiving. Printed reports comply with requirements of GLP regulations. Procell software allows for direct transfer of weighing results to Excel spreadsheet. \r\n\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_382530855_2_2025_100002_Density_Meter-Instrument.jpg"
        },
        {
            "id": 13,
            "instrumentId": 0,
            "instrumentName": "Refrigerated Centrifuge (Eppendorf  5804R)",
            "categoryId": 11,
            "isActive": true,
            "description": "\r\nRefrigerated Centrifuge is a high speed centrifuge for medium capacity needs. It allows for molecular applications in tubes up to 250 mL and offers additional swing–bucket and fixed–angle rotors as well as deep well plate capacity for increased versatility. Refrigerated Centrifuge is equipped with swing-bucket rotor A-4-44, 15/50 ml adapters and fixed-angle rotor F45-30-11 30 x 1.5/2 ml. A low temperature centrifuge is used to determine sedimentation velocity, shape and mass of macromolecules, separation of phases, isolate viruses, organelles, membranes and biomolecules such as DNA, RNA and lipoproteins. This can also be used for phase separation of nanomaterials\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_259413724_2_2025_100003_Refrigerated_Centirfuge-Instrument.JPG"
        },
        {
            "id": 14,
            "instrumentId": 0,
            "instrumentName": "Viscometer (LABMAN model of LMDV-200 with small sample adaptor low viscosity adaptor and software.)",
            "categoryId": 12,
            "isActive": true,
            "description": "\r\nThis Labman machine is Rotational Digital Direct Reading Viscometer to measure absolute viscosity of Newton Liquids as well apparent viscosity of non – Newton liquid featured by high flexibility reliable Test result, easy operation and good appearance. The Salient Features of the viscometer are auto range function, selectable speed direct viscosity reading and temperature display with big ultra-bright backlight LCD Display the High-Power Optics produces fine electron probe for both observation and analysis. The aperture angle control lens maintains a small probe diameter even at a larger probe current. Using both techniques, this machine is suitable for a wide variety of analysis with EDS. \r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_696381150_2_2025_100001_ADP_2298---.JPG"
        },
        {
            "id": 15,
            "instrumentId": 0,
            "instrumentName": "Particle size and Zeta potential analyzer (Malverrn Zetasizer Nano ZS90)",
            "categoryId": 13,
            "isActive": true,
            "description": "\r\n  Light scattering is a fundamental analytical technique for the characterization of particulate materials,\r\n  and is most commonly applied to colloidal systems, nanoparticles and macromolecules in solution or dispersion, \r\n  to determine particle size and Zeta Potential. Malvern Particle Size and\r\n  Zeta Potential Analyzer is used to measure particle and molecular size from less than a nanometre to several microns \r\n  using dynamic light scattering and Zeta Potential by using electrophoretic light scattering.\r\n  The particle size analyzer is the ideal tool for sub-micron analysis of size and zeta potential of dispersed particles of mineral, \r\n  chemical, ceramic, polymer, pharmaceutical and agricultural sciences. \r\n  The Zetasizer Nano ZS90 is the perfect lower cost solution when the ultimate in sizing sensitivity is not necessary, \r\n  or where identical results to a legacy system with 90° scattering optics is required. \r\n  • Zeta potential of colloids and nanoparticles using patented M3-PALS technology. \r\n  • A ‘Quality Factor’ and ‘Expert Advice System’ gives the confidence of having an expert at your shoulder.\r\n  • Research software option gives access to further features and analysis algorithms for the light scattering specialist. \r\n  • Automation of measurements using an auto titrator option. \r\n  ",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_284316046_2_2025_100010_Particle_Size-Instrument.JPG"
        },
        {
            "id": 21,
            "instrumentId": 0,
            "instrumentName": "Shimadzu UV-1800 UV-Vis",
            "categoryId": 14,
            "isActive": true,
            "description": "The UV-1800 is an advanced high-resolution (1-nm resolution in a compact double-beam instrument) spectrophotometer utilizing a precision Czerny-Turner optical system. The instrument is extremely versatile with full functionality from 190 nm to 1100 nm.  Operation can be either as a stand-alone instrument or as a PC-controlled instrument with the included UV Probe software. USB memory can be connected directly to the UV-1800 for simple data transfer.",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1208223655_17_2025_100004_-14-UV.JPG"
        },
        {
            "id": 22,
            "instrumentId": 0,
            "instrumentName": "ICP-OES, PerkinElmer Optima 8000",
            "categoryId": 15,
            "isActive": true,
            "description": "The Optima 8000 is a bench-top, dual-view ICP-OES with full-wavelength-range CCD array detector, delivering flexibility and excellent analytical performance. The Optima™ 8000 ICP-OES gains its outstanding analytical performance from its novel optical system, including a unique double monochromator, dual backside-illuminated charge-coupled device (DBI-CCD) detector, real-time Dynamic Wavelength Stabilization™, and automatic dual viewing of the plasma torch. \r\nKey benefit: \r\n- Superior quantum efficiency, for enhanced analytical performance and superior detection limits\r\n- Simultaneous background correction, further improving analytical accuracy and  detection limits\r\n- Dynamic wavelength stabilization, increasing analytical reproducibility and reliability\r\nICP-OES is a versatile method by which elemental analysis can be done effectively on a variety of test samples containing a complex matrix or having a high level of dissolved solids for different application e.g.,  water quality and safety, soil analysis, Environmental and agro-chemical analysis, food safety, pharmaceutical analysis, Chemical analysis, Metallurgy analysis,  Materials sciences.",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_323568347_3_2025_100005_ICP-OES-Instrument-21.jpg"
        },
        {
            "id": 23,
            "instrumentId": 0,
            "instrumentName": "Distilled Water (milli-Q water)",
            "categoryId": 0,
            "isActive": true,
            "description": null,
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_507378691_3_2025_100015_noImage.jpg"
        }
    ];
  // Handle empty or undefined instruments array
  const validInstruments = Array.isArray(instruments) && instruments.length > 0 ? instruments : DataItems;
 
  // Show loading spinner
  // if (isLoading) {
  //   return (
  //     <section className={styles.section + ' pb-5 ' + styles.bgDarkYellow}>
  //       <div className="container">
  //         <div className={`mb-4 mt-4 ${styles.headingWrapper}`}>
  //           <h2 className="fw-bold mb-0">Facilities</h2>
  //         </div>
  //         <div className="text-center py-5">
  //           <div className="spinner-border text-warning" role="status">
  //             <span className="visually-hidden">Loading...</span>
  //           </div>
  //           <p className="mt-2 text-muted">Loading facilities...</p>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  // Show error message
  if (error) {
    return (
      <section className={styles.section + ' pb-5 ' + styles.bgDarkYellow}>
        <div className="container">
          <div className={`mb-4 mt-4 ${styles.headingWrapper}`}>
            <h2 className="fw-bold mb-0">Facilities</h2>
          </div>
          <div className="alert alert-secondary d-flex align-items-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className={styles.section + ' pb-5 ' + styles.bgDarkYellow}>
      <div className="container">
        <div className={`mb-4 mt-4 ${styles.headingWrapper}`}>
          <h2 className="fw-bold mb-0">Facilities</h2>

          <div className={styles.callAction}>
            <Link href="/OurInstruments" className="link-btn">
              <img
                src="https://www.lpu.in/lpu-assets/images/icons/chevron-right.svg"
                alt="Know more"
              />
              Know more
            </Link>
          </div>
        </div>

        <p className="mb-4">
          CIF is equipped with sophisticated instruments to carry out spectral
          measurements, structure determination and chemical analysis. Click on
          the instrument name in the following table to view their description.
        </p>

        {/* Show message when no instruments available */}
        {validInstruments.length === 0 ? (
          <div className="alert alert-secondary" role="alert">
            <div className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-info-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              <div>
                No facilities available at the moment. Please check back later or contact support.
              </div>
            </div>
          </div>
        ) : (
          <div className={`${styles.InstrumentGrid} row`} id="instrumentGrid">
            {validInstruments.map((instrument) => (
              <div className={`${styles.instrumentBlock} g-col-lg-3 g-col-6 d-grid col-md-3`} key={instrument.id}>
                <div className={`${styles.imageSizes} mb-3`}>
                  <img
                    src={instrument.imageUrl || '/default-placeholder.png'}
                    alt={instrument.instrumentName}
                    className={`${styles.imageSizes} img-fluid`}
                  />
                </div>

                <Link
                  href={{
                    pathname: '/OurInstruments',
                    query: {
                      name: instrument.instrumentName,
                      id: instrument.id,
                      categoryId: instrument.categoryId,
                    },
                  }}
                  className={styles.instrumentLink}
                >
                  {instrument.instrumentName.slice(0, 40)}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FacilitiesSection;
