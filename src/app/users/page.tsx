'use client';

import { useEffect, useState } from 'react';
import ReusableDataGrid from '@/components/datagrid/ReusableDataGrid';
import { getUsers } from '@/services/userApi';
import { GridColDef } from '@mui/x-data-grid';

export default function UsersPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    getUsers().then((data: any) => setRows(data));
  }, []);
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 }
  ];

  return <ReusableDataGrid rows={rows} columns={columns} />;
}