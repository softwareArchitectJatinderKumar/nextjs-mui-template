import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TablePagination, TextField, Button, Box, MenuItem, Select 
} from '@mui/material';
import * as XLSX from 'xlsx';

interface GridProps {
  dataArray: any[];
  columns: { key: string; label: string }[];
}

export const DynamicGrid = ({ dataArray, columns }: GridProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState('');

  const filtered = dataArray.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(query.toLowerCase()))
  );

  const exportToExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(filtered);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Report");
    XLSX.writeFile(book, "DataExport.xlsx");
  };

  return (
    <Paper sx={{ width: '100%', p: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <TextField 
          label="Search..." size="small" variant="outlined" 
          onChange={(e) => setQuery(e.target.value)} 
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" color="success" onClick={exportToExcel}>Export Excel</Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              {columns.map(col => <TableCell key={col.key}><strong>{col.label}</strong></TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
              <TableRow key={i} hover>
                {columns.map(col => <TableCell key={col.key}>{row[col.key]}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20, 25]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
};