import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://includepages.lpu.in/newlpu/header.php', {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Next.js Server',
      },
    });
    
    if (!response.ok) {
      console.error(`Remote header fetch failed: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch remote content: ${response.status}`);
    }
    
    const html = await response.text();
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error fetching remote header:', error);
    return new NextResponse('<header>Header unavailable</header>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}