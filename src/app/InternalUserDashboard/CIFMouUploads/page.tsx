'use client';
import { useEffect, useState } from 'react';
import { mouService } from '@/services/mouService';
import { MouForm } from '@/components/CIF/MouForm';
import './new-mou.scss'; // Use your existing SCSS

export default function MouPage() {
  const [mous, setMous] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMous();
  }, []);

  const loadMous = async () => {
    try {
      const data = await mouService.viewMyMous('user@example.com');
      setMous(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mou-user-page">
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-3"><h1 className="page-titles">MOU Management</h1></div>
          <div className="col-md-3">
            {!showForm && (
              <button className="btn-create" onClick={() => setShowForm(true)}>
                <span className="btn-icon">＋</span> New MOU
              </button>
            )}
          </div>
        </div>
        <div className="header-accent"></div>
      </div>

      {showForm && (
        <MouForm 
          onClose={() => setShowForm(false)} 
          onSubmit={async (data) => {
            await mouService.insertMou(data);
            setShowForm(false);
            loadMous();
          }}
          submitting={false}
        />
      )}

      {/* Table Section using your existing .mou-table classes */}
      <div className="table-section">
        <table className="mou-table">
          <thead>
            <tr>
              <th>#</th>
              <th>MOU Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mous.map((m: any, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td className="td-title">{m.mouTitle}</td>
                <td><span className="badge-approved">{m.mouStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}