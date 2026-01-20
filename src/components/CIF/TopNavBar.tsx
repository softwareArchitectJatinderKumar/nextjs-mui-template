// 'use client';

// import React, { useState, useEffect } from 'react';
// import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box, Container, IconButton, Tooltip } from '@mui/material';
// import { Logout as LogoutIcon, AccountCircle, ShieldMoon } from '@mui/icons-material';
// import { usePathname, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import Cookies from 'js-cookie';
// import Swal from 'sweetalert2';

// const TopNavBar = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [value, setValue] = useState(0);

//   const navItems = [
//     { label: 'New Booking', path: '/InternalUserDashboard/NewBooking' },
//     { label: 'View Bookings', path: '/InternalUserDashboard/ViewAllBookings' },
//     { label: 'My Feedback', path: '/InternalUserDashboard/MyFeedback' },
//     { label: 'Profile', path: '/InternalUserDashboard/Profile' },
//   ];

//   // Sync tab highlight with current URL
//   useEffect(() => {
//     const index = navItems.findIndex(item => item.path === pathname);
//     if (index !== -1) setValue(index);
//   }, [pathname]);

//   const handleLogout = () => {
//     Swal.fire({
//       title: 'Logout?',
//       text: "Are you sure you want to exit?",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d32f2f',
//       confirmButtonText: 'Logout',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Cookies.remove('InternalUserAuthData');
//         router.push('/login');
//       }
//     });
//   };

//   return (
//     <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid #e0e0e0' }}>
//       <Container maxWidth="xl">
//         <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          
//           {/* LEFT: Branding */}
//           <Typography
//             variant="h6"
//             component={Link}
//             href="/InternalUserDashboard"
//             sx={{
//               fontWeight: 800,
//               textDecoration: 'none',
//               color: 'inherit',
//               letterSpacing: 1,
//               display: 'flex',
//               alignItems: 'center'
//             }}
//           >
//             CIF <Box component="span" sx={{ color: '#ff6a00', ml: 0.5 }}>LPU</Box>
//           </Typography>

//           {/* CENTER: Navigation Tabs */}
//           <Box sx={{ display: { xs: 'none', md: 'block' } }}>
//             <Tabs 
//               value={value} 
//               textColor="primary"
//               indicatorColor="primary"
//               sx={{
//                 '& .MuiTab-root': { fontWeight: 600, fontSize: '0.85rem' },
//                 '& .Mui-selected': { color: '#ff6a00 !important' },
//                 '& .MuiTabs-indicator': { backgroundColor: '#ff6a00' }
//               }}
//             >
//               {navItems.map((item, index) => (
//                 <Tab 
//                   key={index} 
//                   label={item.label} 
//                   component={Link} 
//                   href={item.path} 
//                 />
//               ))}
//             </Tabs>
//           </Box>

//           {/* RIGHT: Actions */}
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Tooltip title="Change Password">
//               <IconButton component={Link} href="/InternalUserDashboard/ChangePassword" size="small">
//                 <ShieldMoon fontSize="small" />
//               </IconButton>
//             </Tooltip>
            
//             <Button
//               variant="outlined"
//               color="error"
//               size="small"
//               startIcon={<LogoutIcon />}
//               onClick={handleLogout}
//               sx={{ borderRadius: '4px', textTransform: 'none', fontWeight: 600 }}
//             >
//               Logout
//             </Button>
//           </Box>

//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// };

// export default TopNavBar;
'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box, Paper } from '@mui/material';
import { Logout as LogoutIcon, ShieldMoon } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const TopNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(0);

  const navItems = [
    { label: 'New Booking', path: '/InternalUserDashboard/NewBooking' },
    { label: 'View Bookings', path: '/InternalUserDashboard/ViewAllBookings' },
    { label: 'Feedback', path: '/InternalUserDashboard/MyFeedback' },
    { label: 'Profile', path: '/InternalUserDashboard/Profile' },
  ];

  useEffect(() => {
    const index = navItems.findIndex(item => item.path === pathname);
    if (index !== -1) setValue(index);
  }, [pathname]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6a00',
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove('InternalUserAuthData');
        router.push('/login');
      }
    });
  };

  return (
    // Box wrapper to provide padding at the top so it doesn't touch the screen edge
    <Box sx={{ width: '100%', pt: 2, pb: 1, display: 'flex', justifyContent: 'center' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          width: 'auto', // Takes only needed width
          minWidth: '800px', // Prevents it from getting too small
          borderRadius: '50px', // Pill shape
          px: 3,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', gap: 4 }}>
          
          {/* LEFT: Mini Brand */}
          <Typography
            variant="subtitle1"
            component={Link}
            href="/InternalUserDashboard"
            sx={{ fontWeight: 800, textDecoration: 'none', color: '#333' }}
          >
            CIF <Box component="span" sx={{ color: '#ff6a00' }}>LPU</Box>
          </Typography>

          {/* CENTER: Compact Tabs */}
          <Tabs 
            value={value} 
            sx={{
              minHeight: '40px',
              '& .MuiTab-root': { 
                fontWeight: 600, 
                fontSize: '0.8rem', 
                minHeight: '40px',
                minWidth: '100px',
                color: '#666'
              },
              '& .Mui-selected': { color: '#ff6a00 !important' },
              '& .MuiTabs-indicator': { backgroundColor: '#ff6a00', height: '3px', borderRadius: '3px' }
            }}
          >
            {navItems.map((item, index) => (
              <Tab key={index} label={item.label} component={Link} href={item.path} />
            ))}
          </Tabs>

          {/* RIGHT: Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              onClick={handleLogout}
              size="small"
              sx={{ 
                color: '#666', 
                textTransform: 'none', 
                fontWeight: 700,
                '&:hover': { color: '#d32f2f' } 
              }}
              startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            >
              Logout
            </Button>
          </Box>

        </Toolbar>
      </Paper>
    </Box>
  );
};

export default TopNavBar;
// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import Swal from 'sweetalert2';

// const Navbar: React.FC = () => {
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleLogout = () => {
//     Swal.fire({
//       title: 'Sign Out?',
//       text: "Are you sure you want to end your session?",
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#ff6a00',
//       cancelButtonText: 'Cancel',
//       confirmButtonText: 'Logout'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Cookies.remove('InternalUserAuthData');
//         router.push('/login');
//       }
//     });
//   };

//   const navItems = [
//     { name: 'New Booking', path: '/InternalUserDashboard/NewBooking' },
//     { name: 'View Bookings', path: '/InternalUserDashboard/ViewAllBookings' },
//     { name: 'My Feedback', path: '/InternalUserDashboard/MyFeedback' },
//     { name: 'Profile', path: '/InternalUserDashboard/Profile' },
//     { name: 'Change Password', path: '/InternalUserDashboard/ChangePassword' },
//   ];

//   return (
//     <nav className="navbar navbar-expand-lg cif-navbar sticky-top bg-white shadow-sm">
//       <div className="container">
//         {/* Left: Brand Logo */}
//         <Link href="/InternalUserDashboard" className="navbar-brand">
//           <span className="fw-bold text-dark">CIF <span style={{color: '#ff6a00'}}>LPU</span></span>
//         </Link>

//         {/* Mobile Toggle */}
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#cifNav">
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Center: Navigation Links */}
//         <div className="collapse navbar-collapse" id="cifNav">
//           <ul className="navbar-nav mx-auto"> 
//             {navItems.map((item) => (
//               <li className="nav-item" key={item.path}>
//                 <Link 
//                   href={item.path} 
//                   className={`nav-link cif-nav-link px-3 ${pathname === item.path ? 'active' : ''}`}
//                 >
//                   {item.name}
//                 </Link>
//               </li>
//             ))}
//           </ul>

//           {/* Right: Logout Action */}
//           <div className="d-flex align-items-center">
//             <button onClick={handleLogout} className="logout-btn">
//               <i className="bi bi-box-arrow-right me-2"></i>Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import Swal from 'sweetalert2';

// const Navbar: React.FC = () => {
//   const router = useRouter();

//   const handleLogout = () => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You will be logged out of your session",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, Logout'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         localStorage.clear(); 
//         router.push('/login');
//       }
//     });
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
//       <div className="container">
//         <Link href="/dashboard" className="navbar-brand fw-bold">
//           CIF Portal
//         </Link>
        
//         <button 
//           className="navbar-toggler" 
//           type="button" 
//           data-bs-toggle="collapse" 
//           data-bs-target="#navbarNav"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav me-auto">
//             <li className="nav-item">
//               <Link href="/bookings/new" className="nav-link">New Booking</Link>
//             </li>
//             <li className="nav-item">
//               <Link href="/bookings/all" className="nav-link">View All Bookings</Link>
//             </li>
//             <li className="nav-item">
//               <Link href="/feedback" className="nav-link">My Feedback</Link>
//             </li>
//           </ul>
          
//           <ul className="navbar-nav ms-auto">
//             <li className="nav-item">
//               <Link href="/change-password" className="nav-link">Change Password</Link>
//             </li>
//             <li className="nav-item">
//               <button 
//                 onClick={handleLogout} 
//                 className="btn btn-outline-danger btn-sm ms-lg-2 mt-2 mt-lg-0"
//               >
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;