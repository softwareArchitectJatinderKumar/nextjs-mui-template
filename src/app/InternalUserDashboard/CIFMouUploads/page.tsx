'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

import myAppWebService from '@/services/myAppWebService';
import type {
  MouRecord,
  MouInsertPayload,
  MouUpdatePayload,
} from '@/types/mou.types';

import s from '@/styles/MouPage.module.scss';

// ─────────────────────────────────────────────────────────────────────────────
// Local types
// ─────────────────────────────────────────────────────────────────────────────
type FormMode = 'create' | 'edit' | null;

interface FormState {
  mouId:        string;
  mouTitle:     string;
  mouStartDate: string;
  mouEndDate:   string;
  mouRemarks:   string;
}

const BLANK_FORM: FormState = {
  mouId:        '',
  mouTitle:     '',
  mouStartDate: '',
  mouEndDate:   '',
  mouRemarks:   '',
};

const SERVER_URL =
  'http://172.19.2.52/umsweb/webftp/CIFDocuments/CIFMouDocuments/';

const PAGE_SIZE = 8;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function toInputDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
}

function statusLabel(row: MouRecord): string {
  if (row.mouStatus === '0')      return 'Expired';
  if (row.mouStatus === '1')      return 'Active';
  if (row.isApproved === 'True')  return 'Approved';
  if (row.isApproved === 'False') return 'Disapproved';
  return 'Pending';
}

function statusClass(row: MouRecord): string {
  if (row.mouStatus === '0')      return s.badgeExpired;
  if (row.mouStatus === '1')      return s.badgeActive;
  if (row.isApproved === 'True')  return s.badgeApproved;
  if (row.isApproved === 'False') return s.badgeDisapproved;
  return s.badgePending;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function MouPage() {
  const router = useRouter();

  // ── Session ────────────────────────────────────────────────────────────────
  const [userEmail, setUserEmail] = useState('');

  // ── Data ───────────────────────────────────────────────────────────────────
  const [mouList,   setMouList]   = useState<MouRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [formMode,    setFormMode]    = useState<FormMode>(null);
  const [editingRow,  setEditingRow]  = useState<MouRecord | null>(null);
  const [showModal,   setShowModal]   = useState(false);

  // ── Search / pagination ────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ── Form fields ────────────────────────────────────────────────────────────
  const [form,       setForm]       = useState<FormState>(BLANK_FORM);
  const [touched,    setTouched]    = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // ── File state ─────────────────────────────────────────────────────────────
  const [fileData64,           setFileData64]           = useState('');
  const [fileName,             setFileName]             = useState('');
  const [fileStatus,           setFileStatus]           = useState(false);
  const [editExistingFileName, setEditExistingFileName] = useState('');

  const createFileRef = useRef<HTMLInputElement>(null);
  const editFileRef   = useRef<HTMLInputElement>(null);

  // ── Session load ───────────────────────────────────────────────────────────
  useEffect(() => {
    const rawData = Cookies.get('InternalUserAuthData');
    if (!rawData || rawData.trim().length === 0) {
      Swal.fire({ title: 'Login Failed', icon: 'warning' });
      router.push('/Home');
      return;
    }
    try {
      const c = JSON.parse(rawData);
      setUserEmail(c.EmailId ?? '');
    } catch {
      Cookies.remove('InternalUserAuthData');
      router.push('/Home');
    }
  }, [router]);

  // ── Load MOUs ──────────────────────────────────────────────────────────────
  const loadMyMous = useCallback(async (email: string) => {
    if (!email) return;
    setIsLoading(true);
    try {
      const res = await myAppWebService.viewMyMous(email);
      setMouList(res?.item1 ?? []);
      setCurrentPage(1);
    } catch {
      // error already logged in service
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userEmail) loadMyMous(userEmail);
  }, [userEmail, loadMyMous]);

  // ── Filtered + paged data ──────────────────────────────────────────────────
  const filteredList = searchQuery.trim()
    ? mouList.filter(m =>
        Object.values(m).some(v =>
          String(v).toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    : mouList;

  const totalPages  = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const start       = (currentPage - 1) * PAGE_SIZE;
  const pagedList   = filteredList.slice(start, start + PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // ── Form helpers ───────────────────────────────────────────────────────────
  const resetForm = () => {
    setForm(BLANK_FORM);
    setFileData64('');
    setFileName('');
    setFileStatus(false);
    setEditExistingFileName('');
    setTouched({});
    if (createFileRef.current) createFileRef.current.value = '';
    if (editFileRef.current)   editFileRef.current.value   = '';
  };

  const openCreateForm = () => {
    resetForm();
    setFormMode('create');
  };

  const closeForm = () => {
    setFormMode(null);
    resetForm();
  };

  // ── Edit modal ─────────────────────────────────────────────────────────────
  const openEditModal = (row: MouRecord) => {
    setEditingRow(row);
    setForm({
      mouId:        row.mouId        ?? '',
      mouTitle:     row.mouTitle,
      mouStartDate: toInputDate(row.mouStartDate),
      mouEndDate:   toInputDate(row.mouEndDate),
      mouRemarks:   row.mouRemarks   ?? '',
    });
    setFileData64('');
    setFileName('');
    setFileStatus(false);
    setTouched({});
    setEditExistingFileName(
      row.mouDocumentUrl
        ? row.mouDocumentUrl.split('/').pop() ?? row.mouDocumentUrl
        : '',
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    setFileStatus(false);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5242880) {
      Swal.fire({ title: 'File too large', text: 'Max allowed size is 5 MB.', icon: 'warning' });
      e.target.value = '';
      return;
    }

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type)) {
      Swal.fire({ title: 'Invalid file type', text: 'Only PDF and Word documents are allowed.', icon: 'warning' });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileData64((reader.result as string).split(',')[1]);
      setFileName(file.name);
      setFileStatus(true);
    };
    reader.readAsDataURL(file);
  };

  // ── Form field change ──────────────────────────────────────────────────────
  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name: string) =>
    setTouched(prev => ({ ...prev, [name]: true }));

  // ── Validation ─────────────────────────────────────────────────────────────
  const errors = {
    mouTitle:     !form.mouTitle.trim()     ? 'MOU Title is required.'    : '',
    mouStartDate: !form.mouStartDate        ? 'Start date is required.'   : '',
    mouEndDate:   !form.mouEndDate          ? 'End date is required.'     : '',
  };

  const isFormValid = Object.values(errors).every(e => !e);

  const touchAll = () =>
    setTouched({ mouTitle: true, mouStartDate: true, mouEndDate: true });

  // ── Submit: Insert ─────────────────────────────────────────────────────────
  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAll();
    if (!isFormValid) return;

    if (!fileStatus) {
      Swal.fire({ title: 'Document required', text: 'Please upload the MOU document.', icon: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const payload: MouInsertPayload = {
        mouTitle:        form.mouTitle,
        mouDocumentData: fileData64,
        mouDocumentUrl:  fileName,
        mouStartDate:    form.mouStartDate,
        mouEndDate:      form.mouEndDate,
        mouRemarks:      form.mouRemarks,
        userId:          userEmail,
      };

      const res = await myAppWebService.insertMou(payload);
      if (res?.item1?.[0]?.msg === 'Success') {
        await Swal.fire({ title: 'MOU Submitted!', icon: 'success' });
        closeForm();
        loadMyMous(userEmail);
      } else {
        Swal.fire({ title: 'Submission Failed', icon: 'error' });
      }
    } catch {
      Swal.fire({ title: 'Error', text: 'Could not submit MOU.', icon: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit: Update ─────────────────────────────────────────────────────────
  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAll();
    if (!isFormValid) return;

    if (!fileStatus) {
      Swal.fire({
        title: 'Document required',
        text:  'Please upload the MOU document to proceed with the update.',
        icon:  'warning',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload: MouUpdatePayload = {
        mouId:           form.mouId,
        mouTitle:        form.mouTitle,
        mouDocumentData: fileData64,
        mouDocumentUrl:  fileName,
        mouStartDate:    form.mouStartDate,
        mouEndDate:      form.mouEndDate,
        mouRemarks:      form.mouRemarks,
        loginName:       userEmail,
        userId:          userEmail,
      };

      const res = await myAppWebService.updateMou(payload);
      if (res?.item1?.[0]?.msg === 'Success') {
        await Swal.fire({ title: 'MOU Updated!', icon: 'success' });
        closeModal();
        loadMyMous(userEmail);
      } else {
        Swal.fire({ title: 'Update Failed', icon: 'error' });
      }
    } catch {
      Swal.fire({ title: 'Error', text: 'Could not update MOU.', icon: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Document view ──────────────────────────────────────────────────────────
  const viewDocument = (_url: string | undefined) => {
    window.open(SERVER_URL + 'CIF_Mou_Document_703472083_.pdf', '_blank');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────────────────────────────────
  const FileUploadZone = ({
    inputRef,
    inputId,
  }: {
    inputRef: React.RefObject<HTMLInputElement | null>;
    inputId: string;
  }) => (
    <div
      className={`${s.uploadZone} ${fileStatus ? s.uploaded : ''} ${
        !fileStatus && formMode === 'edit' ? s.uploadRequired : ''
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        id={inputId}
        className={s.uploadInput}
        onChange={handleFileSelected}
        accept=".pdf,.doc,.docx"
      />
      <label htmlFor={inputId} className={s.uploadLabel}>
        {fileStatus ? (
          <>
            <span className={`${s.uploadIcon} ${s.successIcon}`}>✔</span>
            <div className={s.uploadTextGroup}>
              <span className={s.uploadFilename}>{fileName}</span>
              <small className={s.uploadHint}>Click to replace</small>
            </div>
          </>
        ) : (
          <>
            <span className={s.uploadIcon}>📄</span>
            <div className={s.uploadTextGroup}>
              <span className={s.uploadText}>Click to upload PDF or Word document</span>
              <small className={s.requiredHint}>Required — max 5 MB</small>
            </div>
          </>
        )}
      </label>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={s.mouPage}>

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-3 m-2 p-2">
            <h1 className={s.pageTitle}>MOU Management</h1>
          </div>
          <div className="col-md-3 m-2 p-2">
            <h4 className={s.pageSubtitle}>Memorandum of Undertakings</h4>
          </div>
          <div className="col-md-3 m-2 p-2">
            {formMode === null && (
              <button className={s.btnCreate} onClick={openCreateForm}>
                <span>＋</span> New MOU
              </button>
            )}
          </div>
        </div>
        <div className={s.headerAccent} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
           CREATE FORM
      ══════════════════════════════════════════════════════════════════════ */}
      {formMode === 'create' && (
        <div className={s.formCard}>
          <div className={s.formCardHeader}>
            <h2 className={s.formCardTitle}>
              <span className={s.titleDot} />
              Submit New MOU
            </h2>
            <button className={s.btnCloseForm} onClick={closeForm} title="Close">
              ✕
            </button>
          </div>

          <div className={s.formBody}>
            <form onSubmit={submitCreate} noValidate>
              <div className={s.formGrid}>

                {/* Title */}
                <div className={`${s.fieldGroup} ${s.fullWidth}`}>
                  <label className={s.fieldLabel}>
                    MOU Title <span className={s.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="mouTitle"
                    className={`${s.fieldInput} ${
                      touched.mouTitle && errors.mouTitle ? s.invalid : ''
                    }`}
                    value={form.mouTitle}
                    onChange={handleFieldChange}
                    onBlur={() => handleBlur('mouTitle')}
                    placeholder="Enter the full MOU title"
                  />
                  {touched.mouTitle && errors.mouTitle && (
                    <span className={s.errorMsg}>{errors.mouTitle}</span>
                  )}
                </div>

                {/* Start Date */}
                <div className={s.fieldGroup}>
                  <label className={s.fieldLabel}>
                    MOU Start Date <span className={s.required}>*</span>
                  </label>
                  <input
                    type="date"
                    name="mouStartDate"
                    className={`${s.fieldInput} ${
                      touched.mouStartDate && errors.mouStartDate ? s.invalid : ''
                    }`}
                    value={form.mouStartDate}
                    onChange={handleFieldChange}
                    onBlur={() => handleBlur('mouStartDate')}
                  />
                  {touched.mouStartDate && errors.mouStartDate && (
                    <span className={s.errorMsg}>{errors.mouStartDate}</span>
                  )}
                </div>

                {/* End Date */}
                <div className={s.fieldGroup}>
                  <label className={s.fieldLabel}>
                    MOU End Date <span className={s.required}>*</span>
                  </label>
                  <input
                    type="date"
                    name="mouEndDate"
                    className={`${s.fieldInput} ${
                      touched.mouEndDate && errors.mouEndDate ? s.invalid : ''
                    }`}
                    value={form.mouEndDate}
                    onChange={handleFieldChange}
                    onBlur={() => handleBlur('mouEndDate')}
                    min={form.mouStartDate}
                  />
                  {touched.mouEndDate && errors.mouEndDate && (
                    <span className={s.errorMsg}>{errors.mouEndDate}</span>
                  )}
                </div>

                {/* Document Upload */}
                <div className={`${s.fieldGroup} ${s.fullWidth}`}>
                  <label className={s.fieldLabel}>
                    MOU Document <span className={s.required}>*</span>
                  </label>
                  <FileUploadZone inputRef={createFileRef} inputId="mouFileCreate" />
                </div>

                {/* Remarks */}
                <div className={`${s.fieldGroup} ${s.fullWidth}`}>
                  <label className={s.fieldLabel}>Remarks</label>
                  <textarea
                    name="mouRemarks"
                    className={s.fieldTextarea}
                    value={form.mouRemarks}
                    onChange={handleFieldChange}
                    rows={3}
                    placeholder="Add any relevant remarks or notes…"
                  />
                </div>

              </div>

              <div className={s.formActions}>
                <button type="button" className={s.btnSecondary} onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className={s.btnPrimary} disabled={submitting}>
                  {submitting && <span className={s.spinner} />}
                  {submitting ? 'Submitting…' : 'Submit MOU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
           MY MOUs TABLE
      ══════════════════════════════════════════════════════════════════════ */}
      <div className={s.tableSection}>
        <div className={s.tableToolbar}>
          <h2 className={s.sectionTitle}>My Submitted MOUs</h2>
          <div className={s.toolbarRight}>
            <div className={s.searchBox}>
              <span>🔍</span>
              <input
                type="text"
                className={s.searchInput}
                placeholder="Search by title, user, org…"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <span className={s.recordCount}>{filteredList.length} records</span>
          </div>
        </div>

        {isLoading && (
          <div className={s.loadingState}>
            <div className={s.loadingSpinner} />
            <p>Loading your MOUs…</p>
          </div>
        )}

        {!isLoading && filteredList.length === 0 && (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>📋</div>
            <p className={s.emptyTitle}>No MOUs found</p>
            <p className={s.emptySub}>Click &ldquo;New MOU&rdquo; to submit your first memorandum.</p>
          </div>
        )}

        {!isLoading && filteredList.length > 0 && (
          <div className={s.tableResponsive}>
            <table className={`${s.mouTable} table table-striped table-hover mb-0`}>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>MOU Title</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Approval Status</th>
                  <th>Status</th>
                  <th>Submitted On</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                {pagedList.map((row, i) => (
                  <tr key={row.mouId ?? i}>
                    <td className={s.tdIndex}>
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>

                    <td>
                      <div className={s.tdTitle}>
                        <span className={s.titleText}>{row.mouTitle}</span>
                        <small className={s.remarksText}>{row.mouRemarks}</small>
                      </div>
                    </td>

                    <td>{row.mouStartDate}</td>
                    <td>{row.mouEndDate}</td>

                    <td>
                      {row.isApproved === 'True' && (
                        <span className={`${s.statusBadge} ${s.badgeApproved}`}>
                          ✔ Approved
                        </span>
                      )}
                      {row.isApproved === 'False' && (
                        <span className={`${s.statusBadge} ${s.badgeDisapproved}`}>
                          ✘ Disapproved
                        </span>
                      )}
                      {row.isApproved !== 'True' && row.isApproved !== 'False' && (
                        <span className={`${s.statusBadge} ${s.badgePending}`}>
                          ⏳ Pending
                        </span>
                      )}
                    </td>

                    <td>
                      <span className={`${s.statusBadge} ${statusClass(row)}`}>
                        {statusLabel(row)}
                      </span>
                    </td>

                    <td>{row.createdOn}</td>

                    <td>
                      {row.mouDocumentUrl ? (
                        <button
                          className={s.btnDoc}
                          onClick={() => viewDocument(row.mouDocumentUrl)}
                        >
                          📄 View
                        </button>
                      ) : (
                        <span className={s.noDoc}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className={s.pagination}>
            <button
              className={s.pgBtn}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            {pageNumbers.map(n => (
              <button
                key={n}
                className={`${s.pgBtn} ${currentPage === n ? s.active : ''}`}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className={s.pgBtn}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
           EDIT MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div
          className={s.modalOverlay}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className={s.modalWrapper}>
            <div className={s.modalHead}>
              <h3 className={s.modalTitle}>Edit MOU</h3>
              <button className={s.modalClose} onClick={closeModal}>✕</button>
            </div>

            <div className={s.modalBodyContent}>
              <form onSubmit={submitUpdate} noValidate>
                <div className={s.formGrid}>

                  {/* Title */}
                  <div className={`${s.fieldGroup} ${s.fullWidth}`}>
                    <label className={s.fieldLabel}>
                      MOU Title <span className={s.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="mouTitle"
                      className={`${s.fieldInput} ${
                        touched.mouTitle && errors.mouTitle ? s.invalid : ''
                      }`}
                      value={form.mouTitle}
                      onChange={handleFieldChange}
                      onBlur={() => handleBlur('mouTitle')}
                    />
                    {touched.mouTitle && errors.mouTitle && (
                      <span className={s.errorMsg}>{errors.mouTitle}</span>
                    )}
                  </div>

                  {/* Start Date */}
                  <div className={s.fieldGroup}>
                    <label className={s.fieldLabel}>
                      Start Date <span className={s.required}>*</span>
                    </label>
                    <input
                      type="date"
                      name="mouStartDate"
                      className={`${s.fieldInput} ${
                        touched.mouStartDate && errors.mouStartDate ? s.invalid : ''
                      }`}
                      value={form.mouStartDate}
                      onChange={handleFieldChange}
                      onBlur={() => handleBlur('mouStartDate')}
                    />
                    {touched.mouStartDate && errors.mouStartDate && (
                      <span className={s.errorMsg}>{errors.mouStartDate}</span>
                    )}
                  </div>

                  {/* End Date */}
                  <div className={s.fieldGroup}>
                    <label className={s.fieldLabel}>
                      End Date <span className={s.required}>*</span>
                    </label>
                    <input
                      type="date"
                      name="mouEndDate"
                      className={`${s.fieldInput} ${
                        touched.mouEndDate && errors.mouEndDate ? s.invalid : ''
                      }`}
                      value={form.mouEndDate}
                      onChange={handleFieldChange}
                      onBlur={() => handleBlur('mouEndDate')}
                      min={form.mouStartDate}
                    />
                    {touched.mouEndDate && errors.mouEndDate && (
                      <span className={s.errorMsg}>{errors.mouEndDate}</span>
                    )}
                  </div>

                  {/* Document Upload — REQUIRED on edit */}
                  <div className={`${s.fieldGroup} ${s.fullWidth}`}>
                    <label className={s.fieldLabel}>
                      MOU Document <span className={s.required}>*</span>
                    </label>

                    {editExistingFileName && (
                      <div className={s.currentFileBanner}>
                        <span className={s.currentFileIcon}>📎</span>
                        <div className={s.currentFileInfo}>
                          <span className={s.currentFileLabel}>Currently attached:</span>
                          <span className={s.currentFileName}>{editExistingFileName}</span>
                        </div>
                        <span className={s.currentFileReplaceHint}>Upload below to replace</span>
                      </div>
                    )}

                    <FileUploadZone inputRef={editFileRef} inputId="mouFileEdit" />
                  </div>

                  {/* Remarks */}
                  <div className={`${s.fieldGroup} ${s.fullWidth}`}>
                    <label className={s.fieldLabel}>Remarks</label>
                    <textarea
                      name="mouRemarks"
                      className={s.fieldTextarea}
                      value={form.mouRemarks}
                      onChange={handleFieldChange}
                      rows={3}
                      placeholder="Add any relevant remarks or notes…"
                    />
                  </div>

                </div>

                <div className={s.formActions}>
                  <button type="button" className={s.btnSecondary} onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className={s.btnPrimary} disabled={submitting}>
                    {submitting && <span className={s.spinner} />}
                    {submitting ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
