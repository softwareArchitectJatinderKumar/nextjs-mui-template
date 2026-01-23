'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { instrumentService } from '@/services/instrumentService'; // Adjust path as per your project

export default function NewBookings() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- State Management (Matching Angular Component Variables) ---
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [InstrumentData, setInstrumentData] = useState([]);
  const [InstrumentDataInactive, setInstrumentDataInactive] = useState([]);
  const [AnalysisData, setAnalysisData] = useState([]);
  const [InstrumentsDuration, setInstrumentsDuration] = useState([]);
  const [Datagrid, setDatagrid] = useState<any[]>([]);
  
  const [formFields, setFormFields] = useState({
    InstrumentId: '',
    InstrumentName: '',
    AnalysisId: '',
    Duration: '',
    PriceValue: '',
    NumberOfSamples: '',
    totalAmount: 0,
    Remarks: '',
    FileName: '',
    FileData: ''
  });

  const [userData, setUserData] = useState<any>({});

  // Initialize Data on Mount
  useEffect(() => {
    const authData = Cookies.get('InternalUserAuthData');
    if (authData) {
      const parsed = JSON.parse(authData);
      setUserData(parsed);
      getInstrumentData();
    }
  }, []);

  // --- 1. Fetch Instruments (getInstrumentData) ---
  const getInstrumentData = async () => {
    setLoadingIndicator(true);
    const startTime = new Date().getTime();
    try {
      const response = await instrumentService.GetInstrumentsDetails();
      const items = response.item1 || [];
      setInstrumentData(items);
      setInstrumentDataInactive(items.filter((inst: any) => inst.isActive === false));
    } catch (err) {
      console.error(err);
    } finally {
      const elapsed = new Date().getTime() - startTime;
      const remainingDelay = Math.max(1000 - elapsed, 0);
      setTimeout(() => setLoadingIndicator(false), remainingDelay);
    }
  };

  // --- 2. Instrument Selection (getAllAnalysis) ---
  const getAllAnalysis = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === "Select") return;

    const [idStr, ...nameParts] = selectedValue.split(' ');
    const id = parseInt(idStr);
    const name = nameParts.join(' ');

    if (InstrumentDataInactive.some((inst: any) => inst.instrumentId === id)) {
      Swal.fire({ 
        title: 'This instrument is under Maintenance. You cannot proceed with this selection.', 
        icon: 'error' 
      });
      return;
    }

    setFormFields(prev => ({ ...prev, InstrumentId: id.toString(), InstrumentName: name }));
    
    setLoadingIndicator(true);
    try {
      const response = await instrumentService.GetAnalysisDetails(id);
      setAnalysisData(response.item1 || []);
      
      window.open(`https://files.lpu.in/umsweb/CIFDocuments/CIFSampleExcelSheets/${id}.xlsx`, '_blank');
      Swal.fire({
        title: "A Format File is being Downloaded. You need to fill and upload this Excel sheet!",
        icon: 'warning',
      });
    } finally {
      setLoadingIndicator(false);
    }
  };

  // --- 3. Analysis Selection (Triggers getDurationData) ---
  const handleAnalysisChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const analysisId = e.target.value;
    if (analysisId === "Select") return;
    
    setFormFields(prev => ({ ...prev, AnalysisId: analysisId, PriceValue: '', Duration: '' }));
    
    setLoadingIndicator(true);
    const startTime = new Date().getTime();
    try {
      // This is the getDurationData logic from your Angular file
      const response = await instrumentService.GetAnalysisData(analysisId, userData.UserRole);
      setInstrumentsDuration(response.item1 || []);
    } finally {
      const elapsed = new Date().getTime() - startTime;
      const remainingDelay = Math.max(1000 - elapsed, 0);
      setTimeout(() => setLoadingIndicator(false), remainingDelay);
    }
  };

  // --- 4. Duration Selection & Price Fetch (getPrice) ---
  const getPrice = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTypeName = event.target.options[event.target.selectedIndex].text;
    if (selectedTypeName === "Select Duration") return;

    setLoadingIndicator(true);
    const startTime = new Date().getTime();
    
    // Reset samples/amount as per Angular getPrice()
    setFormFields(prev => ({ ...prev, NumberOfSamples: '', totalAmount: 0 }));

    try {
      const response = await instrumentService.GetDuationAndPrice(
        formFields.AnalysisId, 
        userData.UserRole, 
        selectedTypeName
      );

      if (response.item1 && response.item1.length > 0) {
        const matchingPriceData = response.item1.find((item: any) => item.typeName === selectedTypeName);

        if (matchingPriceData) {
          const price = matchingPriceData.price;
          if (price === 'N/A' || price === 'NA') {
            Swal.fire({ title: 'This Test is not Allowed', icon: 'warning' });
            clearFormFields();
          } else {
            setFormFields(prev => ({ ...prev, PriceValue: price, Duration: selectedTypeName }));
          }
        }
      }
    } finally {
      const elapsed = new Date().getTime() - startTime;
      const remainingDelay = Math.max(1000 - elapsed, 0); 
      setTimeout(() => setLoadingIndicator(false), remainingDelay);
    }
  };

  // --- 5. Calculation Logic (calculateAmount) ---
  const calculateAmount = (samples: string) => {
    const cost = formFields.PriceValue !== 'N/A' ? parseInt(formFields.PriceValue) : 0;
    const count = parseInt(samples) || 0;
    setFormFields(prev => ({ ...prev, NumberOfSamples: samples, totalAmount: cost * count }));
  };

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size > 3148576) {
      Swal.fire({ title: 'File size exceeds 3MB', icon: 'warning' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFormFields(prev => ({ ...prev, FileName: file?.name || '', FileData: base64 }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const clearFormFields = () => {
    setFormFields({
      InstrumentId: '', InstrumentName: '', AnalysisId: '', Duration: '',
      PriceValue: '', NumberOfSamples: '', totalAmount: 0, Remarks: '',
      FileName: '', FileData: ''
    });
    setInstrumentsDuration([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const Addtogrid = () => {
    if (!formFields.AnalysisId || !formFields.Duration) {
      Swal.fire({ title: 'Please complete the selection', icon: 'error' });
      return;
    }
    setDatagrid([...Datagrid, { ...formFields, UserEmailId: userData.EmailId }]);
    clearFormFields();
  };

  
  const saveAllRecords = async () => {
    setLoadingIndicator(true);
    try {
      for (const item of Datagrid) {
        const formData = new FormData();
        formData.append('InstrumentId', item.InstrumentId);
        formData.append('analysisId', item.AnalysisId);
        formData.append('Duration', item.Duration);
        formData.append('AnalysisCharges', item.PriceValue);
        formData.append('NoOfSamples', item.NumberOfSamples);
        formData.append('TotalCharges', item.totalAmount.toString());
        formData.append('Remarks', item.Remarks);
        formData.append('UserEmailId', userData.EmailId);
        formData.append('FilePath', item.FileName);
        formData.append('File', item.FileData);

        await instrumentService.addBookingSlot(formData);
      }
      Swal.fire({ title: 'Success', text: 'All records saved', icon: 'success' })
        .then(() => router.push('/InternalUserDashboard/ViewBookings'));
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Submission failed', icon: 'error' });
    } finally {
      setLoadingIndicator(false);
    }
  };
  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {loadingIndicator && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white opacity-75" style={{ zIndex: 9999 }}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}

      {/* Maintenance Alerts */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body bg-white">
          <h6 className="text-danger fw-bold mb-2">Maintenance Status:</h6>
          <div className="d-flex flex-wrap gap-2">
            {InstrumentDataInactive.length > 0 ? (
              InstrumentDataInactive.map((inst: any) => (
                <span key={inst.instrumentId} className="badge bg-danger-subtle text-danger border border-danger">
                  {inst.instrumentName} - Offline
                </span>
              ))
            ) : <span className="text-muted small">All systems operational</span>}
          </div>
        </div>
      </div>

      {currentStep === 1 ? (
        <div className="card shadow-sm border-0 p-4">
          <h4 className="mb-4 fw-bold">Step 1: Booking Details</h4>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-bold">1. Select Instrument</label>
              <select className="form-select" onChange={getAllAnalysis}>
                <option value="Select">Choose...</option>
                {InstrumentData.map((inst: any) => (
                  <option key={inst.instrumentId} value={`${inst.instrumentId} ${inst.instrumentName}`}>
                    {inst.instrumentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold">2. Analysis Type</label>
              <select className="form-select" onChange={handleAnalysisChange} value={formFields.AnalysisId}>
                <option value="Select">Choose...</option>
                {AnalysisData.map((an: any) => (
                  <option key={an.analysisId} value={an.analysisId}>{an.analysisType}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold">3. Duration / Option</label>
              <select className="form-select" onChange={getPrice}>
                <option value="Select">Choose...</option>
                {InstrumentsDuration.map((dur: any, idx: number) => (
                  <option key={idx} value={dur.analysisId}>{dur.typeName}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-bold">No. of Samples</label>
              <input type="number" className="form-control" value={formFields.NumberOfSamples} onChange={(e) => calculateAmount(e.target.value)} />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-bold">Total Amount (₹)</label>
              <input type="text" className="form-control bg-light fw-bold" value={formFields.totalAmount} readOnly />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Upload Filled Excel</label>
              <input type="file" ref={fileInputRef} className="form-control" onChange={onFileSelected} accept=".xlsx" />
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold">Specific Parameters / Remarks</label>
              <textarea className="form-control" rows={2} value={formFields.Remarks} onChange={(e) => setFormFields({...formFields, Remarks: e.target.value})} />
            </div>

            <div className="col-12 text-center mt-4">
              <button className="btn btn-dark px-5 me-2" onClick={Addtogrid}>Add to Bucket</button>
              <button className="btn btn-primary px-5" onClick={() => setCurrentStep(2)} disabled={Datagrid.length === 0}>
                Review Summary ({Datagrid.length})
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0 p-4">
          <h4 className="mb-4 fw-bold">Step 2: Review Bucket</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Duration</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Datagrid.map((item, index) => (
                <tr key={index}>
                  <td>{item.InstrumentName}</td>
                  <td>{item.Duration}</td>
                  <td>{item.NumberOfSamples}</td>
                  <td>₹{item.totalAmount}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => setDatagrid(Datagrid.filter((_, i) => i !== index))}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-end fw-bold h5">Grand Total: ₹{Datagrid.reduce((s, i) => s + i.totalAmount, 0)}</div>
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button className="btn btn-outline-secondary px-5" onClick={() => setCurrentStep(1)}>Add More</button>
            <button className="btn btn-success" onClick={saveAllRecords}>Confirm & Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import Swal from 'sweetalert2';
// import Cookies from 'js-cookie';
// import { instrumentService } from '@/services/instrumentService';

// export default function NewBookings() {
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [currentStep, setCurrentStep] = useState(1);
//   const [loadingIndicator, setLoadingIndicator] = useState(false);
//   const [InstrumentData, setInstrumentData] = useState([]);
//   const [InstrumentDataInactive, setInstrumentDataInactive] = useState([]);
//   const [AnalysisData, setAnalysisData] = useState([]);
//   const [InstrumentsDuration, setInstrumentsDuration] = useState([]);
//   const [Datagrid, setDatagrid] = useState<any[]>([]);
  
//   // Form Field States
//   const [formFields, setFormFields] = useState({
//     InstrumentId: '',
//     InstrumentName: '',
//     AnalysisId: '',
//     Duration: '',
//     PriceValue: '',
//     NumberOfSamples: '',
//     totalAmount: 0,
//     Remarks: '',
//     FileName: '',
//     FileData: ''
//   });

//   // User Data from Cookies
//   const [userData, setUserData] = useState<any>({});

//   useEffect(() => {
//     const authData = Cookies.get('InternalUserAuthData');
//     if (authData) {
//       const parsed = JSON.parse(authData);
//       setUserData(parsed);
//       getInstrumentData(); // Initial Call
//     }
//   }, []);

//   // --- Preserved API Logic Functions ---

//   const getInstrumentData = async () => {
//     setLoadingIndicator(true);
//     try {
//       const response = await instrumentService.GetInstrumentsDetails();
//       const items = response.item1 || [];
//       setInstrumentData(items);
//       const inactive = items.filter((inst: any) => inst.isActive === false);
//       setInstrumentDataInactive(inactive);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingIndicator(false);
//     }
//   };

//   const getAllAnalysis = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedValue = e.target.value;
//     if (selectedValue === "Select") return;

//     const [idStr, ...nameParts] = selectedValue.split('-');
//     const id = parseInt(idStr);
//     const name = nameParts.join(' ');

//     // Maintenance Check
//     const isInactive = InstrumentDataInactive.some((inst: any) => inst.instrumentId === id);
//     if (isInactive) {
//       Swal.fire({ title: 'Instrument under Maintenance', icon: 'error' }).then(() => window.location.reload());
//       return;
//     }

//     setFormFields(prev => ({ ...prev, InstrumentId: id.toString(), InstrumentName: name }));
    
//     // Download Template Logic (testClick)
//     testClick(id);
//     Swal.fire({ title: "Template Downloaded. Please fill and upload.", icon: 'info' });

//     setLoadingIndicator(true);
//     try {
//       const response = await instrumentService.GetAnalysisDetails(id);
//       setAnalysisData(response.item1 || []);
//     } finally {
//       setLoadingIndicator(false);
//     }
//   };

//   const getDurationData = async (analysisId: any) => {
//     setLoadingIndicator(true);
//     try {
//       const response = await instrumentService.GetAnalysisDetails(analysisId);
//       setInstrumentsDuration(response.item1 || []);
//     } finally {
//       setLoadingIndicator(false);
//     }
//   };

//   const getPrice = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const analysisId = e.target.value;
//     const durationName = e.target.options[e.target.selectedIndex].text;
    
//     setLoadingIndicator(true);
//     try {
//       const response = await instrumentService.GetDuationAndPrice(analysisId, userData.UserRole, durationName);
//       const match = response.item1?.find((item: any) => item.typeName === durationName);
//       if (match) {
//         if (match.price === 'N/A') {
//           Swal.fire({ title: 'Test not allowed', icon: 'warning' });
//           return;
//         }
//         setFormFields(prev => ({ ...prev, PriceValue: match.price, Duration: durationName }));
//       }
//     } finally {
//       setLoadingIndicator(false);
//     }
//   };

//   const calculateAmount = (samples: string) => {
//     const cost = parseInt(formFields.PriceValue) || 0;
//     const count = parseInt(samples) || 0;
//     setFormFields(prev => ({ ...prev, NumberOfSamples: samples, totalAmount: cost * count }));
//   };

//   const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (file.size > 3148576) {
//       Swal.fire({ title: 'File size exceeds 3MB', icon: 'warning' });
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       const base64 = (reader.result as string).split(',')[1];
//       setFormFields(prev => ({ ...prev, FileName: file.name, FileData: base64 }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const Addtogrid = () => {
//     const newEntry = { ...formFields, UserEmailId: userData.EmailId };
//     setDatagrid([...Datagrid, newEntry]);
//     clear();
//   };

//   const clear = () => {
//     setFormFields({
//       InstrumentId: '', InstrumentName: '', AnalysisId: '', Duration: '',
//       PriceValue: '', NumberOfSamples: '', totalAmount: 0, Remarks: '',
//       FileName: '', FileData: ''
//     });
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const saveAllRecords = async () => {
//     setLoadingIndicator(true);
//     try {
//       for (const item of Datagrid) {
//         const formData = new FormData();
//         formData.append('InstrumentId', item.InstrumentId);
//         formData.append('analysisId', item.AnalysisId);
//         formData.append('Duration', item.Duration);
//         formData.append('AnalysisCharges', item.PriceValue);
//         formData.append('NoOfSamples', item.NumberOfSamples);
//         formData.append('TotalCharges', item.totalAmount.toString());
//         formData.append('Remarks', item.Remarks);
//         formData.append('UserEmailId', userData.EmailId);
//         formData.append('FilePath', item.FileName);
//         formData.append('File', item.FileData);

//         await instrumentService.addBookingSlot(formData);
//       }
//       Swal.fire({ title: 'Success', text: 'All records saved', icon: 'success' })
//         .then(() => router.push('/InternalUserDashboard/ViewBookings'));
//     } catch (err) {
//       Swal.fire({ title: 'Error', text: 'Submission failed', icon: 'error' });
//     } finally {
//       setLoadingIndicator(false);
//     }
//   };

//   const testClick = (id: any) => {
//     const serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/CIFSampleExcelSheets/';
//     window.open(`${serverUrl}${id}.xlsx`, '_blank');
//   };

//   // --- UI Render ---
//   return (
//     <div className="container p-4">
//       {loadingIndicator && (
//         <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white opacity-75" style={{ zIndex: 9999 }}>
//           <div className="spinner-border text-primary" role="status"></div>
//         </div>
//       )}

//       {/* Floating Cart (preserved logic) */}
//       {Datagrid.length > 0 && (
//         <div className="fixed-bottom p-3 text-end" onClick={() => setCurrentStep(2)}>
//            <button className="btn btn-primary rounded-pill shadow">
//              <i className="mdi mdi-cart"></i> Tests Added: {Datagrid.length}
//            </button>
//         </div>
//       )}

//       <h2>New Test Booking Form</h2>

//       {/* Step 1: Entry Form */}
//       {currentStep === 1 && (
//         <div className="card p-4 border-primary">
//           <div className="row g-3">
//             <div className="col-md-3">
//               <label>Instrument Name:</label>
//               <select className="form-select" onChange={getAllAnalysis}>
//                 <option value="Select">Select Instrument</option>
//                 {InstrumentData.map((inst: any) => (
//                   <option key={inst.instrumentId} value={`${inst.instrumentId}-${inst.instrumentName}`}>
//                     {inst.instrumentName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-3">
//               <label>Analysis Type:</label>
//               <select className="form-select" onChange={(e) => {
//                 setFormFields({...formFields, AnalysisId: e.target.value});
//                 getDurationData(e.target.value);
//               }}>
//                 <option value="Select">Select Analysis</option>
//                 {AnalysisData.map((an: any) => (
//                   <option key={an.analysisId} value={an.analysisId}>{an.analysisType}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-2">
//               <label>Samples:</label>
//               <input type="number" className="form-control" onChange={(e) => calculateAmount(e.target.value)} />
//             </div>

//             <div className="col-md-4">
//               <label>Upload Parameters (Excel):</label>
//               <input type="file" ref={fileInputRef} className="form-control" onChange={onFileSelected} accept=".xls,.xlsx" />
//             </div>

//             <div className="col-12 mt-4 text-center">
//               <button className="btn btn-dark me-2" onClick={Addtogrid} disabled={!formFields.AnalysisId}>Add to Bucket</button>
//               <button className="btn btn-primary" onClick={() => setCurrentStep(2)} disabled={Datagrid.length === 0}>Next Step</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Step 2: Grid View */}
//       {currentStep === 2 && (
//         <div className="mt-4">
//           <table className="table table-bordered">
//             <thead className="table-dark">
//               <tr>
//                 <th>Instrument</th>
//                 <th>Samples</th>
//                 <th>Total</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Datagrid.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.InstrumentName}</td>
//                   <td>{item.NumberOfSamples}</td>
//                   <td>₹{item.totalAmount}</td>
//                   <td><button className="btn btn-danger" onClick={() => setDatagrid(Datagrid.filter((_, i) => i !== index))}>Remove</button></td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan={2} className="text-end fw-bold">Grand Total:</td>
//                 <td>₹{Datagrid.reduce((acc, curr) => acc + curr.totalAmount, 0)}</td>
//                 <td></td>
//               </tr>
//             </tfoot>
//           </table>
//           <div className="text-center mt-3">
//             <button className="btn btn-secondary me-2" onClick={() => setCurrentStep(1)}>Back</button>
//             <button className="btn btn-success" onClick={saveAllRecords}>Confirm & Save</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }