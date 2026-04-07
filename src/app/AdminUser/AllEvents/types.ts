// =============================================================
//  events-crud/types.ts
//  Shared types, interfaces, and constants
// =============================================================

export interface EventModel {
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

export interface FormValues {
  eventId: number | null;
  eventName: string;
  eventDate: string;
  eventCategory: 'Upcoming' | 'Happenings';
  eventDetails: string;
  imageUrl: string;
}

export interface FormErrors {
  eventName?: string;
  eventDate?: string;
  eventCategory?: string;
  eventDetails?: string;
  imageFile?: string;
}

export interface UseEventsReturn {
  // Data
  events: EventModel[];
  paginatedData: EventModel[];
  isLoading: boolean;
  // Form state
  formValues: FormValues;
  formErrors: FormErrors;
  isFormSubmitted: boolean;
  isEditMode: boolean;
  currentEventId: number | null;
  currentImageUrl: string | null;
  // File state
  eventFileData: string | null;
  eventFileName: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  // Pagination / search
  searchTerm: string;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  // Handlers
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onEdit: (event: EventModel) => void;
  onDelete: (event: EventModel) => Promise<void>;
  onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onViewFile: (filePath: string | null) => void;
  onSearchChange: (term: string) => void;
  onPageSizeChange: (size: number) => void;
  goToPage: (page: number) => void;
  resetForm: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const MIN_LOADING_TIME = 1500;
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);
export const SERVER_URL = 'https://files.lpu.in/umsweb/CIFDocuments/';
export const CATEGORIES: Array<'Upcoming' | 'Happenings'> = ['Upcoming', 'Happenings'];

export const INITIAL_FORM: FormValues = {
  eventId: null,
  eventName: '',
  eventDate: '',
  eventCategory: 'Upcoming',
  eventDetails: '',
  imageUrl: '',
};