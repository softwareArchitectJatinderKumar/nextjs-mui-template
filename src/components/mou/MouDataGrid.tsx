'use client';
// components/mou/MouDataGrid.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Standalone data-grid component for the MOU list.
// Mirrors the "MY MOUs TABLE" section of new-Mou.html including:
//   • toolbar with search + record count
//   • loading / empty states
//   • striped, hoverable table with status badges
//   • pagination
// Receives all data as props — zero data-fetching logic inside.
// ─────────────────────────────────────────────────────────────────────────────

import styles from '../../styles/mou.module.css';
import { MouRecord } from '../../types/mou.types';

// ─── Badge helpers (mirrors statusLabel / statusClass in Angular component) ───

function getStatusLabel(row: MouRecord): string {
  if (row.mouStatus === '0' || row.mouStatus === 0) return 'Expired';
  if (row.mouStatus === '1' || row.mouStatus === 1) return 'Active';
  if (row.isApproved === 'True')                    return 'Approved';
  if (row.isApproved === 'False')                   return 'Disapproved';
  return 'Pending';
}

function getStatusClass(row: MouRecord): string {
  if (row.mouStatus === '0' || row.mouStatus === 0) return styles.badgeExpired;
  if (row.mouStatus === '1' || row.mouStatus === 1) return styles.badgeActive;
  if (row.isApproved === 'True')                    return styles.badgeApproved;
  if (row.isApproved === 'False')                   return styles.badgeDisapproved;
  return styles.badgePending;
}

function getStatusIcon(row: MouRecord): string {
  if (row.mouStatus === '0' || row.mouStatus === 0) return '⌛';
  if (row.mouStatus === '1' || row.mouStatus === 1) return '✔';
  if (row.isApproved === 'True')                    return '✔';
  if (row.isApproved === 'False')                   return '✘';
  return '⏳';
}

function getApprovalBadge(row: MouRecord): { cls: string; label: string; icon: string } {
  if (row.isApproved === 'True')  return { cls: styles.badgeApproved,     label: 'Approved',    icon: '✔' };
  if (row.isApproved === 'False') return { cls: styles.badgeDisapproved,  label: 'Disapproved', icon: '✘' };
  return                                 { cls: styles.badgePending,      label: 'Pending',     icon: '⏳' };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface MouDataGridProps {
  rows:        MouRecord[];
  isLoading:   boolean;
  searchQuery: string;
  onSearch:    (value: string) => void;
  currentPage: number;
  pageSize:    number;
  totalPages:  number;
  pageNumbers: number[];
  onPageChange:(page: number) => void;
  onViewDoc:   (url: string)  => void;
  onEdit:      (row: MouRecord) => void;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MouDataGrid({
  rows,
  isLoading,
  searchQuery,
  onSearch,
  currentPage,
  pageSize,
  totalPages,
  pageNumbers,
  onPageChange,
  onViewDoc,
  onEdit,
}: MouDataGridProps) {

  return (
    <div className={styles.tableSection}>

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className={styles.tableToolbar}>
        <h2 className={styles.sectionTitle}>My Submitted MOUs</h2>
        <div className={styles.toolbarRight}>
          <div className={styles.searchBox}>
            <span>🔍</span>
            <input
              type="text"
              className={`${styles.filterInput} ${styles.searchInput}`}
              placeholder="Search by title, user, org…"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
            />
          </div>
          <span className={styles.recordCount}>{rows.length} records</span>
        </div>
      </div>

      {/* ── Loading ───────────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <p>Loading your MOUs…</p>
        </div>
      )}

      {/* ── Empty ─────────────────────────────────────────────────────────────── */}
      {!isLoading && rows.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyTitle}>No MOUs found</p>
          <p className={styles.emptySub}>Click "New MOU" to submit your first memorandum.</p>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────────── */}
      {!isLoading && rows.length > 0 && (
        <div className={styles.tableResponsive}>
          <table className={styles.mouTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>MOU Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Approval Status</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Document</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const appr = getApprovalBadge(row);
                return (
                  <tr key={row.mouId ?? i} className={styles.tableRow}>

                    {/* Serial number */}
                    <td className={styles.tdIndex}>
                      {(currentPage - 1) * pageSize + i + 1}
                    </td>

                    {/* Title + remarks */}
                    <td>
                      <div className={styles.tdTitle}>
                        <span className={styles.titleText}>{row.mouTitle}</span>
                        {row.mouRemarks && (
                          <small className={styles.remarksText}>{row.mouRemarks}</small>
                        )}
                      </div>
                    </td>

                    <td>{row.mouStartDate}</td>
                    <td>{row.mouEndDate}</td>

                    {/* Approval status badge */}
                    <td>
                      <span className={`${styles.statusBadge} ${appr.cls}`}>
                        {appr.icon} {appr.label}
                      </span>
                    </td>

                    {/* Active / Expired / etc. badge */}
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(row)}`}>
                        {getStatusIcon(row)} {getStatusLabel(row)}
                      </span>
                    </td>

                    <td>{row.createdOn}</td>

                    {/* Document view button */}
                    <td>
                      {row.mouDocumentUrl ? (
                        <button
                          className={styles.btnDoc}
                          onClick={() => onViewDoc(row.mouDocumentUrl!)}
                        >
                          📄 View
                        </button>
                      ) : (
                        <span className={styles.noDoc}>—</span>
                      )}
                    </td>

                    {/* Edit action (locked when approved) */}
                    <td>
                      {row.isApproved !== 'True' ? (
                        <button
                          className={styles.btnEdit}
                          onClick={() => onEdit(row)}
                        >
                          ✎ Edit
                        </button>
                      ) : (
                        <span
                          className={styles.approvedLock}
                          title="Approved — cannot edit"
                        >
                          🔒
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────────────────── */}
      {!isLoading && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pgBtn}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {pageNumbers.map(n => (
            <button
              key={n}
              className={`${styles.pgBtn}${currentPage === n ? ` ${styles.active}` : ''}`}
              onClick={() => onPageChange(n)}
            >
              {n}
            </button>
          ))}

          <button
            className={styles.pgBtn}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
