// ============================================================
// components/ViewBookingsUI.tsx — Pure UI components
// No API calls. All data via props, all actions via callbacks.
// ============================================================
'use client';

import React, { useState } from 'react';
import styles from './ViewBookings.module.css';
import { BookingRow, SampleStatus } from './types';

// ── Formatters ────────────────────────────────────────────
const inr = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val ?? 0);

const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('en-GB') : '—';

export function FullscreenLoader() {
  return (
    <div className={styles.fullscreenLoader}>
      <div className={styles.spinnerContent}>
        <img src="/assets/images/spinner.gif" alt="Loading..." />
      </div>
    </div>
     
  );
}

interface PageHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onExport: () => void;
  exportDisabled: boolean;
}

export function PageHeader({
  searchQuery, onSearchChange, onExport, exportDisabled,
}: PageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <button
        className={`${styles.btn} ${styles.btnDark}`}
        onClick={onExport}
        disabled={exportDisabled}
      >
        📊 Export to Excel
      </button>

      <h3 className={styles.pageTitle}>Payment and Booking Details</h3>

      <input
        type="text"
        className={`${styles.formControl} ${styles.searchBox}`}
        placeholder="Search…"
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        aria-label="Search bookings"
      />
    </div>
  );
}

// ============================================================
// BookingsTable — main data table
// ============================================================
interface BookingsTableProps {
  rows: BookingRow[];
  hasProofUploaded: (id: number) => boolean;
  onDownloadFile: (fileName: string) => void;
  onOpenPaymentModal: (row: BookingRow) => void;
  onOpenReceiptModal: (row: BookingRow) => void;
  onGetSampleStatus: (row: BookingRow) => void;
}

export function BookingsTable({
  rows, hasProofUploaded, onDownloadFile,
  onOpenPaymentModal, onOpenReceiptModal, onGetSampleStatus,
}: BookingsTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.bookingsTable}>
        <thead>
          <tr>
            <th>Booking Id</th>
            <th>Instrument Name</th>
            <th>Analysis Type</th>
            <th>Analysis Charges</th>
            <th>No. of Samples</th>
            <th>Request Date</th>
            <th>Request Sheet</th>
            <th>Total Charges</th>
            <th>Payment Status</th>
            <th>Upload Receipt</th>
            <th>Sample Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className={styles.fadeIn}>
              <td style={{ fontWeight: 600 }}>{row.id}</td>
              <td style={{ fontWeight: 600 }}>{row.instrumentName}</td>
              <td>{row.analysisType}</td>
              <td>{inr(row.analysisCharges)}</td>
              <td>{row.noOfSamples}</td>
              <td>{fmtDate(row.bookingRequestDate)}</td>

              {/* Request Sheet */}
              <td>
                {row.fileName
                  ? (
                    <button
                      className={`${styles.btn} ${styles.btnDark} ${styles.btnSm}`}
                      onClick={() => onDownloadFile(row.fileName!)}
                    >
                      👁 View
                    </button>
                  ) : (
                    <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>No Sheet</span>
                  )}
              </td>

              <td style={{ fontWeight: 600 }}>{inr(row.totalCharges)}</td>

              {/* Payment Status */}
              <td>
                {row.paymentDate
                  ? (
                    <span className={`${styles.badge} ${styles.badgeDark}`}>
                      Paid: {row.paymentDate}
                    </span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span className={`${styles.badge} ${styles.badgeDanger}`}>
                        Payment Pending
                      </span>
                      <button
                        className={`${styles.btn} ${styles.btnWarning} ${styles.btnSm}`}
                        onClick={() => onOpenPaymentModal(row)}
                      >
                        💳 Pay Now
                      </button>
                    </div>
                  )}
              </td>

              {/* Upload Receipt */}
              <td>
                {hasProofUploaded(row.id)
                  ? (
                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                      ✓ Uploaded
                    </span>
                  ) : (
                    <button
                      className={`${styles.btn} ${styles.btnDark} ${styles.btnSm}`}
                      onClick={() => onOpenReceiptModal(row)}
                    >
                      ⬆ Upload
                    </button>
                  )}
              </td>

              {/* Sample Status */}
              <td>
                <button
                  className={`${styles.btn} ${styles.btnDark} ${styles.btnSm}`}
                  onClick={() => onGetSampleStatus(row)}
                >
                  ✓ Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// Pagination
// ============================================================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  itemsPerPageOptions?: number[];
  onPrev: () => void;
  onNext: () => void;
  onItemsPerPageChange: (val: number) => void;
}

export function Pagination({
  currentPage, totalPages, itemsPerPage,
  itemsPerPageOptions = [5, 10, 15, 20, 25],
  onPrev, onNext, onItemsPerPageChange,
}: PaginationProps) {
  return (
    <div className={styles.paginationBar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Records per page:</span>
        <select
          className={styles.perPageSelect}
          value={itemsPerPage}
          onChange={e => onItemsPerPageChange(Number(e.target.value))}
        >
          {itemsPerPageOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <nav className={styles.paginationNav} aria-label="Table pagination">
        <button
          className={`${styles.pageLink} ${currentPage === 1 ? styles.pageLinkDisabled : ''}`}
          onClick={onPrev}
          disabled={currentPage === 1}
        >
          ‹ Prev
        </button>
        <span className={styles.pageInfo}>
          <span style={{ color: '#dc3545', fontWeight: 700 }}>{currentPage}</span>
          {' / '}{totalPages}
        </span>
        <button
          className={`${styles.pageLink} ${currentPage === totalPages ? styles.pageLinkDisabled : ''}`}
          onClick={onNext}
          disabled={currentPage === totalPages}
        >
          Next ›
        </button>
      </nav>
    </div>
  );
}

// ============================================================
// EmptyState
// ============================================================
export function EmptyState({ message = 'No Bookings Found.' }: { message?: string }) {
  return (
    <div className={styles.noDataCard}>
      <h3 className={styles.noDataTitle}>My Bookings</h3>
      <hr />
      <p className={styles.noDataText}>{message}</p>
    </div>
  );
}

// ============================================================
// Modal — generic wrapper
// ============================================================
interface ModalProps {
  title: string;
  size?: 'sm' | 'lg';
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, size, onClose, children }: ModalProps) {
  const dialogClass = [
    styles.modalDialog,
    size === 'sm' ? styles.modalDialogSm : '',
    size === 'lg' ? styles.modalDialogLg : '',
  ].join(' ');

  return (
    <div
      className={styles.modalOverlay}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={dialogClass}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>{title}</h5>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// PaymentModal — confirm booking details & pay
// ============================================================
interface PaymentModalProps {
  booking: BookingRow;
  loading: boolean;
  onClose: () => void;
  onPay: (booking: BookingRow) => void;
}

export function PaymentModal({ booking, loading, onClose, onPay }: PaymentModalProps) {
  return (
    <Modal title="Payment Screen" size="sm" onClose={onClose}>
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.inlineTable}>
          <thead>
            <tr>
              {['Booking Id', 'Instrument', 'Analysis', 'Samples', 'Amount', 'Action'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{booking.id}</td>
              <td>{booking.instrumentName}</td>
              <td>{booking.analysisType}</td>
              <td>{booking.noOfSamples}</td>
              <td>{inr(booking.totalCharges)}</td>
              <td>
                <button
                  className={`${styles.btn} ${styles.btnWarning}`}
                  onClick={() => onPay(booking)}
                  disabled={loading}
                >
                  {loading ? 'Processing…' : '💳 Pay'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

// ============================================================
// SampleStatusModal
// ============================================================
interface SampleStatusModalProps {
  samples: SampleStatus[];
  onClose: () => void;
}

export function SampleStatusModal({ samples, onClose }: SampleStatusModalProps) {
  return (
    <Modal title="Sample Status" size="sm" onClose={onClose}>
      {samples.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.inlineTable}>
            <thead>
              <tr>
                {['Booking Id', 'Instrument Id', 'Sample Condition', 'Received On'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{samples[0].bookingId}</td>
                <td>{samples[0].instrumentId}</td>
                <td>{samples[0].sampleCondition}</td>
                <td>{samples[0].receivedOn}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#ef7d00', fontWeight: 700, fontSize: '1.1rem' }}>
            No Status Updates Found
          </p>
        </div>
      )}
    </Modal>
  );
}

// ============================================================
// ReceiptUploadModal
// ============================================================
interface ReceiptUploadModalProps {
  booking: BookingRow;
  remarks: string;
  fileChosen: boolean;
  loading: boolean;
  onClose: () => void;
  onFileChange: (file: File | null) => string | null;
  onRemarksChange: (val: string) => void;
  onSubmit: () => void;
}

export function ReceiptUploadModal({
  booking, remarks, fileChosen, loading,
  onClose, onFileChange, onRemarksChange, onSubmit,
}: ReceiptUploadModalProps) {
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    const err  = onFileChange(file);
    setFileError(err);
  };

  return (
    <Modal title="Payment Receipt Upload" size="lg" onClose={onClose}>
      <div className={styles.formGrid}>
        {/* Booking ID */}
        <div>
          <label className={styles.formLabel}>Booking ID</label>
          <p className={styles.formPlaintext}>{booking.bookingId ?? booking.id}</p>
        </div>

        {/* Payment Amount */}
        <div>
          <label className={styles.formLabel}>Payment Amount</label>
          <p className={styles.formPlaintext}>{inr(booking.totalCharges)}</p>
        </div>

        {/* File upload */}
        <div>
          <label className={styles.formLabel} htmlFor="paymentReceiptFile">
            Payment Receipt File
          </label>
          <input
            id="paymentReceiptFile"
            type="file"
            className={styles.formControl}
            accept=".pdf,.jpg,.jpeg,.png,.zip,.rar,.7z"
            onChange={handleFileInput}
          />
          {fileError && <span className={styles.formError}>{fileError}</span>}
          <span className={styles.formText}>Maximum file size: 5 MB</span>
        </div>

        {/* Remarks */}
        <div>
          <label className={styles.formLabel} htmlFor="receiptRemarks">
            Comments / Remarks
          </label>
          <input
            id="receiptRemarks"
            type="text"
            className={styles.formControl}
            value={remarks}
            onChange={e => onRemarksChange(e.target.value)}
            placeholder="Enter remarks…"
          />
        </div>
      </div>

      {/* Submit */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={!fileChosen || loading}
          onClick={onSubmit}
        >
          {loading ? 'Uploading…' : '⬆ Upload Receipt'}
        </button>
      </div>
    </Modal>
  );
}

// import React from 'react';
// import { 
//   FileSpreadsheet, Download, Upload, CreditCard, 
//   Search, Filter, ExternalLink, AlertCircle 
// } from 'lucide-react';

// interface ViewBookingsUIProps {
//   loading: boolean;
//   bookings: any[];
//   searchTerm: string;
//   onSearch: (term: string) => void;
//   onExport: () => void;
//   onDownload: (url: string) => void;
//   onPayment: (booking: any) => void;
//   onUploadReceipt: (bookingId: string) => void;
// }

// const ViewBookingsUI: React.FC<ViewBookingsUIProps> = ({
//   loading, bookings, searchTerm, onSearch, onExport, onDownload, onPayment, onUploadReceipt
// }) => {
//   return (
//     <div className="max-w-7xl mx-auto p-4 md:p-8 min-vh-100 bg-gray-50">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Payment & Booking Details</h1>
//           <p className="text-gray-500 text-sm">Manage your instrument bookings and track payment status.</p>
//         </div>
//         <div className="flex gap-2">
//           <button 
//             onClick={onExport}
//             className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all text-sm font-medium"
//           >
//             <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel
//           </button>
//         </div>
//       </div>

//       {/* Filters & Search */}
//       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input 
//             type="text"
//             placeholder="Search by Instrument or Booking ID..."
//             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//             value={searchTerm}
//             onChange={(e) => onSearch(e.target.value)}
//           />
//         </div>
//         <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
//           <Filter className="w-4 h-4 mr-2" /> Filter
//         </button>
//       </div>

//       {/* Table Section */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-50/50 text-gray-600 text-xs font-bold uppercase tracking-wider">
//                 <th className="px-6 py-4">Booking Info</th>
//                 <th className="px-6 py-4">Instrument / Analysis</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Amount</th>
//                 <th className="px-6 py-4 text-center">Actions</th>
//                 <th className="px-6 py-4 text-center">Actions</th>
//                 <th className="px-6 py-4 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {bookings.length > 0 ? bookings.map((item) => (
//                 <tr key={item.bookingId} className="hover:bg-blue-50/30 transition-colors">
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-bold text-gray-900">#{item.bookingId}</div>
//                     <div className="text-xs text-gray-500">{item.bookingDate}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium text-gray-800">{item.instrumentName}</div>
//                     <div className="text-xs text-gray-500">{item.analysisType}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
//                       item.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
//                     }`}>
//                       {item.paymentStatus || 'Pending'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 font-bold text-gray-900 text-sm">₹{item.totalCharges}</td>
//                   <td className="px-6 py-4">
//                     {/* <div className="flex justify-between gap-2"> */}
//                       <button 
//                         onClick={() => onDownload(item.filePath)}
//                         className="p-2 btn btn-dark text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="Download Document"
//                       >
//                         <Download className="w-4 h-4" />
//                       </button>
//                     </td>
//                     <td>
//                       {item.paymentStatus !== 'Paid' && (
//                         <button 
//                           onClick={() => onPayment(item)}
//                           className="p-2 btn btn-dark text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                           title="Pay Now"
//                         >
//                           <CreditCard className="w-4 h-4" />
//                         </button>
//                       )}
//                       </td>
//                       <td>
//                       <button 
//                         onClick={() => onUploadReceipt(item.bookingId)}
//                         className="btn btn-dark p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
//                         title="Upload Receipt"
//                       >
//                         <Upload className="w-4 h-4" />
//                       </button>
//                     </td>
//                 </tr>
//               )) : (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
//                     <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
//                     No bookings found matching your criteria.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewBookingsUI;