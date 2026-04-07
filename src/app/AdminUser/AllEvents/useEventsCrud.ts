// =============================================================
//  events-crud/useEventsCrud.ts
//  Custom hook — all business logic, state & API calls.
//  Mirrors the Angular EventsCrudComponent .ts file exactly.
// =============================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import myAppWebService from '@/services/myAppWebService';
import {
  EventModel,
  FormErrors,
  FormValues,
  INITIAL_FORM,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MIN_LOADING_TIME,
  SERVER_URL,
  UseEventsReturn,
} from './types';
import router from 'next/router';

// ─── Pure Utility Helpers ─────────────────────────────────────────────────────

/** Reads a File and resolves with its raw Base64 content (no data-URL prefix). */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/** Strips the time portion from ISO date strings so <input type="date"> accepts the value. */
export function formatDateForInput(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
}

/** Splits an array into sub-arrays of `size` — used for carousel chunking. */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

// ─── Validation (mirrors Angular Validators.required + maxLength) ─────────────

function validate(
  values: FormValues,
  fileData: string | null,
  editMode: boolean
): FormErrors {
  const errors: FormErrors = {};
  if (!values.eventName.trim()) errors.eventName = 'Event Name is required.';
  if (!values.eventDate) errors.eventDate = 'Date is required.';
  if (!values.eventCategory) errors.eventCategory = 'Category is required.';
  if (!values.eventDetails.trim()) errors.eventDetails = 'Details are required.';
  if (!fileData && !editMode) errors.imageFile = 'Image file is required for a new event.';
  return errors;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEventsCrud(): UseEventsReturn {
 const [userData, setUserData] = useState({ userId: '', userEmail: '', departmentName: '', candidateName: '' });
  // ── Auth ────────────────────────────────────────────────────────────────────
  const [userEmail, setUserEmail] = useState('');
  const handleLogout = () => {
    Cookies.remove('authData');
    router.push('/');
  };

  
  useEffect(() => {
    // Initial Check & Data Load
    const checkAuth = () => {
      const authData = Cookies.get('authData');
      
      if (!authData) {
        // If cookie is gone (expired or manually deleted), force logout
        handleLogout();
        return;
      }

      try {
        const parsed = JSON.parse(authData);
        setUserData({
          userEmail: parsed.EmailId,
          userId: parsed.UserId,
          departmentName: parsed.Department,
          candidateName: parsed.CandidateName
        });
      } catch (e) {
        console.error("Auth Parsing Error", e);
        handleLogout();
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      const authData = Cookies.get('authData');
      if (!authData) {
        Swal.fire({
          title: 'Session Expired',
          text: 'Your 1-hour session has timed out. Please login again.',
          icon: 'info',
          confirmButtonColor: '#ef7d00'
        }).then(() => {
          handleLogout();
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   try {
  //     const raw = document.cookie
  //       .split('; ')
  //       .find((c) => c.startsWith('authData'))
  //       ?.split('=')?.[1];

  //     if (!raw) {
  //       Swal.fire({ title: 'Login Failed', icon: 'warning' });
  //       window.location.href = '/Home';
  //       return;
  //     }
  //     const auth = JSON.parse(decodeURIComponent(raw));
  //     setUserEmail(auth.EmailId || '');
  //   } catch {
  //     Swal.fire({ title: 'Login Failed', icon: 'warning' });
  //     window.location.href = '/Home';
  //   }
  // }, []);

  // ── Events Data ─────────────────────────────────────────────────────────────
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── Form State ──────────────────────────────────────────────────────────────
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // ── File State ──────────────────────────────────────────────────────────────
  const [eventFileData, setEventFileData] = useState<string | null>(null);
  const [eventFileName, setEventFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Search & Pagination ─────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedData, setPaginatedData] = useState<EventModel[]>([]);

  // ── filterAndPaginate (mirrors Angular's private filterAndPaginate()) ────────
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

  // ── loadEvents — mirrors ngOnInit → loadEvents() ─────────────────────────────
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const formData = new FormData();
      formData.append('Action', 'View');

      // Mirrors: this.eventsService.EventsCrudOperation(formData, 'View')
      const response: any = await myAppWebService.getEvents();
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

  // Initial load on mount
  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-paginate when search/pageSize changes without re-fetching from API
  useEffect(() => {
    filterAndPaginate(events, searchTerm, pageSize, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, pageSize]);

  // ── resetForm — mirrors Angular resetForm() ──────────────────────────────────
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

  // ── prepareFormData — mirrors Angular's private prepareFormData() ─────────────
  const prepareFormData = (action: 'Insert' | 'Update'): FormData => {
    const fd = new FormData();
    fd.append('Action', action);
    if (currentEventId) fd.append('EventId', currentEventId.toString());
    fd.append('EventName', formValues.eventName);
    fd.append('EventDate', formValues.eventDate);
    fd.append('EventCategory', formValues.eventCategory);
    fd.append('EventDetails', formValues.eventDetails);

    if (eventFileData && eventFileName) {
      // New file selected — Base64 approach
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

  // ── addNewEvent — mirrors Angular addNewEvent() ──────────────────────────────
  const addNewEvent = async () => {
    const formData = prepareFormData('Insert');
    try {
      // Mirrors: this.eventsService.EventsCrudOperation(formData, 'Insert')
      const data: any = await myAppWebService.EventsCrudOperation(formData, 'Insert');
      // const data: any = await myAppWebService.createEvent(formData);
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

  // ── updateEvent — mirrors Angular updateEvent() ──────────────────────────────
  const updateEvent = async () => {
    const formData = prepareFormData('Update');
    try {
      // Mirrors: this.eventsService.EventsCrudOperation(formData, 'Update')
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

  // ── onSubmit — mirrors Angular onSubmit() ────────────────────────────────────
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

  // ── onEdit — mirrors Angular onEdit() ───────────────────────────────────────
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

  // ── onDelete — mirrors Angular onDelete() ───────────────────────────────────
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

        // Mirrors: this.eventsService.EventsCrudOperation(deleteFormData, 'Delete')
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

  // ── onFileSelected — mirrors Angular onFileSelectedEventFile() ───────────────
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

  // ── onViewFile — mirrors Angular onViewFile() ────────────────────────────────
  const onViewFile = (filePath: string | null) => {
    if (filePath) {
      window.open(`${SERVER_URL}${filePath}`, '_blank');
    } else {
      Swal.fire({ title: 'No File', text: 'No file path available for this event.', icon: 'info' });
    }
  };

  // ── Pagination handlers — mirrors Angular goToPage() / onSearchChange() ──────
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

  // ── Expose everything the UI needs ──────────────────────────────────────────
  return {
    events,
    paginatedData,
    isLoading,
    formValues,
    formErrors,
    isFormSubmitted,
    isEditMode,
    currentEventId,
    currentImageUrl,
    eventFileData,
    eventFileName,
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
  };
}
