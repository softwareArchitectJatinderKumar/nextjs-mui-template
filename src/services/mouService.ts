// services/mouService.ts
// ─────────────────────────────────────────────────────────────────────────────
// MOU CRUD service — follows the exact same pattern as the Events service
// (EventsCrudOperation in myappwebService).
//
// Pattern:
//   1. prepareFormData()  — builds FormData for the .NET [FromForm] endpoint
//   2. mouCrudOperation() — generic axios POST to CIFMOUCrudOperation
//   3. Named helpers      — getMous(), createMou(), updateMou(), deleteMou()…
//
// NO Next.js /api/route.ts proxy used.
// Axios calls the .NET backend directly — same as EventsCrudOperation does.
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';
import {
  MouInsertPayload,
  MouUpdatePayload,
  MouDeletePayload,
  MouApprovePayload,
  MouApiResponse,
  MouViewResponse,
} from '../types/mou.types';

// ─── Axios client (matches apiClient in myappwebService) ─────────────────────

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://localhost:7125',
});

// ─── Auth token helper (mirrors storageService.getUser()) ────────────────────
// Swap this with your real token source: localStorage, cookie, NextAuth session…

function getAuthToken(): string {
  return process.env.NEXT_PUBLIC_AUTH_TOKEN ?? '';
}

// ─────────────────────────────────────────────────────────────────────────────
// prepareFormData
// Mirrors the Angular prepareFormData() helper in the Events service.
// Builds FormData whose field names exactly match the .NET [FromForm] model.
// ─────────────────────────────────────────────────────────────────────────────

type MouAction = 'Insert' | 'Update' | 'Delete' | 'View' | 'ViewAll' | 'Approve' | 'DisApprove';

type AnyMouPayload =
  Partial<MouInsertPayload & MouUpdatePayload & MouDeletePayload & MouApprovePayload>;

function prepareFormData(payload: AnyMouPayload, action: MouAction): FormData {
  const fd = new FormData();

  // ── Always present ────────────────────────────────────────────────────────
  fd.append('Action', action);

  // ── MouId — Update / Delete / Approve / DisApprove ───────────────────────
  if (payload?.mouId) fd.append('MouId', payload.mouId);

  // ── Insert + Update fields ────────────────────────────────────────────────
  if (action === 'Insert' || action === 'Update') {
    if (payload.mouTitle)        fd.append('MOUTitle',        payload.mouTitle);
    if (payload.mouDocumentData) fd.append('MOUDocumentData', payload.mouDocumentData);
    if (payload.mouDocumentUrl)  fd.append('MOUDocumentUrl',  payload.mouDocumentUrl);
    if (payload.mouStartDate)    fd.append('MouStartDate',    payload.mouStartDate);
    if (payload.mouEndDate)      fd.append('MouEndDate',      payload.mouEndDate);
                                 fd.append('MOURemarks',      payload.mouRemarks ?? '');
  }

  // ── UserId — Insert / Update / Delete / Approve / DisApprove ─────────────
  if (payload.userId) fd.append('UserId', payload.userId);

  // ── LoginName — Update / Delete / Approve / DisApprove ───────────────────
  if (payload.loginName) fd.append('LoginName', payload.loginName);

  // ── Delete: title also needed ─────────────────────────────────────────────
  if (action === 'Delete' && payload.mouTitle) {
    fd.append('MOUTitle', payload.mouTitle);
  }

  // ── Approve / DisApprove extras ───────────────────────────────────────────
  if ((action === 'Approve' || action === 'DisApprove') && payload.approvalRemarks) {
    fd.append('ApprovalRemarks', payload.approvalRemarks);
  }

  return fd;
}

// ─────────────────────────────────────────────────────────────────────────────
// mouCrudOperation  (generic — mirrors EventsCrudOperation)
// Direct axios POST to the .NET backend with Bearer auth.
// axios automatically sets Content-Type: multipart/form-data + boundary.
// ─────────────────────────────────────────────────────────────────────────────

async function mouCrudOperation<T>(formData: FormData): Promise<T> {
  const response = await apiClient.post<T>(
    'api/LpuCIF/CIFMOUCrudOperation',
    formData,
    {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type':  'multipart/form-data',
      },
    },
  );
  return response.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Named service methods — mirror getEvents / createEvent / updateEvent / etc.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch MOUs for a specific user.
 * Mirrors: getEvents() / viewMyMous()
 */
export async function getMous(userId: string): Promise<MouViewResponse> {
  const fd = prepareFormData({ userId }, 'View');
  try {
    return await mouCrudOperation<MouViewResponse>(fd);
  } catch (error) {
    console.error('Error fetching MOUs:', error);
    throw error;
  }
}

/**
 * Fetch all MOUs (Admin).
 * Mirrors: viewAllMous()
 */
export async function getAllMous(): Promise<MouViewResponse> {
  const fd = prepareFormData({}, 'ViewAll');
  try {
    return await mouCrudOperation<MouViewResponse>(fd);
  } catch (error) {
    console.error('Error fetching all MOUs:', error);
    throw error;
  }
}

/**
 * Insert a new MOU (Simple User).
 * Mirrors: createEvent() / insertMou()
 */
export async function createMou(payload: MouInsertPayload): Promise<MouApiResponse> {
  const fd = prepareFormData(payload, 'Insert');
  try {
    return await mouCrudOperation<MouApiResponse>(fd);
  } catch (error) {
    console.error('MOU creation failed:', error);
    throw error;
  }
}

/**
 * Update an existing MOU (Simple User).
 * Mirrors: updateEvent() / updateMou()
 */
export async function updateMou(payload: MouUpdatePayload): Promise<MouApiResponse> {
  const fd = prepareFormData(payload, 'Update');
  try {
    return await mouCrudOperation<MouApiResponse>(fd);
  } catch (error) {
    console.error('MOU update failed:', error);
    throw error;
  }
}

/**
 * Delete / deactivate an MOU.
 * Mirrors: deleteEvent() / deleteMou()
 */
export async function deleteMou(payload: MouDeletePayload): Promise<MouApiResponse> {
  const fd = prepareFormData(payload, 'Delete');
  try {
    return await mouCrudOperation<MouApiResponse>(fd);
  } catch (error) {
    console.error('MOU deletion failed:', error);
    throw error;
  }
}

/**
 * Approve an MOU (Admin).
 */
export async function approveMou(payload: MouApprovePayload): Promise<MouApiResponse> {
  const fd = prepareFormData(payload, 'Approve');
  try {
    return await mouCrudOperation<MouApiResponse>(fd);
  } catch (error) {
    console.error('MOU approval failed:', error);
    throw error;
  }
}

/**
 * Disapprove an MOU (Admin).
 */
export async function disapproveMou(payload: MouApprovePayload): Promise<MouApiResponse> {
  const fd = prepareFormData(payload, 'DisApprove');
  try {
    return await mouCrudOperation<MouApiResponse>(fd);
  } catch (error) {
    console.error('MOU disapproval failed:', error);
    throw error;
  }
}

// // services/mouService.ts - FormData Pattern (v2)
// import myAppWebService from './myAppWebService';
// import type { MouInsertPayload, MouUpdatePayload, MouViewResponse, MouApiResponse } from '../types/mou.types';

// const ENDPOINT = 'api/LpuCIF/CIFMOUCrudOperation';

// // ─── MOU Model ────────────────────────────────────────────────────────────────
// interface MouModel {
//   mouId?: string;
//   mouTitle: string;
//   mouDocumentData: string;
//   mouDocumentUrl: string;
//   mouStartDate: string;
//   mouEndDate: string;
//   mouRemarks: string;
//   userId?: string;
//   loginName?: string;
// }

// // ─── FormData Builder (like prepareFormData in myAppWebService) ───────────────
// function prepareFormData(model: MouModel, action: 'Insert' | 'Update' | 'View'): FormData {
//   const formData = new FormData();
//   formData.append('Action', action);
  
//   if (model.mouId) formData.append('MouId', model.mouId);
//   if (action !== 'View') {
//     formData.append('MOUTitle', model.mouTitle);
//     formData.append('MOUDocumentData', model.mouDocumentData);
//     formData.append('MOUDocumentUrl', model.mouDocumentUrl);
//     formData.append('MouStartDate', model.mouStartDate);
//     formData.append('MouEndDate', model.mouEndDate);
//     formData.append('MOURemarks', model.mouRemarks);
//     if (model.userId) formData.append('UserId', model.userId);
//     if (model.loginName) formData.append('LoginName', model.loginName);
//   }
  
//   return formData;
// }

// // ─── CRUD Functions (FormData + apiClient like Events) ────────────────────────
// export async function insertMou(payload: MouInsertPayload): Promise<MouApiResponse> {
//   const model: MouModel = {
//     mouTitle: payload.mouTitle || '',
//     mouDocumentData: payload.mouDocumentData || '',
//     mouDocumentUrl: payload.mouDocumentUrl || '',
//     mouStartDate: payload.mouStartDate || '',
//     mouEndDate: payload.mouEndDate || '',
//     mouRemarks: payload.mouRemarks || '',
//     userId: payload.userId || '',
//   };
//   const formData = prepareFormData(model, 'Insert');
//   return myAppWebService.apiClient.post(ENDPOINT, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }).then((res: any) => res.data);
// }

// export async function updateMou(payload: MouUpdatePayload): Promise<MouApiResponse> {
//   const model: MouModel = {
//     mouId: payload.mouId,
//     mouTitle: payload.mouTitle || '',
//     mouDocumentData: payload.mouDocumentData || '',
//     mouDocumentUrl: payload.mouDocumentUrl || '',
//     mouStartDate: payload.mouStartDate || '',
//     mouEndDate: payload.mouEndDate || '',
//     mouRemarks: payload.mouRemarks || '',
//     loginName: payload.loginName || '',
//     userId: payload.userId || '',
//   };
//   const formData = prepareFormData(model, 'Update');
//   return myAppWebService.apiClient.post(ENDPOINT, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }).then((res: any) => res.data);
// }

// export async function viewMyMous(userId: string): Promise<MouViewResponse> {
//   const model: MouModel = {
//     mouTitle: '',
//     mouDocumentData: '',
//     mouDocumentUrl: '',
//     mouStartDate: '',
//     mouEndDate: '',
//     mouRemarks: '',
//     userId: userId,
//   };
//   const formData = prepareFormData(model, 'View');
//   return myAppWebService.apiClient.post(ENDPOINT, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }).then((res: any) => res.data);
// }

// // Download (existing pattern kept)
// export async function downloadMouFile(fileName: string): Promise<Blob> {
//   return myAppWebService.downloadFile(fileName);
// }

