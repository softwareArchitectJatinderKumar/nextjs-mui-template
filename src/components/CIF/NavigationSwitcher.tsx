'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Navbar from '@/components/CIF/TopNavBar'; 
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function NavigationSwitcher() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const authData = Cookies.get('InternalUserAuthData'); 
    
    const publicPages = ['/login', '/register', '/forgot-password', '/'];
    const isPublicPage = publicPages.includes(pathname);

    setIsLoggedIn(!!authData && !isPublicPage);
    
    // console.log("Nav Switcher - Logged In:", !!authData, "Path:", pathname);
  }, [pathname]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Header />; 

  return isLoggedIn ? <Navbar /> : <Header />;
}
