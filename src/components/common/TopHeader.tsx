// // components/TopHeader.tsx
// import React from 'react';

// async function getRemoteHeader() {
//   try {
//     const res = await fetch('https://includepages.lpu.in/newlpu/header.php', {
//       // Revalidate every hour to catch source changes
//       next: { revalidate: 3600 } 
//     });
//     return res.text();
//   } catch (error) {
//     console.error("Header fetch failed:", error);
//     return ""; // Fallback to empty if server is down
//   }
// }

// const TopHeader = async () => {
//   const headerHtml = await getRemoteHeader();

//   return (
//     <div 
//       id="remote-header"
//       // Injecting the raw HTML from the PHP response
//       dangerouslySetInnerHTML={{ __html: headerHtml }} 
//     />
//   );
// };

// export default TopHeader;

// components/TopHeader.tsx
import React from 'react';

async function getRemoteHeader() {
  try {
    const res = await fetch('https://includepages.lpu.in/newlpu/header.php', {
      next: { revalidate: 3600 } 
    });
    let html = await res.text();

    // 1. Fix Hydration: Normalize line endings to prevent the mismatch error
    html = html.replace(/\r\n/g, '\n');

    // 2. Fix Assets: Replace relative paths with absolute LPU paths
    html = html.replaceAll('src="/', 'src="https://www.lpu.in/');
    html = html.replaceAll('href="/', 'href="https://www.lpu.in/');

    return html;
  } catch (error) {
    console.error("Header fetch failed:", error);
    return ""; 
  }
}

const TopHeader = async () => {
  const headerHtml = await getRemoteHeader();

  return (
    <div 
      id="remote-header"
      // suppressHydrationWarning is a safety net for dynamic remote content
      suppressHydrationWarning={true}
      dangerouslySetInnerHTML={{ __html: headerHtml }} 
    />
  );
};

export default TopHeader;