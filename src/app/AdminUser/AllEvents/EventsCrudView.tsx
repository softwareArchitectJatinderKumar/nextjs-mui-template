// =============================================================
//  events-crud/EventsCrudView.tsx
//  Pure UI component — receives all state/handlers as props.
//  Mirrors the Angular .html template exactly.
// =============================================================

'use client';

import React from 'react';
import { CATEGORIES, EventModel, MAX_FILE_SIZE_MB, SERVER_URL, UseEventsReturn } from './types';
import styles from './EventsCrud.module.css';

// ─── Pagination Nav ───────────────────────────────────────────────────────────

function PaginationNav({
  currentPage,
  totalPages,
  goToPage,
}: {
  currentPage: number;
  totalPages: number;
  goToPage: (p: number) => void;
}) {
  return (
    <nav aria-label="Events pagination">
      <ul className="pagination pagination-sm mb-0">
        <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
          <a className="page-link" onClick={() => goToPage(currentPage - 1)} style={{ cursor: 'pointer' }}>
            Previous
          </a>
        </li>
        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i} className={`page-item${currentPage === i + 1 ? ' active' : ''}`}>
            <a className="page-link" onClick={() => goToPage(i + 1)} style={{ cursor: 'pointer' }}>
              {i + 1}
            </a>
          </li>
        ))}
        <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
          <a className="page-link" onClick={() => goToPage(currentPage + 1)} style={{ cursor: 'pointer' }}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function EventsCrudView(props: UseEventsReturn) {
  const {
    paginatedData,
    isLoading,
    formValues,
    formErrors,
    isFormSubmitted,
    isEditMode,
    currentEventId,
    currentImageUrl,
    eventFileData,
    fileInputRef,
    searchTerm,
    pageSize,
    currentPage,
    totalPages,
    setFormValues,
    onSubmit,
    onEdit,
    onDelete,
    onFileSelected,
    onViewFile,
    onSearchChange,
    onPageSizeChange,
    goToPage,
    resetForm,
  } = props;

  return (
    <>
      {/* ── Full-screen loader ── */}
      {isLoading && (
        <div className={styles.fullscreenLoader}>
          <div className={styles.spinnerOverlay}>
            <div className={`${styles.spinnerContent} text-center`}>
              <img src="/assets/images/spinner.gif" alt="Loading..." />
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">

        {/* ═══════════════════════════════════════════════════════
            ADD / EDIT FORM
            Mirrors Angular's [formGroup]="eventForm" section
            ═══════════════════════════════════════════════════════ */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h2 className="m-0 font-weight-bold text-primary">
                  {isEditMode
                    ? `Edit Event (ID: ${currentEventId})`
                    : 'Add New Event'}
                </h2>
              </div>

              <div className="card-body">
                <form onSubmit={onSubmit} className="needs-validation" noValidate>

                  {/* ── Event Name ── */}
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label required">Event Name</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className={`form-control${isFormSubmitted && formErrors.eventName ? ' is-invalid' : ''}`}
                        value={formValues.eventName}
                        maxLength={1500}
                        onChange={(e) =>
                          setFormValues((v) => ({ ...v, eventName: e.target.value }))
                        }
                      />
                      {isFormSubmitted && formErrors.eventName && (
                        <div className="invalid-feedback">{formErrors.eventName}</div>
                      )}
                    </div>
                  </div>

                  {/* ── Date + Category ── */}
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label required">Date</label>
                    <div className="col-sm-3">
                      <input
                        type="date"
                        className={`form-control${isFormSubmitted && formErrors.eventDate ? ' is-invalid' : ''}`}
                        value={formValues.eventDate}
                        onChange={(e) =>
                          setFormValues((v) => ({ ...v, eventDate: e.target.value }))
                        }
                      />
                      {isFormSubmitted && formErrors.eventDate && (
                        <div className="invalid-feedback">{formErrors.eventDate}</div>
                      )}
                    </div>

                    <label className="col-sm-3 col-form-label required">Category</label>
                    <div className="col-sm-3">
                      <select
                        className={`form-control${isFormSubmitted && formErrors.eventCategory ? ' is-invalid' : ''}`}
                        value={formValues.eventCategory}
                        onChange={(e) =>
                          setFormValues((v) => ({
                            ...v,
                            eventCategory: e.target.value as 'Upcoming' | 'Happenings',
                          }))
                        }
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {isFormSubmitted && formErrors.eventCategory && (
                        <div className="invalid-feedback">{formErrors.eventCategory}</div>
                      )}
                    </div>
                  </div>

                  {/* ── Details ── */}
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label required">Details</label>
                    <div className="col-sm-9">
                      <textarea
                        className={`form-control${isFormSubmitted && formErrors.eventDetails ? ' is-invalid' : ''}`}
                        rows={3}
                        maxLength={1500}
                        value={formValues.eventDetails}
                        onChange={(e) =>
                          setFormValues((v) => ({ ...v, eventDetails: e.target.value }))
                        }
                      />
                      {isFormSubmitted && formErrors.eventDetails && (
                        <div className="invalid-feedback">{formErrors.eventDetails}</div>
                      )}
                    </div>
                  </div>

                  {/* ── Image File ── */}
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label required">Image File</label>
                    <div className="col-sm-9">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="form-control-file"
                        onChange={onFileSelected}
                      />
                      <small className="form-text text-muted">
                        Max file size: {MAX_FILE_SIZE_MB}MB.
                      </small>

                      {/* Mirrors: *ngIf="isFormSubmitted && !EventFileData && !isEditMode" */}
                      {isFormSubmitted && !eventFileData && !isEditMode && (
                        <div className="text-danger">
                          Image file is required for a new event.
                        </div>
                      )}

                      {/* Mirrors: *ngIf="isEditMode && currentImageUrl" */}
                      {isEditMode && currentImageUrl && (
                        <div className="mt-2">
                          <p className="mb-1">Current Image:</p>
                          <img
                            src={SERVER_URL + currentImageUrl}
                            alt="Current event"
                            style={{ maxHeight: 80, maxWidth: 150, border: '1px solid #ccc' }}
                          />
                          <small className="d-block">
                            Image will be replaced only if a new file is uploaded.
                          </small>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Form Actions ── */}
                  <div className="form-group row">
                    <div className="col-sm-12 text-center">
                      <button
                        type="submit"
                        className="btn btn-primary m-2"
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <span
                            className="spinner-border spinner-border-sm mr-2"
                            role="status"
                            aria-hidden="true"
                          />
                        )}
                        {isEditMode ? 'Update Event' : 'Create New Event'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary m-2"
                        onClick={resetForm}
                        disabled={isLoading}
                      >
                        Clear Form
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <hr />

        {/* ═══════════════════════════════════════════════════════
            ALL EVENTS TABLE
            Mirrors Angular's table section with search, pagination
            ═══════════════════════════════════════════════════════ */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow mb-4">

              <div className="row mb-5 mt-4">
                <h2 className="text-center">All Events</h2>
              </div>

              {/* ── Table Controls Header ── */}
              <div className="card-header py-3 d-flex justify-content-center align-items-center flex-wrap gap-2">
                <div className="col-2">
                  <h2
                    className="m-0 font-weight-bold text-start text-primary"
                    style={{ fontSize: '1.1rem' }}
                  >
                    All Event List
                  </h2>
                </div>

                {/* Search — mirrors [(ngModel)]="searchTerm" */}
                <div className="col-3">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control form-control-sm mr-2"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </div>

                <span className="ms-4 col-2 text-end">Select Items per page</span>

                {/* Page size — mirrors [(ngModel)]="pageSize" */}
                <div className="ms-1 col-2">
                  <select
                    className="form-control form-control-sm"
                    style={{ width: 'auto', backgroundColor: 'bisque', color: 'black' }}
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  >
                    <option value={5}>Select</option>
                    <option value={10}>10 / page</option>
                    <option value={25}>25 / page</option>
                    <option value={50}>50 / page</option>
                  </select>
                </div>

                {totalPages > 1 && (
                  <div className="col-3">
                    <PaginationNav
                      currentPage={currentPage}
                      totalPages={totalPages}
                      goToPage={goToPage}
                    />
                  </div>
                )}
              </div>

              {/* ── Table Body ── */}
              <div className="card-body p-0">
                <div className="table-responsive">
                  {paginatedData.length === 0 ? (
                    <p className="p-4 text-center text-muted">
                      No events found matching your criteria.
                    </p>
                  ) : (
                    <table className="table table-striped table-hover mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Date</th>
                          <th>Category</th>
                          <th>Details</th>
                          <th>Image</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((event: EventModel) => (
                          <tr key={event.eventId}>
                            <td>{event.eventId}</td>
                            <td>{event.eventName}</td>
                            <td>
                              {event.eventDate
                                ? new Date(event.eventDate).toLocaleDateString()
                                : '—'}
                            </td>
                            <td>{event.eventCategory}</td>
                            {/* Mirrors: {{ event.eventDetails | slice:0:70 }}... */}
                            <td>{event.eventDetails?.slice(0, 70)}...</td>
                            <td>
                              {event.imageUrl ? (
                                <button
                                  className="btn btn-sm btn-info"
                                  onClick={() => onViewFile(event.imageUrl)}
                                >
                                  <span className="bi bi-eye" />
                                </button>
                              ) : (
                                <span className="text-muted">N/A</span>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning mr-2"
                                onClick={() => onEdit(event)}
                              >
                                <span className="bi bi-pencil" />
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => onDelete(event)}
                              >
                                <span className="bi bi-trash" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* ── Table Footer Pagination ── */}
              {totalPages > 1 && (
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <PaginationNav
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
