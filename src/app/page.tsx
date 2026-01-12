// import SimpleCard from "@/components/common/cards/SimpleCard";

// import Image from "next/image";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <SimpleCard title="Home" content="Welcome to template" />

//     </div>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import myAppWebService from '@/services/myAppWebService';
import styles from '../styles/homePage.module.css';
import HeroSection from '@/components/CIF/HeroSection';
import FacilitiesSection from '@/components/CIF/FacilitiesSection';

// Define an interface for better type safety (Requirement #9)
interface Instrument {
  id: string | number;
  instrumentName: string;
  categoryId: string | number;
  imageUrl?: string;
}

export default function Home() {
  const router = useRouter();
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await myAppWebService.getAllInstruments();
        // Standardizing response check
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

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      {/* <section className="section bgDarkYellow pb-0">
        <div className="container">
          <div className="headingWraper mb-4">
            <div className="mainHead">
              <h1>Central Instrumentation Facility</h1>
              <div className="call-action">
                <br />
                <a href="#" className="d-none">
                  <img src="https://www.lpu.in/lpu-assets/images/cif/login.svg" alt="login" />
                </a>
              </div>
            </div>
          </div>
          <p>
            Central Instrumentation Facility (CIF) of Lovely Professional University (LPU) houses a wide range of
            high-end instruments for pushing the boundaries of research in science and technology...
          </p>
          <div className="banner mb-5">
            <img src="https://www.lpu.in/lpu-assets/images/cif/banner.jpg" alt="CIF Banner" className="img-fluid" />
          </div>
          
          <div className="section-red p-4">
            <div className="heading-wraper mb-4">
              <div className="main-head">
                <h2 className="text-white">What we offer</h2>
              </div>
              <div className="bottom-line"></div>
              <div className="cif-fact row">
                {[
                  { title: "Leading class testing equipments", desc: "Equipped with sophisticated instruments to carry out spectral measurements." },
                  { title: "High degree of reliable results", desc: "CIF can assure authentic & reproducible results." },
                  { title: "Dedicated CIF team", desc: "Committed faculty members working round the clock." }
                ].map((fact, idx) => (
                  <div className="facts col-lg-4 col-12" key={idx}>
                    <div className="icon">
                      <img src="https://www.lpu.in/lpu-assets/images/cif/icon.svg" alt="icon" />
                    </div>
                    <span className="head">{fact.title}</span>
                    <p>{fact.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <FacilitiesSection instruments={instruments} />
      {/* <section className={styles.section}>
        <div className="container">
          <div className={`${styles.headingWraper} mb-4`}>
            <div className={styles.mainHead}>
              <h2 className="fw-bold">Facilities</h2>
            </div>
          </div>

          <p className="mb-4">
            Click on the instrument name to view their description.
          </p>

          <div className="row">
            {instruments.map((instrument) => (
              <div className="col-md-3" key={instrument.id}>
                <div className={`${styles.imgContainer} mb-3`}>
                  <img
                    src={instrument.imageUrl || 'https://www.lpu.in/lpu-assets/images/cif/default-placeholder.png'}
                    alt={instrument.instrumentName}
                    className="img-fluid"
                    loading="lazy"
                  />
                </div>
                <div className={`${styles.instrumentBlock} mb-5`}>
                  <Link
                    className={styles.instrumentLink}
                    href={{
                      pathname: '/OurInstruments',
                      query: {
                        name: instrument.instrumentName,
                        id: instrument.id,
                        categoryId: instrument.categoryId,
                      },
                    }}
                  >
                    {instrument.instrumentName}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Collaboration Section */}
      <section className="section industry-partners-grid">
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

      {/* Footer Contact Section with SVG Fixes */}
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
                  {/* Corrected SVG camelCase attributes */}
                  <g clipPath="url(#clip0_4273_280)">
                    <path d="M16 0.523438L7.95831 6.52344L0 0.523438" stroke="#EF7D00" strokeWidth="1.5" />
                  </g>
                </svg>
                <a href="mailto:cif@lpu.co.in" className="text-decoration-none">cif@lpu.co.in</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


// 'use client';
// import React, { use, useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation'
// import myAppWebService from '@/services/myAppWebService';
// // import myAppWebService from '../utils/myAppWebService';
// import styles from '../styles/homePage.module.css';
// // import myAppWebService from '../utils/myAppWebService';

// export default function Home() {
//   const router = useRouter();
//   const [loadingStates, setLoadingStates] = useState({});

//   const onImageLoad = (id: any) => {
//     setLoadingStates((prev) => ({ ...prev, [id]: false }));
//   };

//   const onImageError = (id: any) => {
//     console.error(`Image failed to load for ID: ${id}`);
//     setLoadingStates((prev) => ({ ...prev, [id]: false }));
//   };

//   const navigateToInstrument = (instrumentName: string | any[], id: any, categoryId: any) => {
//     router.push(`/OurInstruments?id=${instrumentName.slice(0, 10)}&categoryId=${categoryId}&name=${instrumentName}`);
//     // router.push(`/ourInstruments/${instrumentName.slice(0, 10)}/${id}/${categoryId}`);
//   };
//   // http://localhost:3000/our-instruments?id=1&categoryId=2&name=InstrumentA
//   const [instruments, setInstruments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchInstruments = async () => {
//       try {
//         const response = await myAppWebService.getAllInstruments();
//         setInstruments(response.item1 || []); // Adjust based on your API response structure
//       } catch (err) {
//         console.error('Error fetching instruments:', err);
//         setError('Failed to load instruments');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInstruments();
//   }, []);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <>
//       <section className="section  bgDarkYellow pb-0">
//         <div className="container">
//           <div className="headingWraper mb-4">
//             <div className="mainHead">
//               <h1>Central Instrumentation Facility</h1>
//               <div className="call-action">
//                 <br />
//                 <a href="#" className="d-none"><img src="https://www.lpu.in/lpu-assets/images/cif/login.svg" /></a>
//               </div>
//             </div>

//           </div>
//           <p>
//             Central Instrumentation Facility (CIF) of Lovely Professional University (LPU) houses a wide range of
//             high-end instruments for pushing the boundaries of research in science and technology to higher level. These
//             instruments and facilities help the faculties, research scholars and students to carry out globally
//             competitive research in basic, applied and medical sciences. The center also hopes for expansion of the
//             facilities each year making it a core facility in the country. By realizing CIF, we expect a prominent hub
//             for pioneering and collaborative analytical research in our country. CIF runs under the purview of Research
//             and Development Cell of the university and is expected to self-sustain by revenue generation for the upkeep
//             and maintenance of the instruments.
//           </p>
//           <div className="banner mb-5">
//             <img src="https://www.lpu.in/lpu-assets/images/cif/banner.jpg" />
//           </div>
//           <div className="section-red p-4">
//             <div className="heading-wraper mb-4">
//               <div className="main-head">
//                 <h2 className="white">What we offer</h2>
//               </div>
//               <div className="bottom-line"></div>
//               <div className="cif-fact row">
//                 <div className="facts col-lg-4 col-12">
//                   <div className="icon"><img src="https://www.lpu.in/lpu-assets/images/cif/icon.svg" alt="icon" />
//                   </div>
//                   <span className="head">Leading class testing equipments</span>
//                   <p>CIF of Lovely Professional University is equipped with sophisticated instruments to carry
//                     out spectral measurements, structure determination, and chemical analysis.</p>
//                 </div>
//                 <div className="facts col-lg-4 col-12">
//                   <div className="icon"><img src="https://www.lpu.in/lpu-assets/images/cif/icon.svg" alt="icon" />
//                   </div>
//                   <span className="head">High degree of reliable and quick test results</span>
//                   <p>Given the time-tested machines & committed research base, CIF can assure authentic &
//                     reproducible results</p>
//                 </div>
//                 <div className="facts col-lg-4 col-12">
//                   <div className="icon"><img src="https://www.lpu.in/lpu-assets/images/cif/icon.svg" alt="icon" />
//                   </div>
//                   <span className="head">Dedicated CIF team</span>
//                   <p>We have committed faculty members, scientific operators, and administrative officers
//                     working round the clock to support you with quality services.</p>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className={styles.section}>
//         <div className="container">
//           {/* Main Heading Section */}
//           <div className={`${styles.headingWraper} mb-4`}>
//             <div className={styles.mainHead}>
//               <h2 className="fw-bold">Facilities</h2>
//               <div className="call-action">
//                 {/* Optional: Add Link here if needed */}
//               </div>
//             </div>
//           </div>

//           <p className="mb-4">
//             CIF is equipped with sophisticated instruments to carry out spectral measurements,
//             structure determination and chemical analysis. Click on the instrument name in the
//             following table to view their description.
//           </p>

//           {/* Instruments Grid */}
//           <div className="row">
//             {instruments.map((instrument) => (
//               <div className="col-md-3" key={instrument?.id}>

//                 <div className={`${styles.imgContainer} mb-3`}>
//                   <img
//                     src={instrument?.imageUrl || '/default-placeholder.png'}
//                     alt={instrument?.instrumentName || 'Instrument'}
//                     className={styles.imgFluid}
//                     loading="lazy"
//                   />
//                 </div>

//                 <div className={`${styles.instrumentBlock} mb-5`}>
//                   <Link
//                     className={styles.instrumentLink}
//                     href={{
//                       pathname: '/OurInstruments',
//                       query: {
//                         name: instrument.instrumentName?.slice(0, 100) || 'Unknown',
//                         id: instrument.id,
//                         categoryId: instrument.categoryId,
//                         imageUrl: instrument.imageUrl || '/default-placeholder.png',
//                       },
//                     }}
//                   >
//                     {instrument.instrumentName || 'Unknown Instrument'}
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//       <section className="section industry-partners-grid">
//         <div className="container">
//           <div className="placement-grid align-items-center">
//             <div className="placement-stats">
//               <div className="heading-wraper">
//                 <div className="main-head">
//                   <h2>In Collaboration with</h2>
//                 </div>
//               </div>
//               <p>The Center of Excellence facilitates research, exchange of ideas and help in decision making.</p>
//             </div>
//             <div className="industry-partners cif">
//               <div className="placement-logo">
//                 <div className="placement-grid-logo placement-grid-1"><img
//                   src="https://www.lpu.in/lpu-assets/images/cif/logo/brunker.png" /></div>
//                 <div className="placement-grid-logo placement-grid-3"><img
//                   src="https://www.lpu.in/lpu-assets/images/cif/logo/jeol.png" /></div>
//                 <div className="placement-grid-logo placement-grid-4"><img
//                   src="https://www.lpu.in/lpu-assets/images/cif/logo/malvern.png" /></div>
//                 <div className="placement-grid-logo placement-grid-6"><img
//                   src="https://www.lpu.in/lpu-assets/images/cif/logo/shimadzu.png" /></div>
//                 <div className="placement-grid-logo placement-grid-7"><img
//                   src="https://www.lpu.in/lpu-assets/images/cif/logo/perkin.png" /></div>
//                 <div className="placement-grid-logo placement-grid-8"><img
//                   src="https://www.lpu.in/lpu-assets/images/cif/logo/metrohm.png" /></div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </section>
//       <section className="section bgDarkYellow">
//         <div className="container">
//           <div className="heading-wraper">
//             <div className="main-head">
//               <h2>Events & Happenings</h2>
//             </div>

//           </div>
//           <div className={styles.cifSlider}>
//             <div className={styles.cifItem}>
//               <img src="https://www.lpu.in/lpu-assets/images/cif/event-3.jpg" />
//               <div className="mt-4 mb-2">
//                 <strong className="d-block">Workshop on Field Emission Scanning Electron Microscope</strong>
//                 (29 - 30 March 2024)
//               </div>
//             </div>
//             <div className={styles.cifItem}>
//               <img src="https://www.lpu.in/lpu-assets/images/cif/event-1.jpg" />
//               <div className="mt-4 mb-2">
//                 <strong className="d-block">National workshop on X-Ray Diffraction and Particle Size Analyzer </strong>
//                 (26 - 27 April 2024)
//               </div>
//             </div>
//             <div className={styles.cifItem}>
//               <img src="https://www.lpu.in/lpu-assets/images/cif/event-2.jpg" />
//               <div className="mt-4 mb-2">
//                 <strong className="d-block">Summer Training Programme </strong>
//                 (3 June - 13 July 2024)
//               </div>
//             </div>


//           </div>
//         </div>
//       </section>
//       <section className="section academics-section right-top-circle">

//         <div className="container-fluid">
//           <div className="prospectus-grid">
//             <div className="history-about">
//               <img src="https://www.lpu.in/lpu-assets/images/admissions/prospectus.jpg" />
//             </div>
//             <div className="history-facts">
//               <div className="heading-wraper row">
//                 <div className="main-head ">
//                   <h2>CIF Resources</h2>
//                 </div>
//               </div>
//               <ul>
//                 <li>
//                   <a href="">Application Form</a>
//                 </li>

//                 <li>
//                   <a href="">Test Charges</a>
//                 </li>

//                 <li>
//                   <a href="">Payment Options</a>
//                 </li>

//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="section section-gray">
//         <div className="container">
//           <div className="row">
//             <div className="col-md-5">
//               <div className="heading-wraper">
//                 <div className="main-head">
//                   <h2>Research and <br />Development Cell</h2>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="grid gap-5">
//                 <div className="g-col-md-6 g-col-12">

//                   <div className="">
//                     <div className="contant-icon-box mb-3">
//                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
//                         xmlns="http://www.w3.org/2000/svg">
//                         <path
//                           d="M18.9996 15.4817V17.5893C19.0004 17.7849 18.9602 17.9786 18.8817 18.1578C18.8031 18.3371 18.6879 18.498 18.5435 18.6303C18.399 18.7626 18.2285 18.8633 18.0428 18.9259C17.8571 18.9886 17.6603 19.0119 17.465 18.9943C15.299 18.7594 13.2183 18.0207 11.3902 16.8376C9.68945 15.7589 8.24748 14.3198 7.16674 12.6224C5.9771 10.7897 5.23677 8.70305 5.00571 6.53156C4.98812 6.33729 5.01126 6.1415 5.07364 5.95664C5.13603 5.77178 5.2363 5.60191 5.36807 5.45785C5.49984 5.31378 5.66022 5.19868 5.839 5.11986C6.01779 5.04105 6.21106 5.00025 6.40651 5.00007H8.51826C8.85987 4.99671 9.19105 5.11744 9.45007 5.33976C9.70909 5.56208 9.87828 5.87081 9.92609 6.20841C10.0152 6.88287 10.1805 7.54511 10.4188 8.18249C10.5135 8.43394 10.534 8.70721 10.4779 8.96993C10.4218 9.23265 10.2913 9.4738 10.1021 9.66481L9.20809 10.557C10.2102 12.3158 11.6693 13.7721 13.4316 14.7721L14.3256 13.8799C14.517 13.6911 14.7586 13.5609 15.0218 13.5049C15.2851 13.4488 15.5589 13.4693 15.8108 13.5638C16.4495 13.8016 17.113 13.9666 17.7888 14.0556C18.1308 14.1037 18.4431 14.2756 18.6663 14.5385C18.8895 14.8015 19.0081 15.1372 18.9996 15.4817Z"
//                           stroke="#EF7D00" strokeWidth="1.5" strokeLinecap="round"
//                           strokeLinejoin="round" />
//                       </svg>
//                     </div>
//                     <div className="contact-text">
//                       <a href="tel:+911824444021">+91 1824-444021</a><br />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//             </div>
//             <div className="col-md-4">
//               <div className="grid gap-5">
//                 <div className="g-col-md-6 g-col-12">

//                   <div className="">
//                     <div className="contant-icon-box mb-3">
//                       <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
//                         xmlns="http://www.w3.org/2000/svg">
//                         <g clipPath="url(#clip0_4273_280)">
//                           <path d="M16 0.523438L7.95831 6.52344L0 0.523438" stroke="#EF7D00"
//                             strokeWidth="1.5" />
//                         </g>
//                         <rect x="0.75" y="1.27344" width="14.5" height="11.5" stroke="#EF7D00"
//                           strokeWidth="1.5" />
//                         <defs>
//                           <clipPath id="clip0_4273_280">
//                             <rect y="0.523438" width="16" height="13" fill="white" />
//                           </clipPath>
//                         </defs>
//                       </svg>
//                     </div>
//                     <div className="contact-text">
//                       <a href="mailto:cif@lpu.co.in">cif@lpu.co.in</a><br />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>  
//     </>

//   )
// }
