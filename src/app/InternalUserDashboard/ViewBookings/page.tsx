 
'use client';
import { Suspense } from 'react'
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';


import {
  useBookings,
  useSampleStatus,
  usePaymentProof,
  usePayment,
  usePaymentCallback,
  useReceiptUpload,
  exportBookingsToExcel,
  SERVER_FILE_URL,
} from './useBookings';

import {
  FullscreenLoader,
  PageHeader,
  BookingsTable,
  Pagination,
  EmptyState,
  PaymentModal,
  SampleStatusModal,
  ReceiptUploadModal,
} from './ViewBookingsUI';

import { BookingRow, SampleStatus, UserSession } from './types';
import myAppWebService from '@/services/myAppWebService';

// ============================================================
// Read user session from cookie (set by your auth layer)
// ============================================================
function readUserSession(): UserSession | null {
  try {
    const raw = Cookies.get('InternalUserAuthData');
    if (!raw) return null;
    const c = JSON.parse(raw);
    return {
      userEmail:      c.EmailId,
      userRole:       c.userRole?.length > 0 ? c.userRole : 'Internal User',
      mobileNo:       c.MobileNo,
      supervisorName: c.SupervisorName,
      departmentName: c.DepartmentName,
      candidateName:  c.CandidateName,
    };
  } catch {
    return null;
  }
}

 
type ActiveModal =
  | { kind: 'payment'; booking: BookingRow }
  | { kind: 'sample';  samples: SampleStatus[] }
  | { kind: 'receipt'; booking: BookingRow }
  | null;

 
function ViewBookingsContent() {

   const [session, setSession] = useState<UserSession | null>(null);
   const searchParams = useSearchParams();

  useEffect(() => {
    setSession(readUserSession());
  }, []);

  const userEmail = session?.userEmail ?? '';
 
  const webService = useMemo(() => myAppWebService, []);

  // ── Payment-gateway callback (query params on redirect back) ─
  const { callbackStatus } = usePaymentCallback(webService, {
    id:            searchParams.get('id'),
    status:        searchParams.get('status'),
    type:          searchParams.get('type'),
    transactionNo: searchParams.get('transactionNo'),
    hashedValue:   searchParams.get('hashedValue'),
    course:        searchParams.get('Course'),
    keyNote:       searchParams.get('KeyNote'),
  });

  useEffect(() => {
    callbackStatus().then(result => {
      if (result === 'success') {
        Swal.fire({ title: 'Payment Made Successfully', icon: 'success' });
      } else if (result === 'failure') {
        Swal.fire({ title: 'Payment Failed', icon: 'error' });
      }
    });
  }, []);  

  const {
    bookings, loading: bookingsLoading,
    searchQuery, setSearchQuery,
    currentPage, totalPages, currentPageData, itemsPerPage,
    nextPage, prevPage, handleItemsPerPageChange,
  } = useBookings(webService, userEmail);

  const { getSamplesForBooking } = useSampleStatus(webService);

  const { hasProofUploaded, refetch: refetchProof } = usePaymentProof(webService, userEmail);

  const { loading: payLoading, initiatePayment } = usePayment(webService);

  const {
    loading: uploadLoading,
    remarks, setRemarks,
    fileChosen,
    handleFileSelect,
    uploadReceipt,
    reset: resetUpload,
  } = useReceiptUpload(webService, userEmail);

  // ── Modal state ───────────────────────────────────────────
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    resetUpload();
  }, [resetUpload]);

  // ── Action handlers ───────────────────────────────────────
  const handleOpenPaymentModal = (booking: BookingRow) =>
    setActiveModal({ kind: 'payment', booking });

  const handleOpenReceiptModal = (booking: BookingRow) =>
    setActiveModal({ kind: 'receipt', booking });

  const handleGetSampleStatus = (row: BookingRow) => {
    const samples = getSamplesForBooking(row.id, row.instrumentId);
    if (samples.length > 0) {
      setActiveModal({ kind: 'sample', samples });
    } else {
      Swal.fire({
        title: 'No Data Found',
        text:  'No sample status data available for this booking.',
        icon:  'info',
      });
    }
  };

  const handlePay = async (booking: BookingRow) => {
    if (!session) return;
    const responseUrl = `${window.location.origin}${window.location.pathname}`;
    try {
      await initiatePayment(booking, session, responseUrl);
    } catch {
      Swal.fire({ title: 'Error', text: 'Payment Gateway Failed!', icon: 'error' });
    }
  };

  const handleUploadSubmit = async () => {
    if (activeModal?.kind !== 'receipt') return;
    const bookingId = activeModal.booking.bookingId ?? activeModal.booking.id;
    try {
      const { returnId, message } = await uploadReceipt(bookingId);
      closeModal();
      if (returnId === 1) {
        await Swal.fire({ title: 'Upload Successful', text: 'Receipt saved!', icon: 'success' });
        refetchProof();
      } else if (returnId === -1) {
        Swal.fire({ title: 'Already Uploaded', text: message, icon: 'warning' });
      } else {
        Swal.fire({ title: 'Upload Failed', text: message, icon: 'error' });
      }
    } catch {
      Swal.fire({ title: 'Error', text: 'Internal Server Error', icon: 'error' });
    }
  };

  const handleExport       = () => exportBookingsToExcel(bookings);
  const handleDownloadFile = (fileName: string) =>
    window.open(SERVER_FILE_URL + fileName, '_blank');

  // ── Render ────────────────────────────────────────────────
  const isLoading = bookingsLoading || payLoading;

  return (
    <>
      {isLoading && <FullscreenLoader />}

      <div style={{ padding: '1.5rem' }}>
        {!isLoading && bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{
            background: '#fff', borderRadius: '0.5rem', padding: '1.5rem',
            boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)',
          }}>
            <PageHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onExport={handleExport}
              exportDisabled={bookings.length === 0}
            />

            <hr style={{ margin: '1rem 0' }} />

            {currentPageData.length > 0 ? (
              <>
                <BookingsTable
                  rows={currentPageData}
                  hasProofUploaded={hasProofUploaded}
                  onDownloadFile={handleDownloadFile}
                  onOpenPaymentModal={handleOpenPaymentModal}
                  onOpenReceiptModal={handleOpenReceiptModal}
                  onGetSampleStatus={handleGetSampleStatus}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPrev={prevPage}
                  onNext={nextPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </>
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
                No results found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────── */}
      {activeModal?.kind === 'payment' && (
        <PaymentModal
          booking={activeModal.booking}
          loading={payLoading}
          onClose={closeModal}
          onPay={handlePay}
        />
      )}

      {activeModal?.kind === 'sample' && (
        <SampleStatusModal
          samples={activeModal.samples}
          onClose={closeModal}
        />
      )}

      {activeModal?.kind === 'receipt' && (
        <ReceiptUploadModal
          booking={activeModal.booking}
          remarks={remarks}
          fileChosen={fileChosen}
          loading={uploadLoading}
          onClose={closeModal}
          onFileChange={handleFileSelect}
          onRemarksChange={setRemarks}
          onSubmit={handleUploadSubmit}
        />
      )}
    </>
  );
}

export default function ViewBookingsPage() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <ViewBookingsContent />
    </Suspense>
  );
}
