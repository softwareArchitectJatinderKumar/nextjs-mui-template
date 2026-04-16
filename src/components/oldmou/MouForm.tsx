'use client';
// components/mou/MouForm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Dedicated form component for creating and editing an MOU.
// Mirrors the Angular create-form section and the #editModal <ng-template>
// from new-Mou.html, including all validation, file-upload UX, and
// the current-file banner shown in edit mode.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import styles from '../../styles/mou.module.css';
import { MouFormState, MouFormErrors, FormMode } from '../../types/mou.types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MouFormProps {
  mode: FormMode;                   // 'create' | 'edit'
  form: MouFormState;
  onChange: (updated: MouFormState) => void;
  onClose: () => void;
  onSubmit: (fileData64: string, fileName: string) => void;
  submitting: boolean;
  editExistingFileName?: string;    // only populated in edit mode
  onToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

// ─── File-validation constants ────────────────────────────────────────────────

const MAX_FILE_BYTES = 5_242_880; // 5 MB
const ALLOWED_TYPES  = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// ─────────────────────────────────────────────────────────────────────────────

export default function MouForm({
  mode,
  form,
  onChange,
  onClose,
  onSubmit,
  submitting,
  editExistingFileName,
  onToast,
}: MouFormProps) {

  // ── Local state ─────────────────────────────────────────────────────────────
  const [touched,    setTouched]    = useState<Record<string, boolean>>({});
  const [fileData64, setFileData64] = useState('');
  const [fileName,   setFileName]   = useState('');
  const [fileStatus, setFileStatus] = useState(false);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const errors = validate(form);

  function fieldError(name: keyof MouFormErrors): string | undefined {
    return touched[name] ? errors[name] : undefined;
  }

  function markAllTouched() {
    setTouched({ mouTitle: true, mouStartDate: true, mouEndDate: true });
  }

  // ── Field helpers ────────────────────────────────────────────────────────────
  const set = (key: keyof MouFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...form, [key]: e.target.value });

  const blur = (key: keyof MouFormState) => () =>
    setTouched(prev => ({ ...prev, [key]: true }));

  // ── File handling (mirrors onFileSelected in Angular component) ──────────────
  const onFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFileStatus(false);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      onToast('File too large. Max allowed size is 5 MB.', 'warning');
      e.target.value = '';
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      onToast('Invalid file type. Only PDF and Word documents are allowed.', 'warning');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFileData64(base64);
      setFileName(file.name);
      setFileStatus(true);
    };
    reader.readAsDataURL(file);
  }, [onToast]);

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markAllTouched();
    if (Object.keys(errors).length > 0) return;
    if (!fileStatus) {
      onToast('Please upload the MOU document.', 'warning');
      return;
    }
    onSubmit(fileData64, fileName);
    // Reset local file state after handing off to parent
    setFileData64('');
    setFileName('');
    setFileStatus(false);
    setTouched({});
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Shared field block used in both create inline-card and edit modal
  // ─────────────────────────────────────────────────────────────────────────────

  const uploadId = mode === 'create' ? 'mouFile' : 'editFile';

  const formFields = (
    <div className={styles.formGrid}>

      {/* Title */}
      <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
        <label className={styles.fieldLabel}>
          MOU Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={`${styles.fieldInput}${fieldError('mouTitle') ? ` ${styles.invalid}` : ''}`}
          value={form.mouTitle}
          onChange={set('mouTitle')}
          onBlur={blur('mouTitle')}
          placeholder="Enter the full MOU title"
        />
        {fieldError('mouTitle') && (
          <span className={styles.errorMsg}>{errors.mouTitle}</span>
        )}
      </div>

      {/* Start Date */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>
          MOU Start Date <span className={styles.required}>*</span>
        </label>
        <input
          type="date"
          className={`${styles.fieldInput}${fieldError('mouStartDate') ? ` ${styles.invalid}` : ''}`}
          value={form.mouStartDate}
          onChange={set('mouStartDate')}
          onBlur={blur('mouStartDate')}
        />
        {fieldError('mouStartDate') && (
          <span className={styles.errorMsg}>{errors.mouStartDate}</span>
        )}
      </div>

      {/* End Date */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>
          MOU End Date <span className={styles.required}>*</span>
        </label>
        <input
          type="date"
          className={`${styles.fieldInput}${fieldError('mouEndDate') ? ` ${styles.invalid}` : ''}`}
          value={form.mouEndDate}
          min={form.mouStartDate}
          onChange={set('mouEndDate')}
          onBlur={blur('mouEndDate')}
        />
        {fieldError('mouEndDate') && (
          <span className={styles.errorMsg}>{errors.mouEndDate}</span>
        )}
      </div>

      {/* Document Upload */}
      <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
        <label className={styles.fieldLabel}>
          MOU Document <span className={styles.required}>*</span>
        </label>

        {/* Current-file banner — edit mode only */}
        {mode === 'edit' && editExistingFileName && (
          <div className={styles.currentFileBanner}>
            <span className={styles.currentFileIcon}>📎</span>
            <div className={styles.currentFileInfo}>
              <span className={styles.currentFileLabel}>Currently attached:</span>
              <span className={styles.currentFileName}>{editExistingFileName}</span>
            </div>
            <span className={styles.currentFileReplaceHint}>Upload below to replace</span>
          </div>
        )}

        <div
          className={[
            styles.uploadZone,
            fileStatus ? styles.uploaded : '',
            mode === 'edit' && !fileStatus ? styles.uploadRequired : '',
          ].join(' ')}
        >
          <input
            type="file"
            id={uploadId}
            className={styles.uploadInput}
            onChange={onFileSelected}
            accept=".pdf,.doc,.docx"
          />
          <label htmlFor={uploadId} className={styles.uploadLabel}>
            {fileStatus ? (
              <>
                <span className={`${styles.uploadIcon} ${styles.successIcon}`}>✔</span>
                <div className={styles.uploadTextGroup}>
                  <span className={styles.uploadFilename}>{fileName}</span>
                  <small className={styles.uploadHint}>Click to replace</small>
                </div>
              </>
            ) : (
              <>
                <span className={styles.uploadIcon}>📄</span>
                <div className={styles.uploadTextGroup}>
                  <span className={styles.uploadText}>Click to upload PDF or Word document (max 5 MB)</span>
                  {mode === 'edit' && (
                    <small className={styles.requiredHint}>Required — max 5 MB</small>
                  )}
                </div>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Remarks */}
      <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
        <label className={styles.fieldLabel}>Remarks</label>
        <textarea
          className={styles.fieldTextarea}
          rows={3}
          value={form.mouRemarks}
          onChange={set('mouRemarks')}
          placeholder="Add any relevant remarks or notes…"
        />
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // Render: inline card (create) vs modal (edit)
  // ─────────────────────────────────────────────────────────────────────────────

  const formBody = (
    <form onSubmit={handleSubmit} noValidate>
      {formFields}
      <div className={styles.formActions}>
        <button type="button" className={styles.btnSecondary} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={styles.btnPrimary} disabled={submitting}>
          {submitting && <span className={styles.spinner} />}
          {mode === 'create'
            ? submitting ? 'Submitting…' : 'Submit MOU'
            : submitting ? 'Saving…'     : 'Save Changes'}
        </button>
      </div>
    </form>
  );

  /* ── CREATE mode — inline card ─────────────────────────────────────────────── */
  if (mode === 'create') {
    return (
      <div className={`${styles.formCard} ${styles.slideIn}`}>
        <div className={styles.formCardHeader}>
          <h2 className={styles.formCardTitle}>
            <span className={styles.titleDot} />
            Submit New MOU
          </h2>
          <button className={styles.btnCloseForm} onClick={onClose} title="Close">✕</button>
        </div>
        <div className={styles.formBody}>{formBody}</div>
      </div>
    );
  }

  /* ── EDIT mode — modal overlay ─────────────────────────────────────────────── */
  return (
    <div
      className={styles.modalOverlay}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modalDialog}>
        <div className={styles.modalWrapper}>
          <div className={styles.modalHead}>
            <h3 className={styles.modalTitle}>Edit MOU</h3>
            <button className={styles.modalClose} onClick={onClose}>✕</button>
          </div>
          <div className={styles.modalBodyContent}>{formBody}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Validation (pure function) ───────────────────────────────────────────────

function validate(form: MouFormState): MouFormErrors {
  const errors: MouFormErrors = {};
  if (!form.mouTitle.trim())  errors.mouTitle     = 'MOU Title is required.';
  if (!form.mouStartDate)     errors.mouStartDate = 'Start date is required.';
  if (!form.mouEndDate)       errors.mouEndDate   = 'End date is required.';
  return errors;
}
