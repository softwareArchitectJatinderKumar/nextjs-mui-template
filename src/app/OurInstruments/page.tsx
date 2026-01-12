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

  if (loading) return <div className="p-5 text-center">Loading...</div>;

  return (
    <main>
       {/* <FacilitiesSection instruments={data} /> */}
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
  );
}

export default function OurInstrumentsPage() {
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <InstrumentsContent />
    </Suspense>
  );
}


// 'use client';

// import React, { useEffect, useState, Suspense } from 'react';
// import NextLink from 'next/link';
// import { useSearchParams } from 'next/navigation';
// import myAppWebService from '@/services/myAppWebService';
// import {
//   CircularProgress, Alert, Container, Typography, Box,
//   Paper, Divider, Chip, Table, TableBody, TableCell, TableContainer, TableRow
// } from '@mui/material';
// import { spec } from 'node:test/reporters';
// import { Link } from 'lucide-react';

// // Interfaces for Master Data and Specifications
// interface InstrumentMaster {
//   id: number;
//   instrumentName: string;
//   imageUrl: string;
//   isActive: boolean;
//   description?: string;
// }

// interface Specification {
//   id: number;
//   name: string;
//   categoryId: number;
//   instrumentId?: number; // Added to match against the specific instrument
//   keyName: string;
//   keyValue: string;
// }

// const FALLBACK_IMAGE = "https://www.lpu.in/lpu-assets/images/logo/logo.png";

// const InstrumentContent = () => {
//   const searchParams = useSearchParams();
//   const idFromUrl = searchParams.get('id');
//   const categoryIdFromUrl = searchParams.get('categoryId');

//   const [details, setDetails] = useState<InstrumentMaster | null>(null);
//   const [specs, setSpecs] = useState<Specification[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!idFromUrl || !categoryIdFromUrl) {
//       setError('Missing identification parameters.');
//       setIsLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         // 1. Fetch Instrument Details (Name, Image, Active Status)
//         const instrumentResponse = await myAppWebService.getAllInstruments();
//         const allInstruments: InstrumentMaster[] = instrumentResponse?.item1 ?? [];
//         const instrumentMatch = allInstruments.find(inst => inst.id === parseInt(idFromUrl));

//         // 2. Fetch All Specifications 
//         // We use the data source containing the list of specs you provided earlier
//         const specsResponse = await myAppWebService.fetchSpecifications();
//         const allSpecs: Specification[] = specsResponse?.item1 ?? specsResponse ?? [];

//         if (instrumentMatch) {
//           // Image Repair
//           let finalImg = instrumentMatch.imageUrl || FALLBACK_IMAGE;
//           if (finalImg.startsWith('/') && !finalImg.startsWith('//')) {
//             finalImg = `https://www.lpu.in${finalImg}`;
//           }

//           setDetails({ ...instrumentMatch, imageUrl: finalImg });

//           // Filter specifications by BOTH categoryId and instrumentId (if available in your data)
//           const filteredSpecs = allSpecs.filter(s =>
//             s.categoryId === parseInt(categoryIdFromUrl)
//           );

//           setSpecs(filteredSpecs);
//         } else {
//           setError('Instrument not found.');
//         }

//       } catch (err) {
//         console.error('Fetch Error:', err);
//         setError('Failed to load instrument data.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [idFromUrl, categoryIdFromUrl]);

//   if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;
//   if (error) return <Container sx={{ mt: 5 }}><Alert severity="error">{error}</Alert></Container>;

//   return (
//     <>
//       <Container maxWidth="xl" sx={{ py: 5 }}>
//         {details && (
//           <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
//             {/* Header Section: Name, Image, and Status */}
//             <div className="row align-items-center mb-5">

//               <div className="col-md-12 text-start mb-4">
//                 <Typography variant="h4" fontWeight="bold" color="primary">
//                   {details.instrumentName}
//                 </Typography>

//                 <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
//                   <Chip
//                     label={details.isActive ? "Operational" : "Under Maintenance"}
//                     color={details.isActive ? "success" : "error"}
//                     variant="filled"
//                   />
//                   <button className="btn btn-primary">
//                    Go to Home
//                   </button>
                   
//                   <Typography variant="body2" color="text.secondary">
//                     Category ID: {categoryIdFromUrl} | Instrument ID: {idFromUrl}
//                   </Typography>
//                 </Box>

//               </div>
//             </div>
//             {/* Image Section */}
//             <Box sx={{ textAlign: 'center', mb: 5 }}>
//               <img
//                 src={details.imageUrl}
//                 alt={details.instrumentName}
//                 style={{ maxWidth: '80%', height: 'auto' }}
//                 onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
//               />
//             </Box>

//             <Divider sx={{ mb: 5 }} />

//             {/* Technical Specifications Table */}
//             <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
//               Technical Description
//             </Typography>

//             <Box sx={{ mt: 3 }}>
//               <Typography variant="body1" color="text.primary">
//                 {details.description || "No description available for this instrument."}
//               </Typography>
//             </Box>

//             <Divider sx={{ mb: 5 }} />

//             {/* Technical Specifications Table */}
//             <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
//               Technical Specifications
//             </Typography>

//             {specs.length > 0 ? (
//               <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
//                 <Table>
//                   <TableBody>
//                     {specs.map((spec) => (
//                       <TableRow key={spec.id} sx={{ '&:nth-of-type(even)': { bgcolor: '#fcfcfc' } }}>
//                         <TableCell sx={{ fontWeight: 'bold', width: '35%', py: 2 }}>
//                           {spec.keyName}
//                         </TableCell>
//                         <TableCell sx={{ py: 2 }}>
//                           {spec.keyValue}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             ) : (
//               <Alert severity="info">No specific technical data available for this category and instrument combination.</Alert>
//             )}
//           </Paper>
//         )}
//       </Container>
//       {/* <div className="container mt-5">
//         <h1>Instrument Details</h1>
//         {details ? (
//           <div>
//             <h2>{details.instrumentName}</h2>
//             <img
//               src={details.imageUrl}
//               alt={details.instrumentName}
//               className="img-fluid mb-3"
//             />

//             <p><strong>Description:</strong> {details.description}</p>
//             <p><strong>Status:</strong> {details.isActive ? 'Active' : 'Inactive'}</p>

//             <h3>Specifications</h3>
//             {specs.length > 0 ? (
//               <ul>
//                 {specs.map((spec) => (
//                   <li key={spec.keyName || spec.id}>
//                     <strong>{spec.keyName || 'Key'}:</strong> {spec.keyValue || spec.name}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No specifications available.</p>
//             )}
//           </div>
//         ) : (
//           <p>No instrument details available.</p>
//         )}
//       </div> */}
//     </>
//   );
// };

// export default function OurInstrumentsPage() {
//   return (
//     <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>}>
//       <InstrumentContent />
//     </Suspense>
//   );
// }
// // 'use client';
// // import React, { use, useEffect, useState } from 'react';
// // import Link from 'next/link';
// // import { useRouter } from 'next/navigation'
// // import myAppWebService from '@/services/myAppWebService';

// // const OurInstruments = () => {
// //   const router = useRouter();
// //   const [instrumentDetails, setInstrumentDetails] = useState(null);
// //   const [specifications, setSpecifications] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     if (!router.isReady) return;

// //     const { id, name, categoryId, imageUrl, description } = router.query;

// //     if (!id || !categoryId) {
// //       setError('Missing instrument ID or category ID.');
// //       setIsLoading(false);
// //       return;
// //     }

// //     const fetchInstrumentDetails = async () => {
// //       try {
// //         const response = await myAppWebService.fetchSpecifications(categoryId, id);
// //         const specs = response?.item1 ?? [];


// //         const instrument = {
// //           id: parseInt(id),
// //           instrumentName: name ?? 'Unknown Instrument',
// //           imageUrl: imageUrl ?? '/default-placeholder.png',
// //           description: description ?? 'No description available',
// //           isActive: true,
// //         };


// //         setInstrumentDetails(instrument);
// //         setSpecifications(Array.isArray(specs) ? specs : []);
// //       } catch (err) {
// //         console.error('Error fetching specifications:', err);
// //         setError('Failed to load instrument details.');
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchInstrumentDetails();
// //   }, [router.isReady]);


// //   if (isLoading) return <div>Loading...</div>;
// //   if (error) return <div>Error: {error}</div>;

// //   return (
// //     <>
// //       {/* <Header /> */}
// //       <div className="container mt-5">
// //         <h1>Instrument Details</h1>
// //         {instrumentDetails ? (
// //           <div>
// //             <h2>{instrumentDetails.instrumentName}</h2>
// //             <img
// //               src={instrumentDetails.imageUrl}
// //               alt={instrumentDetails.instrumentName}
// //               className="img-fluid mb-3"
// //             />

// //             <p><strong>Description:</strong> {instrumentDetails.description}</p>
// //             <p><strong>Status:</strong> {instrumentDetails.isActive ? 'Active' : 'Inactive'}</p>

// //             <h3>Specifications</h3>
// //             {specifications.length > 0 ? (
// //               <ul>
// //                 {specifications.map((spec) => (
// //                   <li key={spec.keyName || spec.id}>
// //                     <strong>{spec.keyName || 'Key'}:</strong> {spec.keyValue || spec.name}
// //                   </li>
// //                 ))}
// //               </ul>
// //             ) : (
// //               <p>No specifications available.</p>
// //             )}
// //           </div>
// //         ) : (
// //           <p>No instrument details available.</p>
// //         )}
// //       </div>
// //     </>
// //   );
// // };

// // export default OurInstruments;
