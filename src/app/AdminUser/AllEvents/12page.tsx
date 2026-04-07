'use client';

// ============================================================
//  Next.js Events CRUD Page
//  Refactored from Angular 14 EventsCrudComponent
//  API calls use: import myAppWebService from '@/services/myAppWebService';
// ============================================================

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import myAppWebService from '@/services/myAppWebService';

// ─── Types ───────────────────────────────────────────────────────────────────

interface EventModel {
  eventId: number | null;
  eventName: string;
  eventDate: string;
  eventCategory: 'Upcoming' | 'Happenings';
  eventDetails: string;
  imageUrl: string;
  action?: 'Insert' | 'Update' | 'Delete' | 'View';
  eventFileData?: string;
  disapprovalReason?: string;
  loginName?: string;
}

interface FormValues {
  eventId: number | null;
  eventName: string;
  eventDate: string;
  eventCategory: 'Upcoming' | 'Happenings';
  eventDetails: string;
  imageUrl: string;
}

interface FormErrors {
  eventName?: string;
  eventDate?: string;
  eventCategory?: string;
  eventDetails?: string;
  imageFile?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MIN_LOADING_TIME = 1500;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);
const SERVER_URL = 'https://files.lpu.in/umsweb/CIFDocuments/';
const CATEGORIES: Array<'Upcoming' | 'Happenings'> = ['Upcoming', 'Happenings'];

const INITIAL_FORM: FormValues = {
  eventId: null,
  eventName: '',
  eventDate: '',
  eventCategory: 'Upcoming',
  eventDetails: '',
  imageUrl: '',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function formatDateForInput(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// ─── Carousel Component ───────────────────────────────────────────────────────

function EventCarousel({ events }: { events: EventModel[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateItemsPerSlide = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) setItemsPerSlide(1);
    else if (width < 992) setItemsPerSlide(2);
    else setItemsPerSlide(3);
  }, []);

  useEffect(() => {
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, [updateItemsPerSlide]);

  const chunks = chunkArray(events, itemsPerSlide);
  const totalSlides = chunks.length;

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 15000);
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides > 1) startAutoPlay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [totalSlides, startAutoPlay]);

  const goTo = (idx: number) => {
    setCurrentSlide(((idx % totalSlides) + totalSlides) % totalSlides);
    startAutoPlay();
  };

  if (events.length === 0) return null;

  const currentChunk = chunks[currentSlide] || [];

  return (
    <section style={{ padding: '60px 0', backgroundColor: '#f8c51c' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: 0 }}>
            Events &amp; Happenings
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => goTo(currentSlide - 1)}
              style={carouselBtnStyle}
              aria-label="Previous"
            >
              <img src="https://www.lpu.in/lpu-assets/images/icons/vector-left.svg" alt="Prev" />
            </button>
            <button
              onClick={() => goTo(currentSlide + 1)}
              style={carouselBtnStyle}
              aria-label="Next"
            >
              <img src="https://www.lpu.in/lpu-assets/images/icons/vector-right.svg" alt="Next" />
            </button>
          </div>
        </div>

        {/* Slide */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {currentChunk.map((event) => (
            <div
              key={event.eventId}
              style={{ flex: `0 0 calc(${100 / itemsPerSlide}% - 16px)`, textAlign: 'center', minWidth: 200 }}
            >
              <img
                src={SERVER_URL + event.imageUrl}
                alt={event.eventName}
                className="img-fluid"
                style={{ width: '100%', borderRadius: 8 }}
              />
              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <strong style={{ display: 'block' }}>{event.eventName}</strong>
                {event.eventDetails}
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        {totalSlides > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            {chunks.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: 10, height: 10, borderRadius: '50%', border: 'none',
                  backgroundColor: i === currentSlide ? '#333' : '#aaa',
                  cursor: 'pointer', padding: 0,
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const carouselBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 4,
};

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function EventsCrudPage() {
  // ── Auth / Session ────────────────────────────────────────────────────────
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    try {
      const raw = document.cookie
        .split('; ')
        .find((c) => c.startsWith('authData'))
        ?.split('=')?.[1];
      if (!raw) {
        Swal.fire({ title: 'Login Failed', icon: 'warning' });
        window.location.href = '/Home';
        return;
      }
      const auth = JSON.parse(decodeURIComponent(raw));
      setUserEmail(auth.EmailId || '');
    } catch {
      Swal.fire({ title: 'Login Failed', icon: 'warning' });
      window.location.href = '/Home';
    }
  }, []);

  // ── Events Data ───────────────────────────────────────────────────────────
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── Form State ────────────────────────────────────────────────────────────
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // ── File State ────────────────────────────────────────────────────────────
  const [eventFileData, setEventFileData] = useState<string | null>(null);
  const [eventFileName, setEventFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Search & Pagination ───────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedData, setPaginatedData] = useState<EventModel[]>([]);

  // ── Filter & Paginate ─────────────────────────────────────────────────────

  const filterAndPaginate = useCallback(
    (allEvents: EventModel[], term: string, size: number, page: number) => {
      const lower = term.toLowerCase().trim();
      let filtered = allEvents;
      if (lower) {
        filtered = allEvents.filter(
          (e) =>
            e.eventName.toLowerCase().includes(lower) ||
            e.eventDetails.toLowerCase().includes(lower) ||
            e.eventCategory.toLowerCase().includes(lower)
        );
      }
      const total = filtered.length;
      const pages = Math.ceil(total / size) || 1;
      const safePage = Math.min(Math.max(page, 1), pages);
      const start = (safePage - 1) * size;
      setPaginatedData(filtered.slice(start, start + size));
      setTotalPages(pages);
      setCurrentPage(safePage);
    },
    []
  );

  // ── Load Events (View) ────────────────────────────────────────────────────

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const formData = new FormData();
      formData.append('Action', 'View');

      // API call — mirrors: this.eventsService.EventsCrudOperation(formData, 'View')
      const response: any = await myAppWebService.EventsCrudOperation(formData, 'View');
      const loaded: EventModel[] = response?.item1?.length > 0 ? response.item1 : [];
      setEvents(loaded);
      filterAndPaginate(loaded, searchTerm, pageSize, 1);
    } catch (error) {
      console.error('Error fetching events:', error);
      Swal.fire({ title: 'Data Error', text: 'Failed to load event list.', icon: 'error' });
      setEvents([]);
      filterAndPaginate([], searchTerm, pageSize, 1);
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0);
      setTimeout(() => setIsLoading(false), remaining);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterAndPaginate, pageSize]);

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-paginate when search/pageSize/page changes without re-fetching
  useEffect(() => {
    filterAndPaginate(events, searchTerm, pageSize, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, pageSize]);

  // ── Reset Form ────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormValues(INITIAL_FORM);
    setFormErrors({});
    setIsFormSubmitted(false);
    setIsEditMode(false);
    setCurrentEventId(null);
    setCurrentImageUrl(null);
    setEventFileData(null);
    setEventFileName(null);
    setIsLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = (values: FormValues, fileData: string | null, editMode: boolean): FormErrors => {
    const errors: FormErrors = {};
    if (!values.eventName.trim()) errors.eventName = 'Event Name is required.';
    if (!values.eventDate) errors.eventDate = 'Date is required.';
    if (!values.eventCategory) errors.eventCategory = 'Category is required.';
    if (!values.eventDetails.trim()) errors.eventDetails = 'Details are required.';
    if (!fileData && !editMode) errors.imageFile = 'Image file is required for a new event.';
    return errors;
  };

  // ── Prepare FormData (mirrors prepareFormData in Angular) ─────────────────

  const prepareFormData = (action: 'Insert' | 'Update'): FormData => {
    const fd = new FormData();
    fd.append('Action', action);
    if (currentEventId) fd.append('EventId', currentEventId.toString());
    fd.append('EventName', formValues.eventName);
    fd.append('EventDate', formValues.eventDate);
    fd.append('EventCategory', formValues.eventCategory);
    fd.append('EventDetails', formValues.eventDetails);

    if (eventFileData && eventFileName) {
      fd.append('ImageUrl', eventFileName);
      fd.append('EventFileData', eventFileData);
    } else if (action === 'Update' && eventFileName && eventFileData) {
      fd.append('ImageUrl', eventFileName);
      fd.append('EventFileData', eventFileData);
    } else {
      fd.append('ImageUrl', '');
      fd.append('EventFileData', '');
    }

    fd.append('LoginName', userEmail);
    fd.append('DisapprovalReason', '');
    return fd;
  };

  // ── Add New Event (Insert) ────────────────────────────────────────────────

  const addNewEvent = async () => {
    const formData = prepareFormData('Insert');
    try {
      // API call — mirrors: this.eventsService.EventsCrudOperation(formData, 'Insert')
      const data: any = await myAppWebService.EventsCrudOperation(formData, 'Insert');
      const errorCode = data?.item1?.[0]?.['returnData'];
      if (errorCode > 0) {
        Swal.fire({ title: 'Success', text: 'Event created successfully.', icon: 'success' });
      }
    } catch (error) {
      console.error('API Error:', error);
      Swal.fire({
        title: 'Error Occurred',
        text: 'Unable to complete the request (HTTP Error). Please check the network tab.',
        icon: 'error',
      });
    } finally {
      resetForm();
    }
  };

  // ── Update Event (Update) ─────────────────────────────────────────────────

  const updateEvent = async () => {
    const formData = prepareFormData('Update');
    try {
      // API call — mirrors: this.eventsService.EventsCrudOperation(formData, 'Update')
      const data: any = await myAppWebService.EventsCrudOperation(formData, 'Update');
      const errorCode = data?.item1?.[0]?.['returnData'];
      if (errorCode > 0) {
        Swal.fire({
          title: 'Success',
          text: `Event ID ${currentEventId} updated successfully.`,
          icon: 'success',
        });
      }
    } catch (error) {
      console.error('Update Error:', error);
      Swal.fire({ title: 'Error', text: 'Failed to update event (HTTP Error).', icon: 'error' });
    } finally {
      resetForm();
    }
  };

  // ── Submit Handler ────────────────────────────────────────────────────────

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    const errors = validate(formValues, eventFileData, isEditMode);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill out all required fields correctly.',
        icon: 'warning',
      });
      return;
    }

    if (!eventFileData && !isEditMode) {
      Swal.fire({ title: 'Validation Error', text: 'Please upload the event image file.', icon: 'warning' });
      return;
    }

    setIsLoading(true);
    if (isEditMode) {
      await updateEvent();
    } else {
      await addNewEvent();
    }
    await loadEvents();
  };

  // ── Edit Handler ──────────────────────────────────────────────────────────

  const onEdit = (event: EventModel) => {
    setIsEditMode(true);
    setCurrentEventId(event.eventId);
    setCurrentImageUrl(event.imageUrl);
    setEventFileData(null);
    setEventFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setFormValues({
      eventId: event.eventId,
      eventName: event.eventName,
      eventDate: formatDateForInput(event.eventDate),
      eventCategory: event.eventCategory,
      eventDetails: event.eventDetails,
      imageUrl: event.imageUrl || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Delete Handler ────────────────────────────────────────────────────────

  const onDelete = async (event: EventModel) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete event: ${event.eventName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const deleteFormData = new FormData();
        deleteFormData.append('Action', 'Delete');
        deleteFormData.append('EventId', (event.eventId ?? '').toString());
        deleteFormData.append('EventName', event.eventName.toString());

        // API call — mirrors: this.eventsService.EventsCrudOperation(deleteFormData, 'Delete')
        await myAppWebService.EventsCrudOperation(deleteFormData, 'Delete');
        Swal.fire('Deleted!', 'The event has been removed.', 'success');
      } catch (err) {
        console.error('Deletion failed:', err);
        Swal.fire('Failed!', 'Deletion failed due to an error.', 'error');
      } finally {
        await loadEvents();
      }
    }
  };

  // ── File Selection Handler ────────────────────────────────────────────────

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEventFileData(null);
    setEventFileName(null);

    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      await Swal.fire({
        title: 'Invalid File Size',
        text: `File size exceeds ${MAX_FILE_SIZE_MB}MB.`,
        icon: 'warning',
      });
      e.target.value = '';
      return;
    }

    try {
      const base64 = await readFileAsBase64(file);
      setEventFileData(base64);
      setEventFileName(file.name);
    } catch {
      await Swal.fire({ title: 'File Read Error', text: 'Could not process the selected file.', icon: 'error' });
      e.target.value = '';
    }
  };

  // ── View File ─────────────────────────────────────────────────────────────

  const onViewFile = (filePath: string | null) => {
    if (filePath) {
      window.open(`${SERVER_URL}${filePath}`, '_blank');
    } else {
      Swal.fire({ title: 'No File', text: 'No file path available for this event.', icon: 'info' });
    }
  };

  // ── Pagination ────────────────────────────────────────────────────────────

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      filterAndPaginate(events, searchTerm, pageSize, page);
    }
  };

  const onSearchChange = (term: string) => {
    setSearchTerm(term);
    filterAndPaginate(events, term, pageSize, 1);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    filterAndPaginate(events, searchTerm, size, 1);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Full-screen loader */}
      {isLoading && (
        <div className="fullscreen-loader">
          <div className="custom-spinner-overlay">
            <div className="custom-spinner-content text-center">
              <img src="/assets/images/spinner.gif" alt="Loading..." />
            </div>
          </div>
        </div>
      )}

      {/* ── Carousel ── */}
      <EventCarousel events={events} />

      <div className="container-fluid">

        {/* ── Add / Edit Form ── */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h2 className="m-0 font-weight-bold text-primary">
                  {isEditMode ? `Edit Event (ID: ${currentEventId})` : 'Add New Event'}
                </h2>
              </div>
              <div className="card-body">
                <form onSubmit={onSubmit} noValidate>

                  {/* Event Name */}
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label required">Event Name</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className={`form-control${isFormSubmitted && formErrors.eventName ? ' is-invalid' : ''}`}
                        value={formValues.eventName}
                        onChange={(e) => setFormValues((v) => ({ ...v, eventName: e.target.value }))}
                        maxLength={1500}
                      />
                      {isFormSubmitted && formErrors.eventName && (
                        <div className="invalid-feedback">{formErrors.eventName}</div>
                      )}
                    </div>
                  </div>

                  {/* Date + Category */}
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label required">Date</label>
                    <div className="col-sm-3">
                      <input
                        type="date"
                        className={`form-control${isFormSubmitted && formErrors.eventDate ? ' is-invalid' : ''}`}
                        value={formValues.eventDate}
                        onChange={(e) => setFormValues((v) => ({ ...v, eventDate: e.target.value }))}
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

                  {/* Details */}
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label required">Details</label>
                    <div className="col-sm-9">
                      <textarea
                        className={`form-control${isFormSubmitted && formErrors.eventDetails ? ' is-invalid' : ''}`}
                        rows={3}
                        maxLength={1500}
                        value={formValues.eventDetails}
                        onChange={(e) => setFormValues((v) => ({ ...v, eventDetails: e.target.value }))}
                      />
                      {isFormSubmitted && formErrors.eventDetails && (
                        <div className="invalid-feedback">{formErrors.eventDetails}</div>
                      )}
                    </div>
                  </div>

                  {/* Image File */}
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
                      <small className="form-text text-muted">Max file size: {MAX_FILE_SIZE_MB}MB.</small>

                      {isFormSubmitted && !eventFileData && !isEditMode && (
                        <div className="text-danger">Image file is required for a new event.</div>
                      )}

                      {isEditMode && currentImageUrl && (
                        <div className="mt-2">
                          <p className="mb-1">Current Image:</p>
                          <img
                            src={SERVER_URL + currentImageUrl}
                            alt="Current event"
                            style={{ maxHeight: 80, maxWidth: 150, border: '1px solid #ccc' }}
                          />
                          <small className="d-block">Image will be replaced only if a new file is uploaded.</small>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="form-group row">
                    <div className="col-sm-12 text-center">
                      <button type="submit" className="btn btn-primary m-2" disabled={isLoading}>
                        {isLoading && (
                          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
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

        {/* ── Event List Table ── */}
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow mb-4">
              <div className="row mb-5 mt-4">
                <h2 className="text-center">All Events</h2>
              </div>

              {/* Table Controls */}
              <div className="card-header py-3 d-flex justify-content-center align-items-center flex-wrap gap-2">
                <div className="col-2">
                  <h2 className="m-0 font-weight-bold text-start text-primary" style={{ fontSize: '1.1rem' }}>
                    All Event List
                  </h2>
                </div>

                <div className="col-3">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control form-control-sm"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </div>

                <span className="ms-4 col-2 text-end">Select Items per page</span>

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
                    <PaginationNav currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
                  </div>
                )}
              </div>

              {/* Table Body */}
              <div className="card-body p-0">
                <div className="table-responsive">
                  {paginatedData.length === 0 ? (
                    <p className="p-4 text-center text-muted">No events found matching your criteria.</p>
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
                        {paginatedData.map((event) => (
                          <tr key={event.eventId}>
                            <td>{event.eventId}</td>
                            <td>{event.eventName}</td>
                            <td>{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : '—'}</td>
                            <td>{event.eventCategory}</td>
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

              {/* Table Footer Pagination */}
              {totalPages > 1 && (
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <PaginationNav currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Pagination Nav Component ─────────────────────────────────────────────────

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
    <nav>
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