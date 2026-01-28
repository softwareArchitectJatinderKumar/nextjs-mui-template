"use client";

import React, { useState, useMemo } from 'react';
import { 
    DataGrid, 
    GridColDef, 
    GridToolbarContainer, 
    GridToolbarExport 
} from '@mui/x-data-grid';
import { Box, TextField, Paper, Typography } from '@mui/material';

// Define structure based on your console output
interface SampleStatus {
    bookingId: number;
    sampleCount: number;
    testDate: string;
    receivedByUID: string;
    receivedBy: string;
    sampleCondition: string;
    receivedDate: string;
    instrumentName: string;
    sampleSendBy: string;
}

function CustomToolbar() {
    return (
        <GridToolbarContainer sx={{ p: 1 }}>
            <GridToolbarExport  />
        </GridToolbarContainer>
    );
}

export default function SampleStatusTable({ data, loading }: { data: SampleStatus[], loading: boolean }) {
    const [searchText, setSearchText] = useState('');

    // Filtering logic for the search bar
    const filteredRows = useMemo(() => {
        return data.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [data, searchText]);

    const columns: GridColDef[] = [
        { field: 'bookingId', headerName: 'Booking Id', width: 110, headerClassName: 'fw-bold' },
        { field: 'instrumentName', headerName: 'Instrument Name', flex: 1.5, minWidth: 250 },
        { 
            field: 'receivedBy', 
            headerName: 'Received By', 
            width: 180,
            renderCell: (params) => <span className="text-danger fw-bold">{params.value}</span>
        },
        { 
            field: 'receivedDate', 
            headerName: 'Received On', 
            width: 150,
            renderCell: (params) => <span className="text-danger fw-bold">{params.value}</span>
        },
        { field: 'sampleCount', headerName: 'Samples', width: 100, align: 'center' },
        { field: 'sampleCondition', headerName: 'Condition', flex: 1 },
    ];

    return (
        <Paper elevation={3} sx={{ width: '100%', p: 3, borderRadius: '10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Samples Received with Condition Details
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search records..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{ width: 300 }}
                />
            </Box>

            <DataGrid
                rows={filteredRows}
                columns={columns}
                loading={loading}
                getRowId={(row) => `${row.bookingId}-${row.receivedDate}-${Math.random()}`} 
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10, 25, 50]}
                slots={{ toolbar: CustomToolbar }}
                disableRowSelectionOnClick
                autoHeight
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                }}
            />
        </Paper>
    );
}