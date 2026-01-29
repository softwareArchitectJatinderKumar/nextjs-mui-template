// 'use client';

// import React, { useEffect, useState } from 'react';
// import Header from '@/components/common/Header';
// import Navbar from '@/components/CIF/TopNavBar';

// import StaffMenuBar from '@/app/StaffUser/StaffMenuBar/page';
// import { usePathname } from 'next/navigation';
// import Cookies from 'js-cookie';
// import AdminNavBar from '@/app/AdminUser/AdminNavBar/page';

// export default function NavigationSwitcher() {
//   const pathname = usePathname();
//   const [mounted, setMounted] = useState(false);
//   const [navType, setNavType] = useState<'PUBLIC' | 'INTERNAL' | 'ADMIN' | 'STAFF'>('PUBLIC');

//   useEffect(() => {
//     setMounted(true);

//     const AdminAuth = Cookies.get('AuthData');
//     const internalAuth = Cookies.get('InternalUserAuthData');
//     const staffAuth = Cookies.get('StaffUserAuthData');

//     const publicPages = ['/login', '/StaffUser/StaffLogin', '/register', '/forgot-password', '/'];
//     const isPublicPage = publicPages.includes(pathname);

//     if (isPublicPage) {
//       setNavType('PUBLIC');
//     } 
//     else if (staffAuth || pathname.startsWith('/StaffUser')) {
//       setNavType('STAFF');
//     } 
//     else if (internalAuth || pathname.startsWith('/InternalUserDashboard')) {
//       setNavType('INTERNAL');
//     } 
//     else if (AdminAuth || pathname.startsWith('/AdminUser')) {
//       setNavType('ADMIN');
//     } 
//     else {
//       setNavType('PUBLIC');
//     }
//   }, [pathname]);

//   if (!mounted) return <Header />;

//   switch (navType) {
//     case 'STAFF':
//       return <StaffMenuBar />;
//     case 'INTERNAL':
//       return <Navbar />;
//     case 'ADMIN':
//       return <AdminNavBar />;
//     case 'PUBLIC':
//     default:
//       return <Header />;
//   }
// }
'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Navbar from '@/components/CIF/TopNavBar';
import StaffMenuBar from '@/app/StaffUser/StaffMenuBar/page';
import AdminNavBar from '@/app/AdminUser/AdminNavBar/page';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function NavigationSwitcher() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [navType, setNavType] = useState<'PUBLIC' | 'INTERNAL' | 'ADMIN' | 'STAFF'>('PUBLIC');

  useEffect(() => {
    setMounted(true);

    // 1. Consistency check: Match the exact cookie names used in your login pages
    const adminAuth = Cookies.get('authData'); // Changed from 'AuthData' to match your login code
    const internalAuth = Cookies.get('InternalUserAuthData');
    const staffAuth = Cookies.get('StaffUserAuthData');

    // 2. Determine Navigation Logic
    const publicPages = ['/login', '/StaffUser/StaffLogin', '/AdminUser/Login','/register', '/forgot-password', '/'];
    const isPublicPage = publicPages.includes(pathname);

    if (isPublicPage) {
      setNavType('PUBLIC');
    } 
    else if (pathname.startsWith('/AdminUser') || adminAuth) {
      setNavType('ADMIN');
    } 
    else if (pathname.startsWith('/StaffUser') || staffAuth) {
      setNavType('STAFF');
    } 
    else if (pathname.startsWith('/InternalUserDashboard') || internalAuth) {
      setNavType('INTERNAL');
    } 
    else {
      setNavType('PUBLIC');
    }
  }, [pathname]);

  // Prevent flashing of wrong header during hydration
  if (!mounted) {
    return <div style={{ minHeight: '70px' }}><Header /></div>; 
  }

  // 3. Render Switcher
  const renderNavigation = () => {
    switch (navType) {
      case 'STAFF':
        return <StaffMenuBar />;
      case 'INTERNAL':
        return <Navbar />;
      case 'ADMIN':
        return <AdminNavBar />;
      case 'PUBLIC':
      default:
        return <Header />;
    }
  };

  return <>{renderNavigation()}</>;
}
