// ============================================================
// types.ts — Shared TypeScript interfaces for ViewBookings
// ============================================================

export interface BookingRow {
  id: number;
  bookingId: number;
  instrumentId: number;
  instrumentName: string;
  analysisId: number;
  analysisType: string;
  analysisCharges: number;
  noOfSamples: number;
  totalCharges: number;
  bookingRequestDate: string;
  fileName?: string;
  paymentDate?: string;
  remarks?: string;
}

export interface SampleStatus {
  bookingId: number;
  instrumentId: number;
  sampleCondition: string;
  receivedOn: string;
}

export interface PaymentProof {
  bookingId: number;
  receiptUrl?: string;
}

export interface UserSession {
  userEmail: string;
  userRole: string;
  mobileNo: string;
  supervisorName: string;
  departmentName: string;
  candidateName: string;
}