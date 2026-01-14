
"use client"; 

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useRouter } from 'next/navigation';
import page from '@/app/(auth)/auth/page';

// Unified Navigation Data
const navPages = [
  { name: 'Facilities', path: '/' },
  { name: 'Test Charges', path: '/TestingChargesList.pdf' },
  { name: 'Terms & Conditions', path: '/terms' },
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' },
];
function ResponsiveAppBar() {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleNavigate = (path: string) => {
    router.push(path);
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const downloadTestCharge = (FileName: string) => {
    const link = document.createElement('a');    
    const path = `assets/CifDocumentsTemplates/${FileName}`;
    link.href = path;
    link.download = FileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    // <AppBar position="static" sx={{ marginTop: 20 }}>
    //   <Container maxWidth="md">
    //     <Toolbar disableGutters >
    //       <Typography
    //         variant="h6"
    //         noWrap
    //         component="div"
    //         onClick={() => handleNavigate('/')}
    //         sx={{
    //           mr: 2,
    //           display: { xs: 'none', md: 'flex' },
    //           fontFamily: 'monospace',
    //           fontWeight: 700,
    //           letterSpacing: '.3rem',
    //           color: 'inherit',
    //           textDecoration: 'none',
    //           cursor: 'pointer'
    //         }}
    //       >
    //         CIF
    //       </Typography>

    //       <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
    //         <IconButton
    //           size="large"
    //           aria-label="menu"
    //           onClick={handleOpenNavMenu}
    //           color="inherit"
    //         >
    //           <MenuIcon />
    //         </IconButton>
    //         <Menu
    //           id="menu-appbar"
    //           anchorEl={anchorElNav}
    //           anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    //           keepMounted
    //           transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    //           open={Boolean(anchorElNav)}
    //           onClose={handleCloseNavMenu}
    //           sx={{ display: { xs: 'block', md: 'none' } }}
    //         >
    //           {navPages.map((page) => (
    //             page.name === 'Test Charges' ? (
    //               <MenuItem key={page.name} onClick={() => downloadTestCharge(page.path)}>
    //                 <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
    //               </MenuItem>
    //             ) : (
    //               <MenuItem key={page.name} onClick={() => handleNavigate(page.path)}>
    //                 <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
    //               </MenuItem>
    //             )
    //           ))}
    //         </Menu>
    //       </Box>

    //       <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
    //       <Typography
    //         variant="h5"
    //         noWrap
    //         component="div"
    //         onClick={() => handleNavigate('/')}
    //         sx={{
    //           mr: 2,
    //           display: { xs: 'flex', md: 'none' },
    //           flexGrow: 1,
    //           fontFamily: 'monospace',
    //           fontWeight: 700,
    //           letterSpacing: '.3rem',
    //           color: 'inherit',
    //           textDecoration: 'none',
    //           cursor: 'pointer'
    //         }}
    //       >
    //         CIF
    //       </Typography>

    //       <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
    //         {navPages.map((page) => (
    //           page.name === 'Test Charges' ? (
    //             <Button
    //               key={page.name}
    //               onClick={() => downloadTestCharge(page.path)}
    //               sx={{ my: 2, color: 'white', display: 'block' }}
    //             >  {page.name}</Button>
    //           ) : (
    //             <Button
    //               key={page.name}
    //               onClick={() => handleNavigate(page.path)}
    //               sx={{ my: 2, color: 'white', display: 'block' }}
    //             >
    //               {page.name}
    //             </Button>
    //           )
    //         ))}
    //       </Box>
    //     </Toolbar>
    //   </Container>
    // </AppBar>
    <Box sx={{ py: 2 ,marginTop: 20 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          {navPages.map((page) =>
            page.name === 'Test Charges' ? (
              <Button
                key={page.name}
                variant="outlined"
                onClick={() => downloadTestCharge(page.path)}
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: 'black',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                {page.name}
              </Button>
            ) : (
              <Button
                key={page.name}
                variant="outlined"
                onClick={() => handleNavigate(page.path)}
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: 'black',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                {page.name}
              </Button>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
}
export default ResponsiveAppBar;