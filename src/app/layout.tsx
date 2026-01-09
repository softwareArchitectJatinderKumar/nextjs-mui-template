import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { RemoteHeader } from '@/components/common/RemoteHeader';

// import ThemeRegistry from '@/theme/ThemeRegistry'; // Import the new wrapper
import ThemeRegistry from '@/theme/ThemeRegistry';
import Script from 'next/script';
import React from 'react';
import { RemoteFooter } from '@/components/common/RemoteFooter';

// SEO Metadata (Server-side)
export const metadata = {
  title: 'LPU -- Central Instrumentation Facility',
  description: "LPU Ranks 38th amongst all government private universities...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/bootstrap.css" />
        <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/style.css" />
        {/* Add your other links here */}

         <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <script src="https://www.lpu.in/lpu-assets/js/jquery.js"></script>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />

        <title>LPU -- Central Instrumentation Facility</title>
        <meta name="description" content="LPU Ranks 38th amongst all government private universities in India, NIRF Rankings-2023. LPU offering best diploma, undergraduate, postgraduate and doctorate (Ph.D) courses in Management (BBA/MBA), Engineering (B.Tech/M.Tech), Pharma, Science, Agriculture, Fashion, Law, Journalism, Hotel Management and Computer Application (BCA/MCA)" />
        <meta name="keywords" content="Best Private University Punjab, top Private University India, Private University, top Private University Jalandhar, LPU, Lovely Professional University,top universities in India,best universities in India,top private universities in India ,India best university ,best university for MBA in India ,Best University in India ,top universities in Punjab ,best b tech university in India,UGC recognized university,India’  top university,lovely professional university." />
        <meta name="robots" content="index, follow, archive" />
        <meta name="author" content="Lovely Professional University" />
        <meta name="publisher" content="Lovely Professional University" />
        <meta name="distribution" content="global" />
        <link rel="alternate" hrefLang="en-in" href="https://www.lpu.in/cif/" />
        <link rel="canonical" href="https://www.lpu.in/cif/" />
        <meta property="og:title" content="Lovely Professional University is India's Best Private University" />
        <meta property="og:site_name" content="LPU" />
        <meta property="og:url" content="https://www.lpu.in" />
        <meta property="og:description"
          content="Lovely Professional University (LPU) ranks 38th amongst Universities in India by NIRF Ranking 2023. LPU Punjab offers programs for Undergraduate, Postgraduate, Research Scholars, PhD and working professionals via Regular, Distance, Online and welcomes international students. Admission open in LPU for 2024 batches. Apply online today at LPU." />
        <meta property="og:image" content="https://www.lpu.in/images/logo/logo-media.png" />
        <link rel="preconnect" href="https://www.lpu.in" />
        <link rel="dns-prefetch" href="https://www.lpu.in" />
        <link rel="preconnect" href="http://www.lpu.in" />
        <link rel="dns-prefetch" href="http://www.lpu.in" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />

        <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/bootstrap.css" type="text/css" />

        <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/style.css" type="text/css" />
        <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/font-icons.css" type="text/css" />
        <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/animate.css" type="text/css" />
        <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/magnific-popup.css" type="text/css" />
        <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/custom.css" type="text/css" />
        <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/header.css" type="text/css" />
        <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/slick/slick.css" type="text/css" />

          <Script src="https://www.lpu.in/lpu-assets/js/plugins.js" strategy="lazyOnload" />
        <Script src="https://www.lpu.in/lpu-assets/js/functions.js" strategy="lazyOnload" />
      </head>
      <body>
        <Script src="https://www.lpu.in/lpu-assets/js/jquery.js" strategy="beforeInteractive" />
        
        <RemoteHeader />

        {/* Use ThemeRegistry to wrap the application */}
        <ThemeRegistry>
          <Header />
          <main style={{ minHeight: '70vh' }}>
            {children}
          </main>
          {/* <Footer /> */}
        </ThemeRegistry>
      
        <RemoteFooter />
      </body>
    </html>
  );
}

// import { ThemeProvider, CssBaseline } from '@mui/material';
// import { theme } from '@/theme/theme';
// import Header from '@/components/common/Header';
// import Footer from '@/components/common/Footer';
// import React from 'react';
// import { RemoteHeader } from '@/components/common/RemoteHeader';
// import Script from 'next/script'; // Import Next.js Script component

// // Define SEO metadata the "Next.js way" for production (Requirement #9)
// export const metadata = {
//   title: 'LPU -- Central Instrumentation Facility',
//   description: "LPU Ranks 38th amongst all government private universities in India...",
//   keywords: "Best Private University Punjab, top Private University India, LPU, CIF",
//   // Add other metadata here if needed
// };

// interface RootLayoutProps {
//   children: React.ReactNode;
// }

// export default function RootLayout({ children }: RootLayoutProps) {
//   return (
//     <html lang="en">
//       <head>
//         {/* Basic Meta Tags */}
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
//         <link rel="alternate" hrefLang="en-in" href="https://www.lpu.in/cif/" />
//         <link rel="canonical" href="https://www.lpu.in/cif/" />

//         {/* External CSS */}
//         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/bootstrap.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/style.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/font-icons.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/animate.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/magnific-popup.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/custom.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/header.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/slick/slick.css" type="text/css" />
        
//         {/* Preconnects */}
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//       </head>
//       <body>
//         {/* External Scripts using Next.js Script component for optimization */}
//         <Script src="https://www.lpu.in/lpu-assets/js/jquery.js" strategy="beforeInteractive" />
//         <Script src="https://www.lpu.in/lpu-assets/js/plugins.js" strategy="lazyOnload" />
//         <Script src="https://www.lpu.in/lpu-assets/slick/slick.js" strategy="lazyOnload" />
//         <Script src="https://www.lpu.in/lpu-assets/js/functions.js" strategy="lazyOnload" />

//         <RemoteHeader />
        
//         {/* Material UI Theme Provider needs to wrap children */}
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           {/* <Header /> */}
//           <main style={{ minHeight: '70vh' }}>
//             {children}
//           </main>
//           <Footer />
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }



// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable}`}>
//         {children}
//       </body>
//     </html>
//   );
// }
