'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import myAppWebService from '@/services/myAppWebService';
import { 
  CircularProgress, 
  Alert, 
  Container, 
  Typography, 
  Box, 
  Breadcrumbs, 
  Link as MuiLink,
  Paper,
  Divider
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Interface definitions
interface InstrumentDetail {
  id: number;
  instrumentName: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
}

interface Specification {
  id: number;
  categoryId: number;
  instrumentId?: number; // Added to match against the specific instrument
  keyName: string;
  keyValue: string;
}

interface InstrumentMaster {
  id: number;
  instrumentName: string;
  imageUrl: string;
  isActive: boolean;
}
const FALLBACK_IMAGE = "https://www.lpu.in/lpu-assets/images/logo/logo.png";

const InstrumentContent = () => {
  const searchParams = useSearchParams();
  
  // 1. Get and Decode URL Parameters
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const categoryId = searchParams.get('categoryId');
  const rawImageUrl = searchParams.get('imageUrl');
  const description = searchParams.get('description');

  // Decode the image URL safely
  const decodedImageUrl = rawImageUrl ? decodeURIComponent(rawImageUrl) : FALLBACK_IMAGE;

  const [instrumentDetails, setInstrumentDetails] = useState<InstrumentDetail | null>(null);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgSrc, setImgSrc] = useState<string>(decodedImageUrl);
  const [details, setDetails] = useState<InstrumentMaster | null>(null);
   const [specs, setSpecs] = useState<Specification[]>([]);

  // 2. Fetch Instrument Details and Specifications from API


  useEffect(() => {
    if (!id || !categoryId) {
      setError('Missing instrument ID or category ID. Please return to the facilities page.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Fetch Instrument Details (Name, Image, Active Status)
        const instrumentResponse = await myAppWebService.getAllInstruments();
        const allInstruments: InstrumentMaster[] = instrumentResponse?.item1 ?? [];
        const instrumentMatch = allInstruments.find(inst => inst.id === parseInt(id));

        // 2. Fetch All Specifications 
        // We use the data source containing the list of specs you provided earlier
        const specsResponse = await myAppWebService.fetchSpecifications(); 
        const allSpecs: Specification[] = specsResponse?.item1 ?? specsResponse ?? [];

        if (instrumentMatch) {
          // Image Repair
          let finalImg = instrumentMatch.imageUrl || FALLBACK_IMAGE;
          if (finalImg.startsWith('/') && !finalImg.startsWith('//')) {
            finalImg = `https://www.lpu.in${finalImg}`;
          }

          setDetails({ ...instrumentMatch, imageUrl: finalImg });

          // Filter specifications by BOTH categoryId and instrumentId (if available in your data)
          const filteredSpecs = allSpecs.filter(s => 
            s.categoryId === parseInt(categoryId) && s.instrumentId === parseInt(id)
          );
          
          setSpecs(filteredSpecs);
        } else {
          setError('Instrument not found.');
        }

      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to load instrument data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, categoryId]);

    const fetchInstrumentDetails = async () => {
      try {
        const response = await myAppWebService.fetchSpecifications();
        const specs = response?.item1 ?? [];
        console.log('Fetched Specifications:', specs);
        const instrument: InstrumentDetail = {
          id: parseInt(id),
          instrumentName: name ?? 'Unknown Instrument',
          imageUrl: imgSrc,
          description: description ?? 'No description available for this facility.',
          isActive: true,
        };

        setInstrumentDetails(instrument);
        setSpecifications(Array.isArray(specs) ? specs : []);
      } catch (err) {
        console.error('Error fetching specifications:', err);
        setError('Failed to load instrument specifications from the server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstrumentDetails();
  }, [id, categoryId, name, decodedImageUrl, description]);

  // Handle Image Load Errors
  const handleError = () => {
    setImgSrc(FALLBACK_IMAGE);
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Instrument Specifications...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error" variant="filled">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs for Navigation */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink underline="hover" color="inherit" href="/">Home</MuiLink>
        <Typography color="text.primary">Instrument Details</Typography>
      </Breadcrumbs>

      {instrumentDetails && (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, border: '1px solid #eee' }}>
          <div className="row">
            {/* Image Column */}
            <div className="col-md-5 mb-4">
              <Box 
                sx={{ 
                  width: '100%', 
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#f9f9f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ddd'
                }}
              >
                <img 
                  src={imgSrc} 
                  alt={instrumentDetails.instrumentName}
                  onError={handleError}
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block',
                    objectFit: 'contain',
                    maxHeight: '400px'
                  }} 
                />
              </Box>
            </div>

            {/* Details Column */}
            <div className="col-md-7">
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom color="primary">
                {instrumentDetails.instrumentName}
              </Typography>
              
              <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Status: 
                <Box component="span" sx={{ 
                  color: instrumentDetails.isActive ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}>
                  ● {instrumentDetails.isActive ? 'Available' : 'Maintenance'}
                </Box>
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Description</Typography>
              <Typography variant="body1" paragraph sx={{ color: '#555' }}>
                {instrumentDetails.description}
              </Typography>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Technical Specifications</Typography>
              {specifications.length > 0 ? (
                <Box sx={{ bgcolor: '#fcfcfc', p: 2, borderRadius: 1 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {specifications.map((spec, index) => (
                        <tr key={spec.id || index} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px', fontWeight: 'bold', width: '35%' }}>
                            {spec.keyName || 'Feature'}
                          </td>
                          <td style={{ padding: '10px' }}>
                            {spec.keyValue || spec.name || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Alert severity="info">Detailed specifications are available upon request.</Alert>
              )}
            </div>
          </div>
        </Paper>
      )}
    </Container>
  );
};

// Main Export with Suspense Boundary
export default function OurInstrumentsPage() {
  return (
    <Suspense fallback={
      <Container sx={{ textAlign: 'center', py: 10 }}>
        <CircularProgress />
      </Container>
    }>
      <InstrumentContent />
    </Suspense>
  );
}
// 'use client';
// import React, { use, useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation'
// import myAppWebService from '@/services/myAppWebService';

// const OurInstruments = () => {
//   const router = useRouter();
//   const [instrumentDetails, setInstrumentDetails] = useState(null);
//   const [specifications, setSpecifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (!router.isReady) return;

//     const { id, name, categoryId, imageUrl, description } = router.query;

//     if (!id || !categoryId) {
//       setError('Missing instrument ID or category ID.');
//       setIsLoading(false);
//       return;
//     }

//     const fetchInstrumentDetails = async () => {
//       try {
//         const response = await myAppWebService.fetchSpecifications(categoryId, id);
//         const specs = response?.item1 ?? [];


//         const instrument = {
//           id: parseInt(id),
//           instrumentName: name ?? 'Unknown Instrument',
//           imageUrl: imageUrl ?? '/default-placeholder.png',
//           description: description ?? 'No description available',
//           isActive: true,
//         };


//         setInstrumentDetails(instrument);
//         setSpecifications(Array.isArray(specs) ? specs : []);
//       } catch (err) {
//         console.error('Error fetching specifications:', err);
//         setError('Failed to load instrument details.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInstrumentDetails();
//   }, [router.isReady]);


//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <>
//       {/* <Header /> */}
//       <div className="container mt-5">
//         <h1>Instrument Details</h1>
//         {instrumentDetails ? (
//           <div>
//             <h2>{instrumentDetails.instrumentName}</h2>
//             <img
//               src={instrumentDetails.imageUrl}
//               alt={instrumentDetails.instrumentName}
//               className="img-fluid mb-3"
//             />

//             <p><strong>Description:</strong> {instrumentDetails.description}</p>
//             <p><strong>Status:</strong> {instrumentDetails.isActive ? 'Active' : 'Inactive'}</p>

//             <h3>Specifications</h3>
//             {specifications.length > 0 ? (
//               <ul>
//                 {specifications.map((spec) => (
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
//       </div>
//     </>
//   );
// };

// export default OurInstruments;
