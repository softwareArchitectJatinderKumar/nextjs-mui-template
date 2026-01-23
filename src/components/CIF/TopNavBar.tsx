'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Tabs, Tab, Box, Paper, 
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar 
} from '@mui/material';
import { 
  Logout as LogoutIcon, 
  Menu as MenuIcon, 
  Close as CloseIcon 
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { storageService } from '@/services/storageService';

const TopNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Profile', path: '/InternalUserDashboard/Profile' },
    { label: 'New Booking', path: '/InternalUserDashboard/NewBooking' },
    { label: 'View Bookings', path: '/InternalUserDashboard/ViewBookings' },
    { label: 'Feedback', path: '/InternalUserDashboard/Feedback' },
    { label: 'Sample Status', path: '/InternalUserDashboard/SampleStatus' },
    { label: 'Change Password', path: '/InternalUserDashboard/changePassword' },
  ];

  useEffect(() => {
    const index = navItems.findIndex(item => item.path === pathname);
    if (index !== -1) setValue(index);
  }, [pathname]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6a00',
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        storageService.clean();
        Cookies.remove('InternalUserAuthData');
        router.push('/login');
      }
    });
  };

  return (
    <Box sx={{ width: '100%', pt: { xs: 1, md: 2 }, pb: 1, px: { xs: 2, md: 0 }, display: 'flex', justifyContent: 'center' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          width: { xs: '100%', md: 'auto' }, 
          maxWidth: '1200px',
          borderRadius: { xs: '10px', md: '50px' }, 
          px: { xs: 1, md: 3 },
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,0,0,0.05)',
          overflowX: 'auto'
        }}
      >
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', px: { xs: 1, md: 0 } }}>
          
          <Typography
            variant="subtitle1"
            component={Link}
            href="/InternalUserDashboard/Profile"
            sx={{ fontWeight: 800, textDecoration: 'none', color: '#333', minWidth: 'max-content' }}
          >
          <Box component="span" sx={{ marginRight:'3rem'}}> CIF <Box component="span" sx={{ color: '#ff6a00' }}>LPU</Box></Box>
          </Typography>

          {/* Desktop Navigation - Hidden on Mobile */}
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Tabs 
              value={value} 
              sx={{
                minHeight: '40px',
                '& .MuiTab-root': { 
                  fontWeight: 600, 
                  fontSize: '0.75rem', 
                  minHeight: '40px',
                  minWidth: 'auto',
                  px: 2,
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
          </Box>

          {/* Desktop Logout & Mobile Menu Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              onClick={handleLogout}
              size="small"
              sx={{ 
                display: { xs: 'none', md: 'flex' }, // Hide text on small mobile
                color: '#666', 
                textTransform: 'none', 
                fontWeight: 700,
                '&:hover': { color: '#d32f2f' } 
              }}
              startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            >
              Logout
            </Button>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { lg: 'none' }, color: '#ff6a00' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Paper>

      {/* Mobile Drawer (Side Menu) */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile.
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, p: 2 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, px: 2 }}>
          CIF <Box component="span" sx={{ color: '#ff6a00' }}>LPU</Box>
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton 
                component={Link} 
                href={item.path}
                onClick={handleDrawerToggle}
                selected={pathname === item.path}
                sx={{ 
                  borderRadius: '8px',
                  '&.Mui-selected': { bgcolor: 'rgba(255, 106, 0, 0.1)', color: '#ff6a00' }
                }}
              >
                <ListItemText   primary={item.label}   slotProps={{primary: { sx: { fontWeight: 600 } }   }} />
                {/* <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} /> */}
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding sx={{ mt: 2 }}>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: '8px', color: '#d32f2f' }}>
              <LogoutIcon sx={{ mr: 2 }} />
              <ListItemText   primary="Logout"   slotProps={{primary: { sx: { fontWeight: 600 } }   }} />
              {/* <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700 }} /> */}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
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