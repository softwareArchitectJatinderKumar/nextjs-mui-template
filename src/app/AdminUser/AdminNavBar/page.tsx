'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export default function AdminNavBar() {
  const router = useRouter();

  // --- State Management ---
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
  const [userData, setUserData] = useState({
    userRole: 'Internal User',
    userId:'',
    passwordText: '',
    userEmail: '',
    supervisorName: '',
    departmentName: '',
    candidateName: '',
  });

  // --- Auth Check & Initial Data ---
  useEffect(() => {
    const authData = Cookies.get('authData');

    if (!authData) {
      Swal.fire({
        title: 'Login Failed',
        icon: 'warning',
        text: 'Session expired. Please login again.',
      });
      router.push('/');
      return;
    }

    try {
      const parsedData = JSON.parse(authData);
      setUserData({
        userRole: parsedData.userRole || 'Internal User',
        userEmail: parsedData.EmailId,
        userId: parsedData.UserId,
        passwordText: parsedData.PasswordText,
        supervisorName: parsedData.SupervisorName,
        departmentName: parsedData.Department,
        candidateName: parsedData.CandidateName,
      });
    } catch (error) {
      console.error("Error parsing cookie data", error);
    }
  }, [router]);

  // --- Actions ---
  const handleNavigation = (path: string) => {
    router.push(`/AdminUser/${path}`);
  };

  const handleLogout = () => {
    Cookies.remove('authData');
    router.push('/');
  };

  return (
    <>
      <nav className="navbar navbar-light navbar-expand-lg mb-4 bg-white shadow-sm">
        <div className="container-fluid">
          <button
            className="navbar-toggler bg-light"
            type="button"
            onClick={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`${isNavbarCollapsed ? 'collapse' : ''} navbar-collapse justify-content-center`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle pointer" role="button" data-bs-toggle="dropdown">
                  <span style={{ borderBottom: '1px solid #ef7d00' }}>Tests & Results</span>
                </a>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" onClick={() => handleNavigation('ViewBookings')}>View Bookings</button></li>
                  <li><button className="dropdown-item" onClick={() => handleNavigation('AssignTest')}>Assign Test</button></li>
                  <li><button className="dropdown-item" onClick={() => handleNavigation('UploadResults')}>Upload Results</button></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle pointer" role="button" data-bs-toggle="dropdown">User & Payments</a>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" onClick={() => handleNavigation('Payments')}>All Payments</button></li>
                  <li><button className="dropdown-item" onClick={() => handleNavigation('UserDetails')}>All User</button></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle pointer" role="button" data-bs-toggle="dropdown">Instruments</a>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" onClick={() => handleNavigation('InstrumentAction')}>Change State</button></li>
                  <li><button className="dropdown-item" onClick={() => handleNavigation('AdminUploadImage')}>Upload Image</button></li>
                  <li><button className="dropdown-item" onClick={() => handleNavigation('AdminInstrumentPrice')}>Update Price(s)</button></li>
                </ul>
              </li>

              <li className="nav-item">
                <button className="nav-link btn btn-link text-decoration-none" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="mx-auto mt-4 mb-4 text-start">
          <h1 className="mb-0">Central Instrumentation Facility Admin Panel</h1>
        </div>

      </div>

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

      <style jsx>{`
        .pointer { cursor: pointer; }
      `}</style>
    </>
  );
}