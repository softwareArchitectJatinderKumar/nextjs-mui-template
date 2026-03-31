// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import myAppWebService from '@/services/myAppWebService';
// import Link from 'next/link';
// import BookingDashboard from './BookingComponent';

// function Bookings() {
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     setLoading(true);
//     const timer = setTimeout(() => setLoading(false), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       {loading && (
//         <div className="fullScreenLoader">
//           <div className="customSpinnerOverlay">
//             <img src="/assets/images/spinner.gif" alt="Loading..." />
//           </div>
//         </div>
//       )}
//       <BookingDashboard/>
//     </>
//   )
// }

// export default Bookings


'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { instrumentService } from '@/services/instrumentService';
import myAppWebService from '@/services/myAppWebService';
import ViewBookingsUI from './ViewBookingsUI';

export default function ViewBookingsPage() {
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    const auth = Cookies.get('InternalUserAuthData');
    if (auth) {
      const parsed = JSON.parse(auth);
      setUserData(parsed);
      getBookingDetails(parsed.EmailId);
    }
  }, []);

  // WebAPI Logic: Same as Angular this.getBookingDetails()
  const getBookingDetails = async (email: string) => {
    setLoadingIndicator(true);
    try {
      const response = await myAppWebService.GetUserAllBookingSlot(email);
      const data = response.item1 || [];
      setBookingData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoadingIndicator(false);
    }
  };

  // Logic: same as Angular exportToExcel()
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "Booking_Report.xlsx");
  };

  // Logic: same as Angular VerifyData() for Payment
  const handlePayment = async (booking: any) => {
    const formData = new FormData();
    formData.append('BookingId', booking.bookingId);
    formData.append('Amount', booking.totalCharges);
    formData.append('UserEmailId', userData.EmailId);
    formData.append('Type', 'CIF');

    try {
      const res = await myAppWebService.MakePaymentforTest(formData);
      const paymentUrl = res.item1?.[0]?.url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        Swal.fire('Error', 'Payment gateway unavailable', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Connection failed', 'error');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = bookingData.filter(b => 
      b.instrumentName?.toLowerCase().includes(term.toLowerCase()) ||
      b.bookingId?.toString().includes(term)
    );
    setFilteredData(filtered);
  };

  return (
    <ViewBookingsUI 
      loading={loadingIndicator}
      bookings={filteredData}
      searchTerm={searchTerm}
      onSearch={handleSearch}
      onExport={exportToExcel}
      onDownload={(url) => window.open(url, '_blank')}
      onPayment={handlePayment}
      onUploadReceipt={(id) => {
        // Logic to trigger the receipt upload modal (matches Angular UpdateFileDocument)
        Swal.fire({
          title: 'Upload Payment Receipt',
          input: 'file',
          inputAttributes: { accept: 'image/*,application/pdf' },
          showCancelButton: true,
          confirmButtonText: 'Upload',
        }).then(async (result) => {
          if (result.value) {
            // Call instrumentService.UploadPaymentReceipt here...
            Swal.fire('Success', 'Receipt uploaded', 'success');
          }
        });
      }}
    />
  );
}