import React, { useState } from 'react';

interface MouFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  submitting: boolean;
}

export const MouForm: React.FC<MouFormProps> = ({ onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    mouTitle: '',
    mouStartDate: '',
    mouEndDate: '',
    mouRemarks: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, file });
  };

  return (
    <div className="form-card slide-in">
      <div className="form-card-header">
        <h2 className="form-card-title"><span className="title-dot"></span>Submit New MOU</h2>
        <button className="btn-close-form" onClick={onClose}>✕</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field-group full-width">
            <label className="field-label">MOU Title <span className="required">*</span></label>
            <input 
              className="field-input" 
              required 
              onChange={e => setFormData({...formData, mouTitle: e.target.value})} 
            />
          </div>
          <div className="field-group">
            <label className="field-label">Start Date *</label>
            <input 
              type="date" 
              className="field-input" 
              required 
              onChange={e => setFormData({...formData, mouStartDate: e.target.value})} 
            />
          </div>
          <div className="field-group">
            <label className="field-label">End Date *</label>
            <input 
              type="date" 
              className="field-input" 
              required 
              onChange={e => setFormData({...formData, mouEndDate: e.target.value})} 
            />
          </div>
          <div className="field-group full-width">
            <label className="field-label">Document *</label>
            <div className={`upload-zone ${file ? 'uploaded' : ''}`}>
              <input type="file" id="mouFile" className="upload-input" onChange={handleFileChange} />
              <label htmlFor="mouFile" className="upload-label">
                <span className="upload-icon">{file ? '✔' : '📄'}</span>
                <span className="upload-text">{file ? file.name : 'Click to upload PDF/Word'}</span>
              </label>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit MOU'}
          </button>
        </div>
      </form>
    </div>
  );
};