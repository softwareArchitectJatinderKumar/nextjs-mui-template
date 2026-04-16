// 'use client';
// // src/components/CIF/MouForm.tsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Service-integrated MOU Form component for CIFMouUploads page.
// // Now uses mouService.ts pattern: base64 file handling, validation, edit/create modes.
// // Mirrors src/components/mou/MouForm.tsx structure.

// import { useState, useCallback } from 'react';
// import styles from '@/styles/mou.module.css';  // Reuse mou.module.css
// import type { MouFormState, FormMode } from '@/types/mou.types';
// import type { MouFormErrors } from '@/types/mou.types';

// // ─── Props ────────────────────────────────────────────────────────────────────
// interface CIFMouFormProps {
//   mode: FormMode;                   
//   form: MouFormState;
//   onChange: (updated: MouFormState) => void;
//   onClose: () => void;
//   onSubmit: (fileData64: string, fileName: string) => void;
//   submitting: boolean;
//   editExistingFileName?: string;
//   onToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
// }

// // ─── File-validation constants ────────────────────────────────────────────────
// const MAX_FILE_BYTES = 5_242_880; // 5 MB
// const ALLOWED_TYPES  = [
//   'application/pdf',
//   'application/msword',
//   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// export default function CIFMouForm({
//   mode,
//   form,
//   onChange,
//   onClose,
//   onSubmit,
//   submitting,
//   editExistingFileName,
//   onToast,
// }: CIFMouFormProps) {

//   // ── Local state ─────────────────────────────────────────────────────────────
//   const [touched,    setTouched]    = useState<Record<string, boolean>>({});
//   const [fileData64, setFileData64] = useState('');
//   const [fileName,   setFileName]   = useState('');
//   const [fileStatus, setFileStatus] = useState(false);

//   // ── Derived ─────────────────────────────────────────────────────────────────
//   const errors = validate(form);

//   function fieldError(name: keyof MouFormErrors): string | undefined {
//     return touched[name] ? errors[name] : undefined;
//   }

//   function markAllTouched() {
//     setTouched({ mouTitle: true, mouStartDate: true, mouEndDate: true });
//   }

//   // ── Field helpers ────────────────────────────────────────────────────────────
//   const setField = (key: keyof MouFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
//     onChange({ ...form, [key]: e.target.value });

//   const blurField = (key: keyof MouFormState) => () =>
//     setTouched(prev => ({ ...prev, [key]: true }));

//   // ── File handling (for mouService.ts integration) ───────────────────────────
//   const onFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setFileStatus(false);
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > MAX_FILE_BYTES) {
//       onToast('File too large. Max allowed size is 5 MB.', 'warning');
//       e.target.value = '';
//       return;
//     }
//     if (!ALLOWED_TYPES.includes(file.type)) {
//       onToast('Invalid file type. Only PDF and Word documents are allowed.', 'warning');
//       e.target.value = '';
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       const base64 = (reader.result as string).split(',')[1];
//       setFileData64(base64);
//       setFileName(file.name);
//       setFileStatus(true);
//     };
//     reader.readAsDataURL(file);
//   }, [onToast]);

//   // ── Submit (passes fileData64 to parent for mouService.insertMou) ────────────
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     markAllTouched();
//     if (Object.keys(errors).length > 0) return;
//     if (!fileStatus) {
//       onToast('Please upload the MOU document.', 'warning');
//       return;
//     }
//     onSubmit(fileData64, fileName);
//     // Reset after submit
//     setFileData64('');
//     setFileName('');
//     setFileStatus(false);
//     setTouched({});
//   };

//   // ── Form fields JSX ─────────────────────────────────────────────────────────
//   const formFields = (
//     <div className={styles.formGrid}>
//       {/* Title */}
//       <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
//         <label className={styles.fieldLabel}>
//           MOU Title <span className={styles.required}>*</span>
//         </label>
//         <input
//           type="text"
//           className={`${styles.fieldInput}${fieldError('mouTitle') ? ` ${styles.invalid}` : ''}`}
//           value={form.mouTitle}
//           onChange={setField('mouTitle')}
//           onBlur={blurField('mouTitle')}
//           placeholder="Enter the full MOU title"
//         />
//         {fieldError('mouTitle') && <span className={styles.errorMsg}>{errors.mouTitle}</span>}
//       </div>

//       {/* Dates */}
//       <div className={styles.fieldGroup}>
//         <label className={styles.fieldLabel}>Start Date <span className={styles.required}>*</span></label>
//         <input
//           type="date"
//           className={`${styles.fieldInput}${fieldError('mouStartDate') ? ` ${styles.invalid}` : ''}`}
//           value={form.mouStartDate}
//           onChange={setField('mouStartDate')}
//           onBlur={blurField('mouStartDate')}
//         />
//         {fieldError('mouStartDate') && <span className={styles.errorMsg}>{errors.mouStartDate}</span>}
//       </div>

//       <div className={styles.fieldGroup}>
//         <label className={styles.fieldLabel}>End Date <span className={styles.required}>*</span></label>
//         <input
//           type="date"
//           className={`${styles.fieldInput}${fieldError('mouEndDate') ? ` ${styles.invalid}` : ''}`}
//           value={form.mouEndDate}
//           min={form.mouStartDate}
//           onChange={setField('mouEndDate')}
//           onBlur={blurField('mouEndDate')}
//         />
//         {fieldError('mouEndDate') && <span className={styles.errorMsg}>{errors.mouEndDate}</span>}
//       </div>

//       {/* File Upload (key for mouService) */}
//       <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
//         <label className={styles.fieldLabel}>MOU Document <span className={styles.required}>*</span></label>
        
//         {/* Edit mode: show current file */}
//         {mode === 'edit' && editExistingFileName && (
//           <div className={styles.currentFileBanner}>
//             <span className={styles.currentFileIcon}>📎</span>
//             <span className={styles.currentFileName}>{editExistingFileName}</span>
//             <small>Upload to replace</small>
//           </div>
//         )}

//         <div className={[
//           styles.uploadZone,
//           fileStatus ? styles.uploaded : '',
//           mode === 'edit' && !fileStatus ? styles.uploadRequired : ''
//         ].join(' ')}>
//           <input
//             type="file"
//             id="cifMouFile"
//             className={styles.uploadInput}
//             onChange={onFileSelected}
//             accept=".pdf,.doc,.docx"
//           />
//           <label htmlFor="cifMouFile" className={styles.uploadLabel}>
//             {fileStatus ? (
//               <>
//                 <span className={`${styles.uploadIcon} ${styles.successIcon}`}>✔</span>
//                 <span>{fileName}</span>
//               </>
//             ) : (
//               <>
//                 <span className={styles.uploadIcon}>📄</span>
//                 <span>Click to upload PDF/Word (max 5MB)</span>
//               </>
//             )}
//           </label>
//         </div>
//       </div>

//       {/* Remarks */}
//       <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
//         <label className={styles.fieldLabel}>Remarks (optional)</label>
//         <textarea
//           className={styles.fieldTextarea}
//           rows={3}
//           value={form.mouRemarks}
//           onChange={setField('mouRemarks')}
//           placeholder="Additional notes..."
//         />
//       </div>
//     </div>
//   );

//   // ── Render: Create (inline) vs Edit (modal) ─────────────────────────────────
//   const formBody = (
//     <form onSubmit={handleSubmit}>
//       {formFields}
//       <div className={styles.formActions}>
//         <button type="button" className={styles.btnSecondary} onClick={onClose}>
//           Cancel
//         </button>
//         <button type="submit" className={styles.btnPrimary} disabled={submitting}>
//           {submitting ? 'Processing...' : mode === 'create' ? 'Submit MOU' : 'Save Changes'}
//         </button>
//       </div>
//     </form>
//   );

//   if (mode === 'create') {
//     return (
//       <div className={`${styles.formCard} ${styles.slideIn}`}>
//         <div className={styles.formCardHeader}>
//           <h2>New MOU</h2>
//           <button className={styles.btnCloseForm} onClick={onClose}>✕</button>
//         </div>
//         {formBody}
//       </div>
//     );
//   }

//   return (
//     <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className={styles.modalDialog}>
//         <div className={styles.modalHead}>
//           <h3>Edit MOU</h3>
//           <button className={styles.modalClose} onClick={onClose}>✕</button>
//         </div>
//         {formBody}
//       </div>
//     </div>
//   );
// }

// // ── Validation (reused from mouForm) ──────────────────────────────────────────
// function validate(form: MouFormState): MouFormErrors {
//   const errors: MouFormErrors = {};
//   if (!form.mouTitle?.trim()) errors.mouTitle = 'Title required';
//   if (!form.mouStartDate) errors.mouStartDate = 'Start date required';
//   if (!form.mouEndDate) errors.mouEndDate = 'End date required';
//   if (form.mouStartDate && form.mouEndDate && form.mouStartDate > form.mouEndDate) {
//     errors.mouEndDate = 'End date must be after start date';
//   }
//   return errors;
// }

