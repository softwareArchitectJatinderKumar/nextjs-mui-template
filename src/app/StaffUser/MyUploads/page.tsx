'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import * as XLSX from 'xlsx';
import myAppWebService from '@/services/myAppWebService'; // Adjust path accordingly

interface BookingRecord {
  testUserId?: string;
  IdProofNumber?: string;
  mobileNumber?: string;
  bookingId: string;
  instrumentName: string;
  testSampleFile?: string;
  testDate: string;
  uploadedResult?: string;
  userEmailId?: string;
  totalCharges?: string;
  allocatedOn?: string;
}

export default function Myuploaded() {
  // State Management
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const serverUrl = 'https://files.lpu.in/umsweb/CIFDocuments/';

  // 1. Fetch Data on Mount
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const cookieData = Cookies.get('StaffUserAuthData');
      if (!cookieData) return;
      
      const auth = JSON.parse(cookieData);
      // Using UserId (EmployeeCode) as per your Angular logic
      const response = await myAppWebService.GetUploadedResultDetails(auth.UserId);

      let data: BookingRecord[] = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response?.item1 && Array.isArray(response.item1)) {
        data = response.item1;
      } else if (response && typeof response === 'object') {
        data = [response];
      }

      setBookingData(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      // Maintaining your minimum 2.5s delay logic from Angular
      const elapsed = Date.now() - startTime;
      const delay = Math.max(2500 - elapsed, 0);
      setTimeout(() => setLoading(false), delay);
    }
  };

  // 2. Search Logic (Memoized)
  const filteredData = useMemo(() => {
    if (!searchQuery) return bookingData;
    const q = searchQuery.toLowerCase();
    return bookingData.filter(item =>
      Object.values(item).some(val => String(val).toLowerCase().includes(q))
    );
  }, [searchQuery, bookingData]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Reset page to 1 when searching
  useEffect(() => {
    
    setCurrentPage(1);
    
  }, [searchQuery]);

  // 4. Export Utility
  const exportToExcel = () => {
    const exportedData = bookingData.map(item => ({
      EmailId: item.userEmailId,
      BookingId: item.bookingId,
      Instrument: item.instrumentName,
      Charges: item.totalCharges,
      BookingDate: item.allocatedOn,
    }));

    const ws = XLSX.utils.json_to_sheet(exportedData);
    ws['!cols'] = [{ wpx: 150 }, { wpx: 120 }, { wpx: 150 }, { wpx: 100 }, { wpx: 150 }];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'AssignedResults_report.xlsx');
  };

  const downloadFile = (fileName: string) => {
    window.open(serverUrl + fileName, '_blank');
  };

  return (
    <> 
         {loading && (
                <div className="fullScreenLoader">
                    <div className="customSpinnerOverlay">
                        <img src="/assets/images/spinner.gif" alt="Loading..." />
                    </div>
                </div>
            )}
    <div className="container-fluid p-4">
      {/* Loader */}
      {/* {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="mt-3 font-semibold text-blue-800">Loading, please wait...</div>
        </div>
      )} */}

      {/* Page Heading */}
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center">
          <h2 className="text-2xl font-bold py-2">My Uploaded Results</h2>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {/* Actions Bar */}
          <div className="d-flex  gap-4 mb-4 items-center justify-center bgDarkYellow p-2 rounded mt-2">
            <div className="col-md-2 text-center">
              <button onClick={exportToExcel} className="btn btn-dark ">
                Export to Excel
              </button>
            </div>
            <div className="col-md-3 text-center">
              <h2 className="font-bold">Results Uploaded Details</h2>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control w-30"
                placeholder="Search by any field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Search Indicator */}
          {searchQuery && (
            <div className="mb-3 text-blue-700">
              Search Result :- <span className="text-danger">Found {filteredData.length} Records</span>
            </div>
          )}

          {/* Stats bar */}
          <div className="mb-4">
            <span className="inline-block border border-orange-500 p-2 font-bold text-sm">
              Record Count: <span className="text-danger fw-bolder">{filteredData.length} </span> | Total Pages: <span className="text-danger fw-bolder">{totalPages || 0}</span>
            </span>
          </div>

          {/* Data Grid */}
          <div className="table-responsive">
            {filteredData.length > 0 ? (
              <table className="table table-hover align-middle border">
                <thead className="table-light">
                  <tr>
                    <th>User Email Id</th>
                    <th>Reg. Number</th>
                    <th>Mobile Number</th>
                    <th>BookingID</th>
                    <th>Instrument Name</th>
                    <th>Request Sheet</th>
                    <th>Request Date</th>
                    <th>Uploaded Result</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData.map((row, index) => (
                    <tr key={index}>
                      <td className="font-bold">{row.testUserId || 'NA'}</td>
                      <td className="font-bold">{row.IdProofNumber || 'NA'}</td>
                      <td className="font-bold">{row.mobileNumber || 'NA'}</td>
                      <td className="font-bold">{row.bookingId}</td>
                      <td className="font-bold">{row.instrumentName}</td>
                      <td>
                        {row.testSampleFile ? (
                          <button 
                            className="btn btn-sm btn-dark" 
                            onClick={() => downloadFile(row.testSampleFile!)}
                          >
                            View
                          </button>
                        ) : (
                          <span className="badge bg-info text-dark">N/A</span>
                        )}
                      </td>
                      <td className="font-bold">
                        {new Date(row.testDate).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td>
                        {row.uploadedResult ? (
                          <button 
                            className="btn btn-sm btn-dark" 
                            onClick={() => downloadFile(row.uploadedResult!)}
                          >
                            View
                          </button>
                        ) : (
                          <span className="badge bg-info text-dark">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20 border rounded bg-light">
                <h3 className="text-danger font-bold text-xl">No Result(s) Uploaded!</h3>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="btn btn-info btn-sm ">Prev</button>
              <span className='ms-3 me-3'>Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}</span>
            <button disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)} onClick={() => setCurrentPage(prev => prev + 1)} className="btn btn-danger btn-sm">Next</button>
              {/* <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className={`btn btn-link p-0 ${currentPage === 1 ? 'opacity-30' : ''}`}
              >
                <span className="text-3xl">&lsaquo;</span>
              </button>
              
              <span className="text-danger font-bold text-lg">
                {currentPage} / {totalPages}
              </span>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className={`btn btn-info p-0 ${currentPage === totalPages ? 'opacity-30' : ''}`}
              > 
                <span className="text-3xl">&rsaquo;</span>
              </button> */}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}