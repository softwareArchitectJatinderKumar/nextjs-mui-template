// app/api/mou/download/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Proxy endpoint that fetches an MOU document from the internal file server
// and streams it back to the browser as an attachment.
//
// Mirrors LpuCIFWebService.downloadFile() from the Angular project.
// The file server is on the internal network, so clients cannot reach it
// directly — all downloads must be proxied through this route.
//
// GET /api/mou/download?file=<filename>
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';

const FILE_SERVER =
  process.env.MOU_FILE_SERVER ??
  'http://172.19.2.52/umsweb/webftp/CIFDocuments/CIFMouDocuments/';

export async function GET(req: NextRequest) {
  const fileName = req.nextUrl.searchParams.get('file');

  if (!fileName) {
    return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
  }

  // Prevent path traversal
  const safeName = fileName.replace(/[/\\]/g, '');
  const fileUrl  = FILE_SERVER.replace(/\/?$/, '/') + safeName;

  try {
    const upstream = await fetch(fileUrl);

    if (!upstream.ok) {
      console.error('[MOU Download] Upstream error', upstream.status, fileUrl);
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
    }

    const contentType =
      upstream.headers.get('content-type') ?? 'application/octet-stream';
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':        contentType,
        'Content-Disposition': `attachment; filename="${safeName}"`,
        'Content-Length':      String(buffer.byteLength),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Download failed';
    console.error('[MOU Download] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
