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
  const [navType, setNavType] = useState<'PUBLIC' | 'STANDARD' | 'STAFF'>('PUBLIC');

  useEffect(() => {
    setMounted(true);

    const authData = Cookies.get('InternalUserAuthData');
    const staffData = Cookies.get('StaffUserAuthData');

    const publicPages = ['/login', '/StaffUser/StaffLogin', '/register', '/forgot-password', '/'];
    const isPublicPage = publicPages.includes(pathname);

    if (isPublicPage) {
      setNavType('PUBLIC');
    } else if (staffData || pathname.startsWith('/StaffUser') || pathname.startsWith('/InternalUserDashboard')) {
      setNavType('STAFF');
    } else if (authData) {
      setNavType('STANDARD');
    } else {
      setNavType('PUBLIC');
    }
  }, [pathname]);

  if (!mounted) return <Header />;

  switch (navType) {
    case 'STAFF':
      return <StaffMenuBar />;
    case 'STANDARD':
      return <Navbar />;
    default:
      return <Header />;
  }
}

// 'use client';

// import React, { useEffect, useState } from 'react';
// import Header from '@/components/common/Header';
// import Navbar from '@/components/CIF/TopNavBar';  
// import { usePathname } from 'next/navigation';
// import Cookies from 'js-cookie';
// import StaffMenuBar from '@/app/StaffUser/StaffMenuBar/page';

// export default function NavigationSwitcher() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     const authData = Cookies.get('InternalUserAuthData'); 
//     const staffUserData = Cookies.get('StaffUserAuthData'); 
    
//     const publicPages = ['/login', '/register', '/forgot-password', '/'];
//     const isPublicPage = publicPages.includes(pathname);

//     setIsLoggedIn(!!authData && !isPublicPage);
    
//     // console.log("Nav Switcher - Logged In:", !!authData, "Path:", pathname);
//   }, [pathname]);

//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);
//   if (!mounted) return <Header />; 

//   return isLoggedIn ? <Navbar /> : <Header />;
// }
