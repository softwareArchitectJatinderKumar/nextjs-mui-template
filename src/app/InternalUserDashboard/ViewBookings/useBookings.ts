// ============================================================
// hooks/useBookings.ts — All API calls & business logic
// Every service call goes through myAppWebService — no raw fetch.
// No JSX here. UI components stay 100% pure.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { BookingRow, SampleStatus, PaymentProof, UserSession } from './types';

export const SERVER_FILE_URL = 'https://files.lpu.in/umsweb/CIFDocuments/';

// ============================================================
// myAppWebService interface
// Mirrors the shape of your existing Angular service so this
// file is a straight 1-to-1 replacement. Pass the real
// instance in from page.tsx (see usage below).
// ============================================================
export interface MyAppWebService {
  GetUserAllBookingSlot(emailId: string): Promise<{ item1: BookingRow[] }>;
  GetAllSampleStatus(): Promise<{ item1: SampleStatus[] }>;
  GetBookingPaymentProofDetails(userId: string): Promise<{ item1: PaymentProof[] }>;
  GetDecodePaymentStatusDetails(formData: FormData): Promise<{ status: string }>;
  MakePaymentforTest(formData: FormData): Promise<{ item1: Array<{ url: string }> }>;
  UploadPaymentReceipt(formData: FormData): Promise<{ item1: Array<{ returnId: number; msg: string }> }>;
}

// ============================================================
// useBookings — list, search, pagination
// ============================================================
export function useBookings(
  webService: MyAppWebService,
  userEmail: string,
) {
  const [bookings, setBookings]         = useState<BookingRow[]>([]);
  const [loading, setLoading]           = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchBookings = useCallback(async () => {
    if (!userEmail) return;
    setLoading(true);
    const startTime = Date.now();
    try {
      const response = await webService.GetUserAllBookingSlot(userEmail);
      setBookings(response?.item1 ?? []);
    } catch (err) {
      console.error('useBookings – GetUserAllBookingSlot:', err);
    } finally {
      const elapsed = Date.now() - startTime;
      setTimeout(() => setLoading(false), Math.max(2500 - elapsed, 0));
    }
  }, [webService, userEmail]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // ── Derived: filtered list ────────────────────────────────
  const filteredBookings = searchQuery.trim()
    ? bookings.filter(b =>
        b.instrumentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.analysisType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bookings;

  // ── Derived: pagination ───────────────────────────────────
  const totalPages      = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const currentPageData = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleItemsPerPageChange = (val: number) => {
    setItemsPerPage(val);
    setCurrentPage(1);
  };

  return {
    bookings, loading, searchQuery, setSearchQuery,
    currentPage, totalPages, currentPageData, itemsPerPage,
    nextPage, prevPage, handleItemsPerPageChange,
    refetch: fetchBookings,
  };
}

// ============================================================
// useSampleStatus
// ============================================================
export function useSampleStatus(webService: MyAppWebService) {
  const [allSamples, setAllSamples] = useState<SampleStatus[]>([]);

  useEffect(() => {
    webService
      .GetAllSampleStatus()
      .then(response => setAllSamples(response?.item1 ?? []))
      .catch(err => console.error('useSampleStatus – GetAllSampleStatus:', err));
  }, [webService]);

  const getSamplesForBooking = (bookingId: number, instrumentId: number) =>
    allSamples.filter(
      s => s.bookingId === bookingId && s.instrumentId === instrumentId,
    );

  return { allSamples, getSamplesForBooking };
}

// ============================================================
// usePaymentProof
// ============================================================
export function usePaymentProof(
  webService: MyAppWebService,
  userId: string,
) {
  const [proofData, setProofData] = useState<PaymentProof[]>([]);

  const fetchProof = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await webService.GetBookingPaymentProofDetails(userId);
      setProofData(response?.item1 ?? []);
    } catch (err) {
      console.error('usePaymentProof – GetBookingPaymentProofDetails:', err);
    }
  }, [webService, userId]);

  useEffect(() => { fetchProof(); }, [fetchProof]);

  const hasProofUploaded = (bookingId: number) =>
    proofData.some(p => String(p.bookingId) === String(bookingId));

  return { proofData, hasProofUploaded, refetch: fetchProof };
}

// ============================================================
// usePayment — initiate payment gateway redirect
// ============================================================
export function usePayment(webService: MyAppWebService) {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (
    booking: BookingRow,
    session: UserSession,
    responseUrl: string,
  ) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('BookingId',     String(booking.id));
      fd.append('InstrumentId',  String(booking.instrumentId));
      fd.append('CandidateName', session.candidateName);
      fd.append('Amount',        String(booking.totalCharges));
      fd.append('Type',          'CIF');
      fd.append('UserEmailId',   session.userEmail);
      fd.append('MobileNo',      session.mobileNo);
      fd.append('FacultyCode',   session.userEmail);
      fd.append('ResponseUrl',   responseUrl);

      const response = await webService.MakePaymentforTest(fd);
      const url = response?.item1?.[0]?.url;

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Payment URL not found in response');
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, initiatePayment };
}

// ============================================================
// usePaymentCallback — handles gateway redirect query params
// ============================================================
export function usePaymentCallback(
  webService: MyAppWebService,
  params: {
    id: string | null;
    status: string | null;
    type: string | null;
    transactionNo: string | null;
    hashedValue: string | null;
    course: string | null;
    keyNote: string | null;
  },
) {
  const callbackStatus = useCallback(async (): Promise<'success' | 'failure' | null> => {
    if (!params.id || !params.status) return null;

    const fd = new FormData();
    fd.append('Id',            params.id);
    fd.append('Status',        params.status);
    fd.append('Type',          params.type          ?? '');
    fd.append('TransactionNo', params.transactionNo ?? '');
    fd.append('Course',        params.course        ?? '');
    fd.append('KeyNote',       params.keyNote       ?? '');
    fd.append('HashedValue',   params.hashedValue   ?? '');

    try {
      await webService.GetDecodePaymentStatusDetails(fd);
    } catch (err) {
      console.error('usePaymentCallback – GetDecodePaymentStatusDetails:', err);
    }

    return params.status === 'success' ? 'success'
         : params.status === 'failure' ? 'failure'
         : null;
  }, [webService, params]);

  return { callbackStatus };
}

// ============================================================
// useReceiptUpload — file selection + upload
// ============================================================
export function useReceiptUpload(
  webService: MyAppWebService,
  userId: string,
) {
  const [loading, setLoading]       = useState(false);
  const [fileData, setFileData]     = useState<string | null>(null);
  const [fileName, setFileName]     = useState('');
  const [remarks, setRemarks]       = useState('');
  const [fileChosen, setFileChosen] = useState(false);

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

  /** Returns an error string on validation failure, null on success */
  const handleFileSelect = (file: File | null): string | null => {
    if (!file) return null;
    if (file.size > MAX_SIZE) return 'File size exceeds 5 MB. Please upload a smaller file.';
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFileData((reader.result as string).split(',')[1]);
      setFileName(file.name);
      setFileChosen(true);
    };
    return null;
  };

  const uploadReceipt = async (
    bookingId: number,
  ): Promise<{ returnId: number; message: string }> => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('BookingId',          String(bookingId));
      fd.append('ReceiptRemarks',     remarks);
      fd.append('PaymentReceiptUrl',  fileName);
      fd.append('PaymentReceiptData', fileData ?? '');
      fd.append('UserId',             userId);

      const response = await webService.UploadPaymentReceipt(fd);
      return {
        returnId: response?.item1?.[0]?.returnId ?? 0,
        message:  response?.item1?.[0]?.msg       ?? '',
      };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFileData(null);
    setFileName('');
    setRemarks('');
    setFileChosen(false);
  };

  return {
    loading, fileData, fileName, remarks, setRemarks,
    fileChosen, handleFileSelect, uploadReceipt, reset,
  };
}

// ============================================================
// exportBookingsToExcel — lazy-loads xlsx to keep bundle lean
// ============================================================
export async function exportBookingsToExcel(bookings: BookingRow[]) {
  const XLSX = await import('xlsx');
  const rows = bookings.map(b => ({
    BookingId:       b.bookingId,
    InstrumentName:  b.instrumentName,
    AnalysisType:    b.analysisType,
    AnalysisCharges: b.analysisCharges,
    Samples:         b.noOfSamples,
    TotalCharges:    b.totalCharges,
    RequestDate:     new Date(b.bookingRequestDate).toLocaleDateString('en-GB'),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = Array(10).fill({ wpx: 180 });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));
  a.download = 'Booking_Details_report.xlsx';
  a.click();
}


// // ============================================================
// // hooks/useBookings.ts — All API calls & business logic
// // No JSX here. UI components stay 100% pure.
// // ============================================================

// import { useState, useEffect, useCallback } from 'react';
// import { BookingRow, SampleStatus, PaymentProof, UserSession } from './types';

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
// export const SERVER_FILE_URL = 'https://files.lpu.in/umsweb/CIFDocuments/';

// async function postForm(endpoint: string, body: FormData) {
//   const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', body });
//   if (!res.ok) throw new Error(`API error ${res.status}`);
//   return res.json();
// }

// // ============================================================
// // useBookings — list, search, pagination
// // ============================================================
// export function useBookings(userEmail: string) {
//   const [bookings, setBookings]       = useState<BookingRow[]>([]);
//   const [loading, setLoading]         = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   const fetchBookings = useCallback(async () => {
//     if (!userEmail) return;
//     setLoading(true);
//     const startTime = Date.now();
//     try {
//       const fd = new FormData();
//       fd.append('UserEmail', userEmail);
//       const data = await postForm('/api/GetUserAllBookingSlot', fd);
//       setBookings(data?.item1 ?? []);
//     } catch (err) {
//       console.error('fetchBookings:', err);
//     } finally {
//       const elapsed = Date.now() - startTime;
//       setTimeout(() => setLoading(false), Math.max(2500 - elapsed, 0));
//     }
//   }, [userEmail]);

//   useEffect(() => { fetchBookings(); }, [fetchBookings]);

//   const filteredBookings = searchQuery.trim()
//     ? bookings.filter(b =>
//         b.instrumentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         b.analysisType.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : bookings;

//   const totalPages      = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
//   const currentPageData = filteredBookings.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
//   const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
//   const handleItemsPerPageChange = (val: number) => { setItemsPerPage(val); setCurrentPage(1); };

//   return {
//     bookings, loading, searchQuery, setSearchQuery,
//     currentPage, totalPages, currentPageData, itemsPerPage,
//     nextPage, prevPage, handleItemsPerPageChange,
//     refetch: fetchBookings,
//   };
// }

// // ============================================================
// // useSampleStatus
// // ============================================================
// export function useSampleStatus() {
//   const [allSamples, setAllSamples] = useState<SampleStatus[]>([]);

//   useEffect(() => {
//     fetch(`${API_BASE}/api/GetAllSampleStatus`)
//       .then(r => r.json())
//       .then(d => setAllSamples(d?.item1 ?? []))
//       .catch(console.error);
//   }, []);

//   const getSamplesForBooking = (bookingId: number, instrumentId: number) =>
//     allSamples.filter(s => s.bookingId === bookingId && s.instrumentId === instrumentId);

//   return { allSamples, getSamplesForBooking };
// }

// // ============================================================
// // usePaymentProof
// // ============================================================
// export function usePaymentProof(userId: string) {
//   const [proofData, setProofData] = useState<PaymentProof[]>([]);

//   const fetchProof = useCallback(async () => {
//     if (!userId) return;
//     try {
//       const fd = new FormData();
//       fd.append('UserId', userId);
//       const data = await postForm('/api/GetBookingPaymentProofDetails', fd);
//       setProofData(data?.item1 ?? []);
//     } catch (err) {
//       console.error('fetchProof:', err);
//     }
//   }, [userId]);

//   useEffect(() => { fetchProof(); }, [fetchProof]);

//   const hasProofUploaded = (bookingId: number) =>
//     proofData.some(p => String(p.bookingId) === String(bookingId));

//   return { proofData, hasProofUploaded, refetch: fetchProof };
// }

// // ============================================================
// // usePayment — initiate payment gateway redirect
// // ============================================================
// export function usePayment() {
//   const [loading, setLoading] = useState(false);

//   const initiatePayment = async (
//     booking: BookingRow,
//     session: UserSession,
//     responseUrl: string,
//   ) => {
//     setLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append('BookingId',    String(booking.id));
//       fd.append('InstrumentId', String(booking.instrumentId));
//       fd.append('CandidateName', session.candidateName);
//       fd.append('Amount',       String(booking.totalCharges));
//       fd.append('Type',         'CIF');
//       fd.append('UserEmailId',  session.userEmail);
//       fd.append('MobileNo',     session.mobileNo);
//       fd.append('FacultyCode',  session.userEmail);
//       fd.append('ResponseUrl',  responseUrl);
//       const data = await postForm('/api/MakePaymentforTest', fd);
//       const url  = data?.item1?.[0]?.url;
//       if (url) {
//         window.location.href = url;
//       } else {
//         throw new Error('Payment URL not found');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, initiatePayment };
// }

// // ============================================================
// // useReceiptUpload — file selection + upload
// // ============================================================
// export function useReceiptUpload(userId: string) {
//   const [loading, setLoading]     = useState(false);
//   const [fileData, setFileData]   = useState<string | null>(null);
//   const [fileName, setFileName]   = useState('');
//   const [remarks, setRemarks]     = useState('');
//   const [fileChosen, setFileChosen] = useState(false);

//   const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

//   /** Returns an error string on validation failure, null on success */
//   const handleFileSelect = (file: File | null): string | null => {
//     if (!file) return null;
//     if (file.size > MAX_SIZE) return 'File size exceeds 5 MB. Please upload a smaller file.';
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       setFileData((reader.result as string).split(',')[1]);
//       setFileName(file.name);
//       setFileChosen(true);
//     };
//     return null;
//   };

//   const uploadReceipt = async (bookingId: number): Promise<{ returnId: number; message: string }> => {
//     setLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append('BookingId',           String(bookingId));
//       fd.append('ReceiptRemarks',      remarks);
//       fd.append('PaymentReceiptUrl',   fileName);
//       fd.append('PaymentReceiptData',  fileData ?? '');
//       fd.append('UserId',              userId);
//       const data = await postForm('/api/UploadPaymentReceipt', fd);
//       return {
//         returnId: data?.item1?.[0]?.returnId ?? 0,
//         message:  data?.item1?.[0]?.msg       ?? '',
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     setFileData(null); setFileName(''); setRemarks(''); setFileChosen(false);
//   };

//   return { loading, fileData, fileName, remarks, setRemarks, fileChosen, handleFileSelect, uploadReceipt, reset };
// }

// // ============================================================
// // exportBookingsToExcel — lazy-loads xlsx to keep bundle lean
// // ============================================================
// export async function exportBookingsToExcel(bookings: BookingRow[]) {
//   const XLSX = await import('xlsx');
//   const rows = bookings.map(b => ({
//     BookingId:       b.bookingId,
//     InstrumentName:  b.instrumentName,
//     AnalysisType:    b.analysisType,
//     AnalysisCharges: b.analysisCharges,
//     Samples:         b.noOfSamples,
//     TotalCharges:    b.totalCharges,
//     RequestDate:     new Date(b.bookingRequestDate).toLocaleDateString('en-GB'),
//   }));
//   const ws = XLSX.utils.json_to_sheet(rows);
//   ws['!cols'] = Array(10).fill({ wpx: 180 });
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//   const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//   const a    = document.createElement('a');
//   a.href     = URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));
//   a.download = 'Booking_Details_report.xlsx';
//   a.click();
// }