// // components/Footer.tsx
// import React from 'react';

// async function getRemoteFooter() {
//   try {
//     const res = await fetch('https://includepages.lpu.in/newlpu/footer.php', {
//       next: { revalidate: 3600 }
//     });
//     return res.text();
//   } catch (error) {
//     console.error("Footer fetch failed:", error);
//     return "";
//   }
// }

// const BFooter = async () => {
//   const footerHtml = await getRemoteFooter();

//   return (
//     <div 
//       id="remote-footer"
//       dangerouslySetInnerHTML={{ __html: footerHtml }} 
//     />
//   );
// };

// export default BFooter;
// components/Footer.tsx
async function getRemoteFooter() {
  try {
    const res = await fetch('https://includepages.lpu.in/newlpu/footer.php', {
      next: { revalidate: 3600 }
    });
    let html = await res.text();
    
    // Normalize and fix paths
    html = html.replace(/\r\n/g, '\n');
    html = html.replaceAll('src="/', 'src="https://www.lpu.in/');
    html = html.replaceAll('href="/', 'href="https://www.lpu.in/');
    
    return html;
  } catch (error) {
    return "";
  }
}

const BFooter = async () => {
  const footerHtml = await getRemoteFooter();
  return (
    <div 
      id="remote-footer" 
      suppressHydrationWarning={true}
      dangerouslySetInnerHTML={{ __html: footerHtml }} 
    />
  );
};

export default BFooter;