import myAppWebService from '@/services/myAppWebService';
import React, { useState } from 'react';
 import styles from './SampleStatus.module.css';
import Swal from 'sweetalert2';

const StatusModal = ({ data, onClose, onRefresh }: any) => {
  const [status, setStatus] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('BookingId', data.bookingId);
    formData.append('InstrumentId', data.instrumentId);
    formData.append('SampleCondition', status);
    formData.append('ReceivedOn', receivedDate);

    try {
      const res = await myAppWebService.NewSAmpleStatus(formData);
      if (res?.item1?.[0]?.msg === 'Success') {
        Swal.fire('Success', 'Status Updated', 'success').then(onRefresh);
      } else {
        Swal.fire('Notice', res?.item1?.[0]?.msg || 'Update failed', 'info');
      }
    } catch (error) {
      Swal.fire('Error', 'Server error occurred', 'error');
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <>
    {/* Semi-transparent Backdrop */}
      <div className={styles.modalBackdrop} onClick={onClose} />
      
      {/* Modal Container */}
      <div className="modal show d-block" tabIndex={-1} role="dialog">
        {/* ADDED: modal-dialog-centered */}
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title">Update Sample Status</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="fw-bold mb-1">Sample Status</label>
                  <select 
                    className="form-control" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="Poor">Poor</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="fw-bold mb-1">Received Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={receivedDate} 
                    onChange={(e) => setReceivedDate(e.target.value)} 
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button 
                type="button" 
                className="btn btn-dark" 
                onClick={handleSubmit} 
                disabled={!status || !receivedDate || submitting}
              >
                {submitting ? 'Processing...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
    // <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    //   <div className="modal-dialog modal-lg">
    //     <div className="modal-content">
    //       <div className="modal-header">
    //         <h5 className="modal-title">Update Status</h5>
    //         <button className="btn-close" onClick={onClose}></button>
    //       </div>
    //       <div className="modal-body">
    //         <div className="row">
    //           <div className="col-md-6 mb-3">
    //             <label>Status</label>
    //             <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
    //               <option value="">Select Status</option>
    //               <option value="Poor">Poor</option>
    //               <option value="Good">Good</option>
    //               <option value="Excellent">Excellent</option>
    //             </select>
    //           </div>
    //           <div className="col-md-6 mb-3">
    //             <label>Received Date</label>
    //             <input type="date" className="form-control" value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} />
    //           </div>
    //         </div>
    //       </div>
    //       <div className="modal-footer">
    //         <button className="btn btn-secondary" onClick={onClose}>Close</button>
    //         <button className="btn btn-dark" onClick={handleSubmit} disabled={!status || !receivedDate || submitting}>
    //           {submitting ? 'Updating...' : 'Update Status'}
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default StatusModal;