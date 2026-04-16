// ─── MOU Types — used by myAppWebService & MouPage ──────────────────────────

export interface MouRecord {
  mouId?: string;
  mouTitle: string;
  mouStartDate: string;
  mouEndDate: string;
  mouStatus: string | null;
  mouRemarks: string;
  isApproved: string | null;   // 'True' | 'False' | 'NA'
  isActive: string | null;
  userEmailId: string;
  createdOn: string;
  userName: string;
  userRole: string | null;
  userType: string;
  mouDocumentUrl?: string;
}

export interface MouInsertPayload {
  mouTitle: string;
  mouDocumentUrl?: string;
  mouDocumentData?: string;
  mouStartDate: string;
  mouEndDate: string;
  mouRemarks?: string;
  userId: string;
}

export interface MouUpdatePayload {
  mouId: string;
  mouTitle?: string;
  mouDocumentData: string;
  mouDocumentUrl: string;
  mouStartDate?: string;
  mouEndDate: string;
  mouRemarks?: string;
  loginName: string;
  userId: string;
}

export interface MouDeletePayload {
  mouId: string;
  mouTitle: string;
  userId: string;
  loginName: string;
}

export interface MouApprovePayload {
  mouId: string;
  userId: string;
  approvalRemarks?: string;
  loginName: string;
}

export interface MouApiResponse {
  item1: { msg: string; returnId: string | number }[];
}

export interface MouViewResponse {
  item1: MouRecord[];
}

// // ─── MOU Domain Types ─────────────────────────────────────────────────────────
// // Mirrors the interfaces from the Angular mou-crud-operation.service.ts

// export interface MouRecord {
//   mouId?: any;
//   mouTitle: any;
//   mouStartDate: any;
//   mouEndDate: any;
//   mouStatus: string | number;
//   mouRemarks: any;
//   isApproved: any; // 'True' | 'False' | 'NA'
//   isActive: string | number;
//   userEmailId: any;
//   createdOn: any;
//   userName: any;
//   userRole: any;
//   userType: any;
//   mouDocumentUrl?: any;
// }

// // ─── API Payload Shapes ───────────────────────────────────────────────────────

// export interface MouInsertPayload {
//   action: 'Insert';
//   mouTitle: any;
//   mouDocumentUrl?: any;
//   mouDocumentData?: any;
//   mouStartDate: any;
//   mouEndDate: any;
//   mouRemarks?: any;
//   userId: any;
// }

// export interface MouUpdatePayload {
//   action: 'Update';
//   mouId: any;
//   mouTitle?: any;
//   mouDocumentData: any;
//   mouDocumentUrl: any;
//   mouStartDate?: any;
//   mouEndDate: any;
//   mouRemarks?: any;
//   loginName: any;
//   userId: any;
// }

// export interface MouDeletePayload {
//   action: 'Delete';
//   mouId: any;
//   mouTitle: any;
//   userId: any;
//   loginName: any;
// }

// export interface MouApprovePayload {
//   action: 'Approve' | 'DisApprove';
//   mouId: any;
//   userId: any;
//   approvalRemarks?: any;
//   loginName: any;
// }

// // ─── API Response Shapes ──────────────────────────────────────────────────────

// export interface MouApiResponse {
//   item1: { msg: any; returnId: string | number }[];
// }

// export interface MouViewResponse {
//   item1: MouRecord[];
// }

// // ─── UI-level form state ──────────────────────────────────────────────────────

// export interface MouFormState {
//   mouId: any;
//   mouTitle: any;
//   mouStartDate: any;
//   mouEndDate: any;
//   mouRemarks: any;
// }

// export interface MouFormErrors {
//   mouTitle?: any;
//   mouStartDate?: any;
//   mouEndDate?: any;
// }

// export type FormMode = 'create' | 'edit' | null;

// // // ─── MOU Domain Types ─────────────────────────────────────────────────────────
// // // Mirrors the interfaces from the Angular mou-crud-operation.service.ts

// // export interface MouRecord {
// //   mouId?: any;
// //   mouTitle: any;
// //   mouStartDate: any;
// //   mouEndDate: any;
// //   mouStatus: string | number;
// //   mouRemarks: any;
// //   isApproved: any; // 'True' | 'False' | 'NA'
// //   isActive: string | number;
// //   userEmailId: any;
// //   createdOn: any;
// //   userName: any;
// //   userRole: any;
// //   userType: any;
// //   mouDocumentUrl?: any;
// // }

// // // ─── API Payload Shapes ───────────────────────────────────────────────────────

// // export interface MouInsertPayload {
// //   action: 'Insert';
// //   mouTitle: any;
// //   mouDocumentUrl?: any;
// //   mouDocumentData?: any;
// //   mouStartDate: any;
// //   mouEndDate: any;
// //   mouRemarks?: any;
// //   userId: any;
// // }

// // export interface MouUpdatePayload {
// //   action: 'Update';
// //   mouId: any;
// //   mouTitle?: any;
// //   mouDocumentData: any;
// //   mouDocumentUrl: any;
// //   mouStartDate?: any;
// //   mouEndDate: any;
// //   mouRemarks?: any;
// //   loginName: any;
// //   userId: any;
// // }

// // export interface MouDeletePayload {
// //   action: 'Delete';
// //   mouId: any;
// //   mouTitle: any;
// //   userId: any;
// //   loginName: any;
// // }

// // export interface MouApprovePayload {
// //   action: 'Approve' | 'DisApprove';
// //   mouId: any;
// //   userId: any;
// //   approvalRemarks?: any;
// //   loginName: any;
// // }

// // // ─── API Response Shapes ──────────────────────────────────────────────────────

// // export interface MouApiResponse {
// //   item1: { msg: any; returnId: string | number }[];
// // }

// // export interface MouViewResponse {
// //   item1: MouRecord[];
// // }

// // // ─── UI-level form state ──────────────────────────────────────────────────────

// // export interface MouFormState {
// //   mouId: any;
// //   mouTitle: any;
// //   mouStartDate: any;
// //   mouEndDate: any;
// //   mouRemarks: any;
// // }

// // export interface MouFormErrors {
// //   mouTitle?: any;
// //   mouStartDate?: any;
// //   mouEndDate?: any;
// // }

// // export type FormMode = 'create' | 'edit' | null;
