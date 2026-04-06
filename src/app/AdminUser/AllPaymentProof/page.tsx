'use client';

import React from 'react';
import s from './UploadProofStatusPage.module.css';
import {
  useUploadProofStatus,
  getStatusLabel,
  getStatusVariant,
  formatCurrency,
  ITEMS_PER_PAGE_OPTIONS,
  type UploadProofRecord,
  type StatusVariant,
} from './UploadProofStatusPage.hook';

// ─── Table column definitions ────────────────────────────────────────────────

const TABLE_COLUMNS = [
  'Booking Id',
  'User Id',
  'No. of Samples',
  'Total Charges',
  'Uploaded Proof',
  'Requested On',
  'Proof Remarks',
  'Status',
] as const;

// ─── Icon components ──────────────────────────────────────────────────────────

function ExcelIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      style={{ marginRight: 8, flexShrink: 0 }}
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="10" y1="9" x2="14" y2="9" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="#999" strokeWidth="2"
      style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function EmptyFileIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ef7d00" strokeWidth="1.5">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function LoadingOverlay() {
  return (
    <div className={s.loadingOverlay}>
      <div className={s.spinnerBox}>
        <div className={s.spinner} />
        <p className={s.spinnerText}>Loading…</p>
      </div>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className={s.emptyState}>
      <EmptyFileIcon />
      <p className={s.emptyText}>
        {filtered
          ? 'No records match your search. Try different keywords.'
          : 'No payment proof details found.'}
      </p>
    </div>
  );
}

// ─── Pagination bar ───────────────────────────────────────────────────────────

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

function PaginationBar({ currentPage, totalPages, onPrev, onNext }: PaginationBarProps) {
  const isFirst = currentPage === 1;
  const isLast  = currentPage === totalPages;

  return (
    <div className={s.paginationBar}>
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={`${s.pageBtn} ${isFirst ? s.pageBtnDisabled : ''}`}
        aria-label="Previous page"
      >
        Prev
      </button>
      <span className={s.pageLabel}>{currentPage} / {totalPages}</span>
      <button
        onClick={onNext}
        disabled={isLast}
        className={`${s.pageBtn} ${isLast ? s.pageBtnDisabled : ''}`}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CLASS: Record<StatusVariant, string> = {
  success: s.badgeSuccess,
  danger:  s.badgeDanger,
  warning: s.badgeWarning,
};

function StatusBadge({ isApproved }: { isApproved: string | undefined }) {
  return (
    <span className={STATUS_CLASS[getStatusVariant(isApproved)]}>
      {getStatusLabel(isApproved)}
    </span>
  );
}

// ─── Download cell ────────────────────────────────────────────────────────────

interface DownloadCellProps {
  fileName: string | null;
  isDownloading: boolean;
  onDownload: (fileName: string) => void;
}

function DownloadCell({ fileName, isDownloading, onDownload }: DownloadCellProps) {
  if (!fileName) return <span className={s.naBadge}>N/A</span>;

  return (
    <button
      onClick={() => onDownload(fileName)}
      disabled={isDownloading}
      className={s.downloadBtn}
      title="Download proof"
      aria-label="Download uploaded proof"
    >
      {isDownloading ? <span className={s.miniSpinner} /> : <DownloadIcon />}
    </button>
  );
}

// ─── Table row ────────────────────────────────────────────────────────────────

interface TableRowProps {
  row: UploadProofRecord;
  index: number;
  downloadingId: string | null;
  onDownload: (fileName: string) => void;
}

function TableRow({ row, index, downloadingId, onDownload }: TableRowProps) {
  return (
    <tr className={index % 2 === 0 ? s.trEven : s.trOdd}>
      <td className={s.tdBold}>{row.bookingId}</td>
      <td className={s.tdBold}>{row.userId}</td>
      <td className={s.td}>{row.noOfSamples}</td>
      <td className={s.td}>{formatCurrency(row.totalCharges)}</td>
      <td className={s.td}>
        <DownloadCell
          fileName={row.receiptProofFile}
          isDownloading={downloadingId === row.receiptProofFile}
          onDownload={onDownload}
        />
      </td>
      <td className={s.tdDate}>{row.requestDate}</td>
      <td className={s.td}>
        {row.proofRemarks && row.proofRemarks !== 'null'
          ? row.proofRemarks
          : <span className={s.tdMuted}>—</span>}
      </td>
      <td className={s.td}>
        <StatusBadge isApproved={row.isProofApproved} />
      </td>
    </tr>
  );
}

// ─── Data table ───────────────────────────────────────────────────────────────

interface DataTableProps {
  rows: UploadProofRecord[];
  downloadingId: string | null;
  onDownload: (fileName: string) => void;
}

function DataTable({ rows, downloadingId, onDownload }: DataTableProps) {
  return (
    <div className={s.tableWrapper}>
      <table className={s.table}>
        <thead>
          <tr className={s.theadRow}>
            {TABLE_COLUMNS.map((col) => (
              <th key={col} className={s.th}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <TableRow
              key={`${row.bookingId}-${i}`}
              row={row}
              index={i}
              downloadingId={downloadingId}
              onDownload={onDownload}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

interface ToolbarProps {
  searchQuery: string;
  hasFilteredData: boolean;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: () => void;
  onExport: () => void;
  totalRecords: number;
  itemsPerPage: number;
  isAllSelected: boolean;
  currentPage: number;
  totalPages: number;
  onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPrev: () => void;
  onNext: () => void;
}

function Toolbar({
  searchQuery, hasFilteredData, onSearch, onSearchSubmit, onExport,
  totalRecords, itemsPerPage, isAllSelected, currentPage, totalPages,
  onItemsPerPageChange, onPrev, onNext,
}: ToolbarProps) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className={s.toolbar}>
      <button
        onClick={onExport}
        disabled={!hasFilteredData}
        className={`${s.btnDark} ${!hasFilteredData ? s.btnDisabled : ''}`}
      >
        <ExcelIcon />
        Export to Excel
      </button>

      <div className={s.searchWrapper}>
        <SearchIcon />
        <input
          type="text"
          value={searchQuery}
          onChange={onSearch}
          onKeyDown={(e) => { if (e.key === 'Enter') onSearchSubmit(); }}
          placeholder="Search records…"
          disabled={!hasFilteredData}
          className={s.searchInput}
          aria-label="Search records"
        />
        <button
          onClick={onSearchSubmit}
          disabled={!hasFilteredData}
          className={`${s.btnSearch} ${!hasFilteredData ? s.btnDisabled : ''}`}
          aria-label="Search"
        >
          Search
        </button>
      </div>
      
      <span className={s.recordsBadge}>
        Records: <strong>{totalRecords}</strong>
      </span>

      <div className={s.perPageRow + ' text-end '}>
        <label htmlFor="perPage" className={s.perPageLabel}>Items per page:</label>
        <select
          id="perPage"
          value={isAllSelected ? 'all' : itemsPerPage}
          onChange={onItemsPerPageChange}
          className={s.perPageSelect}
        >
          {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={s.paginationBar}>
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`${s.pageBtn} ${isFirst ? s.pageBtnDisabled : ''}`}
          aria-label="Previous page"
        >
          Prev
        </button>
        <span className={s.pageLabel}>{currentPage} / {totalPages}</span>
        <button
          onClick={onNext}
          disabled={isLast}
          className={`${s.pageBtn} ${isLast ? s.pageBtnDisabled : ''}`}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}


// ─── Page component ───────────────────────────────────────────────────────────

export default function UploadProofStatusPage() {
  const {
    loading,
    searchQuery,
    currentPage,
    itemsPerPage,
    isAllSelected,
    downloadingId,
    downloadError,
    hasData,
    hasFilteredData,
    totalPages,
    totalRecords,
    handleSearch,
    handleSearchSubmit,
    handleItemsPerPageChange,
    prevPage,
    nextPage,
    handleDownload,
    exportToExcel,
    currentPageData,
  } = useUploadProofStatus();

  return (
    <div className={s.page}>
      {loading && <LoadingOverlay />}

      {/* Page header */}
      <div className={s.header}>
        <h1 className={s.pageTitle + ' text-center '}>Payment Proof Uploaded Details</h1>
        {/* <p className={s.pageSubtitle}>Review and manage uploaded payment receipts</p> */}
      </div>

      {/* Download error banner */}
      {downloadError && (
        <div role="alert" className={s.errorToast}>
          {downloadError}
        </div>
      )}

      {/* No data at all */}
      {!hasData && !loading ? (
        <div className={s.card}>
          <EmptyState filtered={false} />
        </div>
      ) : (
        <div className={s.card}>
          <Toolbar
            searchQuery={searchQuery}
            hasFilteredData={hasFilteredData}
            onSearch={handleSearch}
            onSearchSubmit={handleSearchSubmit}
            onExport={exportToExcel}
            totalRecords={totalRecords}
            itemsPerPage={itemsPerPage}
            isAllSelected={isAllSelected}
            currentPage={currentPage}
            totalPages={totalPages}
            onItemsPerPageChange={handleItemsPerPageChange}
            onPrev={prevPage}
            onNext={nextPage}
          />

          {hasFilteredData ? (
            <DataTable
              rows={currentPageData()}
              downloadingId={downloadingId}
              onDownload={handleDownload}
            />
          ) : (
            <EmptyState filtered={searchQuery.length > 0} />
          )}

          {hasFilteredData && (
            <div className={s.bottomPagination}>
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={prevPage}
                onNext={nextPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}