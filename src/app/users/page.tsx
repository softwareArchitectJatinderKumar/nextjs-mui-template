// 'use client';

// import { useEffect, useState } from 'react';
// import ReusableDataGrid from '@/components/datagrid/ReusableDataGrid';
// import { getUsers } from '@/services/userApi';


// export default function UsersPage() {
//   const [rows, setRows] = useState([]);

//   useEffect(() => {
//     getUsers().then((data: any) => setRows(data));
//   }, []);

//   const columns = [
//     { field: 'id', headerName: 'ID', width: 90 },
//     { field: 'name', headerName: 'Name', width: 150 },
//     { field: 'email', headerName: 'Email', width: 200 }
//   ];

//   return <ReusableDataGrid rows={rows} columns={columns} />;
// }
'use client';

import { useEffect, useState } from 'react';
import ReusableDataGrid from '@/components/datagrid/ReusableDataGrid';
import { getUsers } from '@/services/userApi';
import { GridColDef } from '@mui/x-data-grid';

export default function UsersPage() {
  // Tell state it will be an array of objects, not an empty "never" array
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    getUsers().then((data: any) => setRows(data));
  }, []);

  // Use GridColDef for the columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 }
  ];

  return <ReusableDataGrid rows={rows} columns={columns} />;
}