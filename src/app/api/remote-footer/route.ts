import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://includepages.lpu.in/newlpu/footer.php', {
      cache: 'no-store', // Ensures you get the latest footer
    });
    
    if (!response.ok) throw new Error('Failed to fetch remote content');
    
    const html = await response.text();
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'External header unavailable' }, { status: 500 });
  }
}