'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Navbar from '@/components/CIF/TopNavBar';
import StaffMenuBar from '@/app/StaffUser/StaffMenuBar/page';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function NavigationSwitcher() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [navType, setNavType] = useState<'PUBLIC' | 'INTERNAL' | 'STAFF'>('PUBLIC');

  useEffect(() => {
    setMounted(true);

    const internalAuth = Cookies.get('InternalUserAuthData');
    const staffAuth = Cookies.get('StaffUserAuthData');

    const publicPages = ['/login', '/StaffUser/StaffLogin', '/register', '/forgot-password', '/'];
    const isPublicPage = publicPages.includes(pathname);

    if (isPublicPage) {
      setNavType('PUBLIC');
    } 
    else if (staffAuth || pathname.startsWith('/StaffUser')) {
      setNavType('STAFF');
    } 
    else if (internalAuth || pathname.startsWith('/InternalUserDashboard')) {
      setNavType('INTERNAL');
    } 
    else {
      setNavType('PUBLIC');
    }
  }, [pathname]);

  if (!mounted) return <Header />;

  switch (navType) {
    case 'STAFF':
      return <StaffMenuBar />;
    case 'INTERNAL':
      return <Navbar />;
    case 'PUBLIC':
    default:
      return <Header />;
  }
}

// 'use client';

// import React, { useEffect, useState } from 'react';
// import Header from '@/components/common/Header';
// import Navbar from '@/components/CIF/TopNavBar';  
// import StaffMenuBar from '@/app/StaffUser/StaffMenuBar/page';
// import { usePathname } from 'next/navigation';
// import Cookies from 'js-cookie';

// export default function NavigationSwitcher() {
//   const pathname = usePathname();
//   const [mounted, setMounted] = useState(false);
//   const [navType, setNavType] = useState<'PUBLIC' | 'STANDARD' | 'STAFF'>('PUBLIC');

//   useEffect(() => {
//     setMounted(true);

//     const authData = Cookies.get('InternalUserAuthData');
//     const staffData = Cookies.get('StaffUserAuthData');

//     const publicPages = ['/login', '/StaffUser/StaffLogin', '/register', '/forgot-password', '/'];
//     const isPublicPage = publicPages.includes(pathname);

//     if (isPublicPage) {
//       setNavType('PUBLIC');
//     } else if (staffData || pathname.startsWith('/StaffUser') || pathname.startsWith('/InternalUserDashboard')) {
//       setNavType('STAFF');
//     } else if (authData) {
//       setNavType('STANDARD');
//     } else {
//       setNavType('PUBLIC');
//     }
//   }, [pathname]);

//   if (!mounted) return <Header />;

//   switch (navType) {
//     case 'STAFF':
//       return <StaffMenuBar />;
//     case 'STANDARD':
//       return <Navbar />;
//     default:
//       return <Header />;
//   }
// }

