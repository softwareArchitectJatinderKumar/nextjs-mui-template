import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://includepages.lpu.in/newlpu/footer.php', {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Next.js Server',
      },
    });
    
    if (!response.ok) {
      console.error(`Remote footer fetch failed: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch remote content: ${response.status}`);
    }
    
    const html = await response.text();
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error fetching remote footer:', error);
    return new NextResponse('<footer>Footer unavailable</footer>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}