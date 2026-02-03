'use client';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {
  Box, Paper, Toolbar, Typography, Button, Menu, MenuItem, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemText, Container,
  Grid, Card, CardContent, Divider, Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown,
  Person,
  Business,
  Fingerprint
} from '@mui/icons-material';

export default function AdminNavBar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState({ userId: '', userEmail: '', departmentName: '', candidateName: '' });

  // --- Menu State Management ---
  const [anchorElTests, setAnchorElTests] = useState<null | HTMLElement>(null);
  const [anchorElUsers, setAnchorElUsers] = useState<null | HTMLElement>(null);
  const [anchorElInstr, setAnchorElInstr] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorElTests(null);
    setAnchorElUsers(null);
    setAnchorElInstr(null);
  };

  const handleNavigation = (path: string) => {
    router.push(`/AdminUser/${path}`);
    handleClose();
  };

  const handleLogout = () => {
    Cookies.remove('authData');
    router.push('/');
  };

  useEffect(() => {
    // Initial Check & Data Load
    const checkAuth = () => {
      const authData = Cookies.get('authData');
      
      if (!authData) {
        // If cookie is gone (expired or manually deleted), force logout
        handleLogout();
        return;
      }

      try {
        const parsed = JSON.parse(authData);
        setUserData({
          userEmail: parsed.EmailId,
          userId: parsed.UserId,
          departmentName: parsed.Department,
          candidateName: parsed.CandidateName
        });
      } catch (e) {
        console.error("Auth Parsing Error", e);
        handleLogout();
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      const authData = Cookies.get('authData');
      if (!authData) {
        Swal.fire({
          title: 'Session Expired',
          text: 'Your 1-hour session has timed out. Please login again.',
          icon: 'info',
          confirmButtonColor: '#ef7d00'
        }).then(() => {
          handleLogout();
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      
      {/* --- FLOATING PILL NAVBAR WITH DROPDOWNS --- */}
      <Box sx={{ width: '100%', pt: { xs: 1, md: 2 }, pb: 1, px: { xs: 2, md: 0 }, display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 1100 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            width: { xs: '100%', md: 'auto' }, 
            maxWidth: '1200px',
            borderRadius: { xs: '10px', md: '50px' }, 
            px: { xs: 1, md: 3 },
            // bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <Toolbar variant="dense" sx={{ justifyContent: 'space-between', height: 60, gap: 2 }}>
            
            {/* LOGO SECTION */}
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: '#333', minWidth: 'max-content', display: 'flex', alignItems: 'center', mr: 2 }}
            >
              CIF <Box component="span" sx={{ color: '#ff6a00', ml: 0.5 }}>LPU</Box>
            </Typography>

            {/* DESKTOP DROPDOWN BUTTONS */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1 }}>
              
              <Button 
                endIcon={<KeyboardArrowDown />} 
                onClick={(e) => setAnchorElTests(e.currentTarget)}
                sx={{ color: '#666', fontWeight: 600, textTransform: 'none', fontSize: '0.85rem' }}
              >
                Tests & Results
              </Button>
              <Menu anchorEl={anchorElTests} open={Boolean(anchorElTests)} onClose={handleClose}>
                {/* <MenuItem onClick={() => handleNavigation('ViewBookings')}>View Bookings</MenuItem> */}
                <MenuItem onClick={() => handleNavigation('AssignTest')}>Assign Test</MenuItem>
                <MenuItem onClick={() => handleNavigation('UploadResults')}>Upload Results</MenuItem>
              </Menu>

              <Button 
                endIcon={<KeyboardArrowDown />} 
                onClick={(e) => setAnchorElUsers(e.currentTarget)}
                sx={{ color: '#666', fontWeight: 600, textTransform: 'none', fontSize: '0.85rem' }}
              >
                Users & Payments
              </Button>
              <Menu anchorEl={anchorElUsers} open={Boolean(anchorElUsers)} onClose={handleClose}>
                <MenuItem onClick={() => handleNavigation('Payments')}>All Payments</MenuItem>
                <MenuItem onClick={() => handleNavigation('UserDetails')}>All Users</MenuItem>
              </Menu>

              <Button 
                endIcon={<KeyboardArrowDown />} 
                onClick={(e) => setAnchorElInstr(e.currentTarget)}
                sx={{ color: '#666', fontWeight: 600, textTransform: 'none', fontSize: '0.85rem' }}
              >
                Instruments
              </Button>
              <Menu anchorEl={anchorElInstr} open={Boolean(anchorElInstr)} onClose={handleClose}>
                <MenuItem onClick={() => handleNavigation('InstrumentAction')}>Change State</MenuItem>
                <MenuItem onClick={() => handleNavigation('AdminInstruments')}>Upload Image</MenuItem>
                <MenuItem onClick={() => handleNavigation('UpdateInstrumentPrices')}>Update Prices</MenuItem>
              </Menu>
            </Box>

            {/* LOGOUT & MOBILE MENU */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={handleLogout}
                size="small"
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  color: '#666', 
                  textTransform: 'none', 
                  fontWeight: 700,
                  ml: 2,
                  '&:hover': { color: '#d32f2f', bgcolor: 'transparent' } 
                }}
                startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
              >
                Logout
              </Button>

              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { lg: 'none' }, color: '#ff6a00' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Paper>
      </Box>

      {/* --- MOBILE DRAWER (Preserved for mobile responsiveness) --- */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
         <Box sx={{ width: 280, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>CIF <span style={{color:'#ff6a00'}}>LPU</span></Typography>
            <Typography variant="overline" sx={{ fontWeight: 700, color: '#999' }}>Admin Actions</Typography>
            <List>
               {/* Simplified list for mobile to avoid nested menu complexity */}
               <ListItemButton onClick={() => handleNavigation('ViewBookings')}><ListItemText primary="View Bookings" /></ListItemButton>
               <ListItemButton onClick={() => handleNavigation('Payments')}><ListItemText primary="Payments" /></ListItemButton>
               <ListItemButton onClick={() => handleNavigation('InstrumentAction')}><ListItemText primary="Instrument State" /></ListItemButton>
               <Divider sx={{ my: 2 }} />
               <ListItemButton onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Logout" />
               </ListItemButton>
            </List>
         </Box>
      </Drawer>

       <div className="container-fluid mt-4">
         <div className="row">
           <div className="col-md-4 grid-margin stretch-card">
             <div className="card shadow-sm">
               <div className="card-body">
                 <div className="d-flex justify-content-between mb-2">
                   <label style={{ fontWeight: 700 }}>Candidate Name</label>
                   <label className="text-dark" style={{ fontWeight: 700 }}>{userData.candidateName}</label>
                 </div>
                 <div className="d-flex justify-content-between">
                   <label style={{ fontWeight: 700 }}>User Email</label>
                   <label className="text-dark" style={{ fontWeight: 700 }}>
                     {userData.userId?.length > 4 ? userData.userEmail : 'N/A'}
                   </label>
                 </div>
               </div>
             </div>
           </div>
           <div className="col-md-4 grid-margin">
             <div className="card shadow-sm">
               <div className="card-body">
                 <h3 className="text-success text-center mt-1 mb-1">CIF Admin Dashboard</h3>

                 <hr/>
               </div>
             </div>
           </div>
           <div className="col-md-4 grid-margin stretch-card">
             <div className="card shadow-sm">
               <div className="card-body">
                 <div className="d-flex justify-content-between">
                   <label style={{ fontWeight: 700 }}>Department Name</label>
                   <label className="text-dark text-end" style={{ fontWeight: 700 }}>
                     {userData.departmentName}
                   </label>
                 </div>
                  <div className="d-flex justify-content-between">
                   <label style={{ fontWeight: 700 }}>User Code</label>
                   <label className="text-dark" style={{ fontWeight: 700 }}>
                     {userData.userId?.length > 4 ? userData.userId : 'N/A'}
                   </label>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
    
    </Box>
  );
}
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import Swal from 'sweetalert2';

// export default function AdminNavBar() {
//   const router = useRouter();

//   // --- State Management ---
//   const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
//   const [userData, setUserData] = useState({
//     userRole: 'Internal User',
//     userId:'',
//     passwordText: '',
//     userEmail: '',
//     supervisorName: '',
//     departmentName: '',
//     candidateName: '',
//   });

//   // --- Auth Check & Initial Data ---
//   useEffect(() => {
//     const authData = Cookies.get('authData');
//     if (!authData) {
//       Swal.fire({
//         title: 'Login Failed',
//         icon: 'warning',
//         text: 'Session expired. Please login again.',
//       });
//       router.push('/');
//       return;
//     }

//     try {
//       const parsedData = JSON.parse(authData);
//       setUserData({
//         userRole: parsedData.userRole || 'Internal User',
//         userEmail: parsedData.EmailId,
//         userId: parsedData.UserId,
//         passwordText: parsedData.PasswordText,
//         supervisorName: parsedData.SupervisorName,
//         departmentName: parsedData.Department,
//         candidateName: parsedData.CandidateName,
//       });
//     } catch (error) {
//       console.error("Error parsing cookie data", error);
//     }
//   }, [router]);

//   // --- Actions ---
//   const handleNavigation = (path: string) => {
//     router.push(`/AdminUser/${path}`);
//   };

//   const handleLogout = () => {
//     Cookies.remove('authData');
//     router.push('/');
//   };

//   return (
//     <>
//       <nav className="navbar navbar-light navbar-expand-lg mb-4 bg-white shadow-sm">
//         <div className="container-fluid">
//           <button
//             className="navbar-toggler bg-light"
//             type="button"
//             onClick={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           <div className={`${isNavbarCollapsed ? 'collapse' : ''} navbar-collapse justify-content-center`}>
//             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

//               <li className="nav-item dropdown">
//                 <a className="nav-link dropdown-toggle pointer" role="button" data-bs-toggle="dropdown">
//                   <span style={{ borderBottom: '1px solid #ef7d00' }}>Tests & Results</span>
//                 </a>
//                 <ul className="dropdown-menu">
//                   <li><button className="dropdown-item" onClick={() => handleNavigation('ViewBookings')}>View Bookings</button></li>
//                   <li><button className="dropdown-item" onClick={() => handleNavigation('AssignTest')}>Assign Test</button></li>
//                   <li><button className="dropdown-item" onClick={() => handleNavigation('UploadResults')}>Upload Results</button></li>
//                 </ul>
//               </li>

//               <li className="nav-item dropdown">
//                 <a className="nav-link dropdown-toggle pointer" role="button" data-bs-toggle="dropdown">User & Payments</a>
//                 <ul className="dropdown-menu">
//                   <li><button className="dropdown-item" onClick={() => handleNavigation('Payments')}>All Payments</button></li>
//                   <li><button className="dropdown-item" onClick={() => handleNavigation('UserDetails')}>All User</button></li>
//                 </ul>
//               </li>

//               <li className="nav-item dropdown">
//                 <a className="nav-link dropdown-toggle pointer" role="button" data-bs-toggle="dropdown">Instruments</a>
//                 <ul className="dropdown-menu">
//                   <li><button className="dropdown-item" onClick={() => handleNavigation('InstrumentAction')}>Change State</button></li>
//                   <li><button className="dropdown-item" onClick={() => handleNavigation('AdminUploadImage')}>Upload Image</button></li>
//                   <li><button className="dropdown-item" onClick={() => handleNavigation('AdminInstrumentPrice')}>Update Price(s)</button></li>
//                 </ul>
//               </li>

//               <li className="nav-item">
//                 <button className="nav-link btn btn-link text-decoration-none" onClick={handleLogout}>Logout</button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       <div className="container-fluid d-flex justify-content-center align-items-center">
//         <div className="mx-auto mt-4 mb-4 text-start">
//           <h1 className="mb-0">Central Instrumentation Facility Admin Panel</h1>
//         </div>
//       </div>

//       <div className="container-fluid mt-4">
//         <div className="row">
//           <div className="col-md-4 grid-margin stretch-card">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-2">
//                   <label style={{ fontWeight: 700 }}>Candidate Name</label>
//                   <label className="text-dark" style={{ fontWeight: 700 }}>{userData.candidateName}</label>
//                 </div>
//                 <div className="d-flex justify-content-between">
//                   <label style={{ fontWeight: 700 }}>User Email</label>
//                   <label className="text-dark" style={{ fontWeight: 700 }}>
//                     {userData.userId?.length > 4 ? userData.userEmail : 'N/A'}
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-4 grid-margin">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <h3 className="text-success text-center mt-1 mb-1">CIF Admin Dashboard</h3>
             
//                 <hr/>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-4 grid-margin stretch-card">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between">
//                   <label style={{ fontWeight: 700 }}>Department Name</label>
//                   <label className="text-dark text-end" style={{ fontWeight: 700 }}>
//                     {userData.departmentName}
//                   </label>
//                 </div>
//                  <div className="d-flex justify-content-between">
//                   <label style={{ fontWeight: 700 }}>User Code</label>
//                   <label className="text-dark" style={{ fontWeight: 700 }}>
//                     {userData.userId?.length > 4 ? userData.userId : 'N/A'}
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .pointer { cursor: pointer; }
//       `}</style>
//     </>
//   );
// }