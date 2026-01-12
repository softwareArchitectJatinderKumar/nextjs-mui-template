import React from 'react';
import styles from '@/styles/Instruments.module.css';

interface Props {
  charges: any[];
  onClose: () => void;
}

const ChargesModal: React.FC<Props> = ({ charges, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className="modal-dialog modal-lg w-100" 
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">Testing Charges</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <table className="table table-striped table-hover border">
              <thead className="table-secondary">
                <tr>
                  <th className="fw-bold">User Category</th>
                  <th className="fw-bold">Analysis Name</th>
                  <th className="fw-bold">Charges</th>
                </tr>
              </thead>
              <tbody>
                {charges.length > 0 ? (
                  charges.map((data, i) => (
                    <tr key={i}>
                      <td>
                        {data.orgTypeId === 1 ? "External User" : 
                         data.orgTypeId === 2 ? "LPU User" : "Industry User"}
                      </td>
                      <td>{data.sampleText}</td>
                      <td className="text-success fw-bold">₹{data.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-4">No charge details found for this instrument.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargesModal;