import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
 
import myAppWebService from '@/services/myAppWebService';

export interface UploadProofRecord {
  bookingId: string;
  userId: string;
  instrumentName: string;
  noOfSamples: number;
  totalCharges: number;
  requestDate: string;
  proofRemarks: string;
  isProofApproved: string;
  proofApprovedOn: string | null;
  receiptProofFile: string | null;
  [key: string]: unknown;
}

interface ApiResponse {
  item1: UploadProofRecord[];
}

export interface ItemsPerPageOption {
  label: string;
  value: number | 'all';
}


const SERVER_URL = 'https://files.lpu.in/umsweb/CIFDocuments/';
const MIN_LOADING_MS = 500;

export const ITEMS_PER_PAGE_OPTIONS: ItemsPerPageOption[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
  { label: 'All', value: 'all' },
];


export function getStatusLabel(isApproved: string | undefined): string {
  if (isApproved === '1') return 'Accepted';
  if (isApproved === '0') return 'Rejected';
  return 'Pending';
}

export type StatusVariant = 'success' | 'danger' | 'warning';

export function getStatusVariant(isApproved: string | undefined): StatusVariant {
  if (isApproved === '1') return 'success';
  if (isApproved === '0') return 'danger';
  return 'warning';
}

export function formatCurrency(value: number | string): string {
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return String(value);
  return `₹${num.toLocaleString('en-IN')}`;
}


export function useUploadProofStatus() {
  const [allData, setAllData] = useState<UploadProofRecord[]>([]);
  const [filteredData, setFilteredData] = useState<UploadProofRecord[]>([]);

  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [isAllSelected, setIsAllSelected] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const start = Date.now();

      try {
        const response: ApiResponse = await myAppWebService.GetBookingPaymentProofDetails('0');

        if (response?.item1?.length > 0) {
          setAllData(response.item1);
          setFilteredData(response.item1);
        } else {
          setAllData([]);
          setFilteredData([]);
        }
      } catch (err) {
        console.error('Error fetching payment proof details:', err);
      } finally {
        const delay = Math.max(MIN_LOADING_MS - (Date.now() - start), 0);
        setTimeout(() => setLoading(false), delay);
      }
    };

    fetchData();
  }, []);


  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
    },
    []
  );

  const handleSearchSubmit = useCallback(() => {
    const trimmed = searchQuery.toLowerCase().trim();
    setFilteredData(
      trimmed
        ? allData.filter((item) =>
            Object.values(item).some((val) =>
              String(val).toLowerCase().includes(trimmed)
            )
          )
        : [...allData]
    );
    setCurrentPage(1);
  }, [allData, searchQuery]);


  const totalPages = isAllSelected
    ? 1
    : Math.max(Math.ceil(filteredData.length / itemsPerPage), 1);

  const currentPageData = (): UploadProofRecord[] => {
    if (isAllSelected) return filteredData;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      setIsAllSelected(true);
      setItemsPerPage(filteredData.length || 1);
    } else {
      setIsAllSelected(false);
      setItemsPerPage(parseInt(val, 10));
    }
    setCurrentPage(1);
  };

  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));


  const handleDownload = async (fileName: string) => {
    const url = SERVER_URL + fileName;
    setDownloadingId(fileName);
    setDownloadError(null);

    try {
      const blob: Blob = await myAppWebService.downloadFile(url);
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName.split('/').pop() || 'Document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Download failed:', err);
      setDownloadError('Download failed. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };


  const exportToExcel = () => {
    const exportedData = allData.map((item) => ({
      BookingId: item.bookingId,
      UserId: item.userId,
      InstrumentName: item.instrumentName,
      NumberOfSamples: item.noOfSamples,
      TotalCharges: item.totalCharges,
      RequestDate: item.requestDate,
      ProofRemarks: item.proofRemarks,
      Status: getStatusLabel(item.isProofApproved),
    }));

    const ws = XLSX.utils.json_to_sheet(exportedData);
    ws['!cols'] = [
      { wpx: 110 }, { wpx: 90 }, { wpx: 150 }, { wpx: 130 },
      { wpx: 110 }, { wpx: 130 }, { wpx: 160 }, { wpx: 90 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PaymentProof');

    const blobData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(
      new Blob([blobData], { type: 'application/octet-stream' })
    );
    link.download = 'Payment_Proof_Details.xlsx';
    link.click();
  };


  const hasData = allData.length > 0;
  const hasFilteredData = filteredData.length > 0;

  return {
    // State
    loading,
    searchQuery,
    currentPage,
    itemsPerPage,
    isAllSelected,
    downloadingId,
    downloadError,

    // Derived
    hasData,
    hasFilteredData,
    filteredData,
    totalPages,
    totalRecords: filteredData.length,

    // Actions
    handleSearch,
    handleSearchSubmit,
    handleItemsPerPageChange,
    prevPage,
    nextPage,
    handleDownload,
    exportToExcel,
    currentPageData,
  };
}