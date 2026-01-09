'use client';

import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ReusableDataGrid({ rows=[], columns=[] }) {
  const [search, setSearch] = useState('');

  const filteredRows = rows.filter(r =>
    JSON.stringify(r).toLowerCase().includes(search.toLowerCase())
  );

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'data.xlsx');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="Search" onChange={e => setSearch(e.target.value)} />
        <Button onClick={exportExcel}>Export</Button>
      </Box>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        autoHeight
        pageSizeOptions={[5, 10, 15, 20, 25]}
      />
    </Box>
  );
}
