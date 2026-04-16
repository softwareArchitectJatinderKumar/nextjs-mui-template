// app/api/mou/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Next.js Route Handler that proxies requests to the .NET backend.
// Mirrors the Angular MOUCrudOperation service (mou-crud-operation.service.ts)
//
// All actions (Insert / Update / Delete / View / ViewAll / Approve / DisApprove)
// are routed through a single POST endpoint, exactly as the Angular service does
// via CIFMOUCrudOperation.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';

// ── Configuration ─────────────────────────────────────────────────────────────
const BASE_URL   = process.env.MOU_API_BASE_URL  ?? 'https://localhost:7125/api/LpuCIF';
const AUTH_TOKEN = process.env.MOU_AUTH_TOKEN    ?? '123Asdad3314fsdfI';
const ENDPOINT   = `${BASE_URL}/CIFMOUCrudOperation`;

// ─────────────────────────────────────────────────────────────────────────────

function buildFormData(fields: Record<string, string | undefined | null>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null && value !== '') {
      fd.append(key, value);
    }
  }
  return fd;
}

async function callBackend(fd: FormData) {
  const res = await fetch(ENDPOINT, {
    method:  'POST',
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    body:    fd,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/mou
// Body (JSON): { action, ...fields }
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...rest } = body as { action: string; [key: string]: string };

    let fd: FormData;

    switch (action) {

      // ── Insert (user submits new MOU) ──────────────────────────────────────
      case 'Insert':
        fd = buildFormData({
          Action:          'Insert',
          MOUTitle:        rest.mouTitle,
          MOUDocumentUrl:  rest.mouDocumentUrl,
          MOUDocumentData: rest.mouDocumentData,
          MouStartDate:    rest.mouStartDate,
          MouEndDate:      rest.mouEndDate,
          MOURemarks:      rest.mouRemarks,
          UserId:          rest.userId,
        });
        break;

      // ── Update (user edits existing MOU) ──────────────────────────────────
      case 'Update':
        fd = buildFormData({
          Action:          'Update',
          MouId:           rest.mouId,
          MOUTitle:        rest.mouTitle,
          MOUDocumentData: rest.mouDocumentData,
          MOUDocumentUrl:  rest.mouDocumentUrl,
          MouStartDate:    rest.mouStartDate,
          MouEndDate:      rest.mouEndDate,
          MOURemarks:      rest.mouRemarks,
          LoginName:       rest.loginName,
          UserId:          rest.userId,
        });
        break;

      // ── Delete (admin removes MOU) ─────────────────────────────────────────
      case 'Delete':
        fd = buildFormData({
          Action:    'Delete',
          MouId:     rest.mouId,
          MOUTitle:  rest.mouTitle,
          UserId:    rest.userId,
          LoginName: rest.loginName,
        });
        break;

      // ── View user's own MOUs ───────────────────────────────────────────────
      case 'View':
        fd = buildFormData({
          Action: 'View',
          UserId: rest.userId,
        });
        break;

      // ── View all MOUs (admin) ──────────────────────────────────────────────
      case 'ViewAll':
        fd = buildFormData({ Action: 'ViewAll' });
        break;

      // ── Approve (admin) ────────────────────────────────────────────────────
      case 'Approve':
        fd = buildFormData({
          Action:          'Approve',
          MouId:           rest.mouId,
          UserId:          rest.userId,
          ApprovalRemarks: rest.approvalRemarks,
          LoginName:       rest.loginName,
        });
        break;

      // ── DisApprove (admin) ─────────────────────────────────────────────────
      case 'DisApprove':
        fd = buildFormData({
          Action:          'DisApprove',
          MouId:           rest.mouId,
          UserId:          rest.userId,
          ApprovalRemarks: rest.approvalRemarks,
          LoginName:       rest.loginName,
        });
        break;

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    const data = await callBackend(fd);
    return NextResponse.json(data);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[MOU API Route]', message);
    return NextResponse.json(
      { item1: [{ msg: 'Failed', returnId: -1 }], error: message },
      { status: 500 },
    );
  }
}


// // app/api/mou/route.ts
// // ─────────────────────────────────────────────────────────────────────────────
// // Next.js Route Handler — proxies every MOU action to the .NET backend.
// // Mirrors MOUCrudOperation service (mou-crud-operation.service.ts).
// //
// // NOTE: The .NET dev server uses a self-signed TLS cert on localhost:7125.
// // Node.js native fetch rejects self-signed certs by default, so we use an
// // undici Agent with rejectUnauthorized:false in non-production environments.
// // ─────────────────────────────────────────────────────────────────────────────
 
// import { NextRequest, NextResponse } from 'next/server';
// import { Agent, fetch as undiciFetch } from 'undici';

// // ── Configuration ──────────────────────────────────────────────────────────────
// const BASE_URL   = process.env.MOU_API_BASE_URL;
// const AUTH_TOKEN = process.env.MOU_AUTH_TOKEN  ;
// const ENDPOINT   = `${BASE_URL}/CIFMOUCrudOperation`;

// // Bypass self-signed cert in dev — matches Angular HttpClient behaviour where
// // the browser trusts the installed .NET dev certificate automatically.
// const tlsAgent =
//   process.env.NODE_ENV !== 'production'
//     ? new Agent({ connect: { rejectUnauthorized: false } })
//     : undefined;

// // ─────────────────────────────────────────────────────────────────────────────

// function buildFormData(fields: Record<string, string | undefined | null>): FormData {
//   const fd = new FormData();
//   for (const [key, value] of Object.entries(fields)) {
//     if (value !== undefined && value !== null && value !== '') {
//       fd.append(key, value);
//     }
//   }
//   return fd;
// }

// async function callBackend(fd: FormData) {
//   const fetchFn = tlsAgent ? undiciFetch : fetch;

//   const res = await (fetchFn as typeof fetch)(ENDPOINT, {
//     method:  'POST',
//     headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
//     body:    fd,
//     // pass undici dispatcher when the TLS agent is active
//     ...(tlsAgent ? ({ dispatcher: tlsAgent } as object) : {}),
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Backend ${res.status}: ${text}`);
//   }

//   return res.json();
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // POST /api/mou
// // Body (JSON): { action, ...fields }
// // ─────────────────────────────────────────────────────────────────────────────

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { action, ...rest } = body as { action: string; [key: string]: string };

//     let fd: FormData;

//     switch (action) {

//       case 'Insert':
//         fd = buildFormData({
//           Action:          'Insert',
//           MOUTitle:        rest.mouTitle,
//           MOUDocumentUrl:  rest.mouDocumentUrl,
//           MOUDocumentData: rest.mouDocumentData,
//           MouStartDate:    rest.mouStartDate,
//           MouEndDate:      rest.mouEndDate,
//           MOURemarks:      rest.mouRemarks,
//           UserId:          rest.userId,
//         });
//         break;

//       case 'Update':
//         fd = buildFormData({
//           Action:          'Update',
//           MouId:           rest.mouId,
//           MOUTitle:        rest.mouTitle,
//           MOUDocumentData: rest.mouDocumentData,
//           MOUDocumentUrl:  rest.mouDocumentUrl,
//           MouStartDate:    rest.mouStartDate,
//           MouEndDate:      rest.mouEndDate,
//           MOURemarks:      rest.mouRemarks,
//           LoginName:       rest.loginName,
//           UserId:          rest.userId,
//         });
//         break;

//       case 'Delete':
//         fd = buildFormData({
//           Action:    'Delete',
//           MouId:     rest.mouId,
//           MOUTitle:  rest.mouTitle,
//           UserId:    rest.userId,
//           LoginName: rest.loginName,
//         });
//         break;

//       case 'View':
//         fd = buildFormData({
//           Action: 'View',
//           UserId: rest.userId,
//         });
//         break;

//       case 'ViewAll':
//         fd = buildFormData({ Action: 'ViewAll' });
//         break;

//       case 'Approve':
//         fd = buildFormData({
//           Action:          'Approve',
//           MouId:           rest.mouId,
//           UserId:          rest.userId,
//           ApprovalRemarks: rest.approvalRemarks,
//           LoginName:       rest.loginName,
//         });
//         break;

//       case 'DisApprove':
//         fd = buildFormData({
//           Action:          'DisApprove',
//           MouId:           rest.mouId,
//           UserId:          rest.userId,
//           ApprovalRemarks: rest.approvalRemarks,
//           LoginName:       rest.loginName,
//         });
//         break;

//       default:
//         return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
//     }

//     const data = await callBackend(fd);
//     return NextResponse.json(data);

//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : 'Internal server error';
//     console.error('[MOU API Route] POST failed:', message);
//     return NextResponse.json(
//       { item1: [{ msg: 'Failed', returnId: -1 }], error: message },
//       { status: 500 },
//     );
//   }
// }
