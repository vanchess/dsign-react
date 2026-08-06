import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import {DataGrid} from '@mui/x-data-grid';
import {ferzlAccountService} from '../../services';
import CustomLoadingOverlay from '../DataGrid/CustomLoadingOverlay';
import CustomNoRowsOverlay from '../DataGrid/CustomNoRowsOverlay';
import CustomPagination from '../DataGrid/CustomPagination';
import CustomToolbar from '../DataGrid/CustomToolbar';

function formatDate(value, withTime = false) {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('ru-RU', withTime
        ? {dateStyle: 'short', timeStyle: 'short'}
        : {dateStyle: 'short'}
    );
}

function statusLabel(value) {
    if (value === true) {
        return 'Получена';
    }
    if (value === false) {
        return 'Не получена';
    }
    return 'Сведения не предоставлены';
}

function accessLabel(value) {
    if (value === true) {
        return 'Есть';
    }
    if (value === false) {
        return 'Нет';
    }
    return 'Сведения не предоставлены';
}

function apiErrorMessage(error) {
    const data = error && error.error && error.error.data;
    return (data && data.message) || 'Не удалось загрузить сводные сведения.';
}

export default function FerzlAccountSummary() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(() => {
        setLoading(true);
        setError('');

        ferzlAccountService.getSummary().then((data) => {
            setRows(data.data || []);
            setLoading(false);
        }).catch((loadError) => {
            setError(apiErrorMessage(loadError));
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const columns = useMemo(() => [
        {field: 'organization_name', headerName: 'Медицинская организация', minWidth: 280, flex: 1},
        {
            field: 'status',
            headerName: 'Статус',
            width: 210,
            valueGetter: (value, row) => statusLabel(row.is_received),
        },
        {
            field: 'received_at_display',
            headerName: 'Дата получения',
            width: 150,
            valueGetter: (value, row) => formatDate(row.received_at),
        },
        {
            field: 'not_received_reason',
            headerName: 'Причина неполучения',
            minWidth: 240,
            flex: 0.8,
        },
        {
            field: 'access_status',
            headerName: 'Доступ к подсистеме',
            width: 210,
            valueGetter: (value, row) => accessLabel(row.has_access),
        },
        {field: 'responsible_phone', headerName: 'Телефон ответственного', width: 210},
        {field: 'note', headerName: 'Примечание', minWidth: 220, flex: 0.7},
        {field: 'reported_by', headerName: 'Сведения внесены', minWidth: 210, flex: 0.6},
        {
            field: 'updated_at_display',
            headerName: 'Обновлено',
            width: 160,
            valueGetter: (value, row) => formatDate(row.updated_at, true),
        },
    ], []);

    return (
        <Box sx={{p: 2, height: 'calc(100vh - 64px)', boxSizing: 'border-box'}}>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 1}}>
                <Button startIcon={<RefreshIcon />} onClick={load} disabled={loading}>
                    Обновить
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

            <Box sx={{height: error ? 'calc(100% - 104px)' : 'calc(100% - 48px)'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    disableRowSelectionOnClick
                    initialState={{
                        density: 'compact',
                        pagination: {paginationModel: {pageSize: 20}},
                    }}
                    pageSizeOptions={[10, 20, 50, 100]}
                    slots={{
                        toolbar: CustomToolbar,
                        loadingOverlay: CustomLoadingOverlay,
                        noRowsOverlay: CustomNoRowsOverlay,
                        pagination: CustomPagination,
                    }}
                />
            </Box>
        </Box>
    );
}
