import AppLayout from '@/layouts/app-layout';
import { formatTanggalIndo } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormValues as UwongFormValues } from './form';

import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    LinearProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Uwong', href: '/uwong' }];

type Uwong = UwongFormValues & { uuid: string };

// Laravel paginator shape
type UwongPaginator = {
    data: Uwong[];
    current_page: number;
    per_page: number;
    total: number;
};

// Kolom yang bisa sort (harus match whitelist di controller)
type SortBy = 'id' | 'name' | 'gender' | 'birthday' | 'phone' | 'address' | 'created_at';
type SortDir = 'asc' | 'desc';

export default function UwongIndex() {
    // Data & UI state
    const [rows, setRows] = useState<Uwong[]>([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(0); // MUI 0-based
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // Sorting state
    const [sortBy, setSortBy] = useState<SortBy>('id');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    // Delete state
    const [deleteTarget, setDeleteTarget] = useState<Uwong | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Server fetch: PATCH /uwong (datas)
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/uwong', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    q,
                    per_page: rowsPerPage,
                    page: page + 1,          // Laravel expects 1-based
                    sort_by: sortBy,         // server-side sorting
                    sort_dir: sortDir,
                }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: UwongPaginator = await res.json();
            setRows(data.data || []);
            setTotal(data.total ?? 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [q, page, rowsPerPage, sortBy, sortDir]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Toolbar actions
    const onRefresh = () => fetchData();
    const onChangeQuery = (val: string) => {
        setQ(val);
        setPage(0); // reset ke halaman pertama saat query berubah
    };

    // Pagination handlers
    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    // Sorting handlers
    const createSortHandler = (column: SortBy) => () => {
        if (sortBy === column) {
            setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(column);
            setSortDir('asc');
        }
        setPage(0);
    };

    // Delete
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/uwong/${deleteTarget.uuid}`, {
                method: 'DELETE',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setDeleteTarget(null);
            fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    const startIndex = useMemo(() => page * rowsPerPage, [page, rowsPerPage]);

    // Helper: apakah kolom sedang di-sort
    const isSorted = (col: SortBy) => sortBy === col;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Uwong" />
            <Box className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Paper className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {/* Toolbar */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight={600}>Daftar Uwong</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', maxWidth: 520 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Cari nama / phone / alamat / tanggal lahir"
                                value={q}
                                onChange={(e) => onChangeQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Tooltip title="Refresh">
                                <IconButton onClick={onRefresh}>
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            <Button component={Link as any} href="/uwong/create" variant="contained" startIcon={<AddIcon />}>
                                Tambah
                            </Button>
                        </Stack>
                    </Stack>

                    {loading && <LinearProgress />}

                    {/* Table */}
                    <TableContainer>
                        <Table sx={{ minWidth: 820 }} aria-label="tabel-uwong">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={56}>
                                        <TableSortLabel
                                            active={isSorted('id')}
                                            direction={isSorted('id') ? sortDir : 'asc'}
                                            onClick={createSortHandler('id')}
                                        >
                                            #
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={isSorted('name')}
                                            direction={isSorted('name') ? sortDir : 'asc'}
                                            onClick={createSortHandler('name')}
                                        >
                                            Nama
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={isSorted('gender')}
                                            direction={isSorted('gender') ? sortDir : 'asc'}
                                            onClick={createSortHandler('gender')}
                                        >
                                            Gender
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={isSorted('birthday')}
                                            direction={isSorted('birthday') ? sortDir : 'asc'}
                                            onClick={createSortHandler('birthday')}
                                        >
                                            Tgl Lahir
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={isSorted('phone')}
                                            direction={isSorted('phone') ? sortDir : 'asc'}
                                            onClick={createSortHandler('phone')}
                                        >
                                            Phone
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={isSorted('address')}
                                            direction={isSorted('address') ? sortDir : 'asc'}
                                            onClick={createSortHandler('address')}
                                        >
                                            Alamat
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right" width={180}>Aksi</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {!loading && rows.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Box display="flex" alignItems="center" justifyContent="center" py={6}>
                                                <Stack spacing={1} alignItems="center">
                                                    <Typography variant="body1">Belum ada data.</Typography>
                                                    <Button component={Link as any} href="/uwong/create" variant="outlined" startIcon={<AddIcon />}>
                                                        Tambah Uwong
                                                    </Button>
                                                </Stack>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {rows.map((u, idx) => (
                                    <TableRow key={u.uuid} hover>
                                        <TableCell>{startIndex + idx + 1}</TableCell>
                                        <TableCell>
                                            <Typography fontWeight={600}>{u.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={u.gender ? 'Male' : 'Female'}
                                                color={u.gender ? 'primary' : 'secondary'}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{u.birthday ? formatTanggalIndo(u.birthday) : '-'}</TableCell>
                                        <TableCell>{u.phone || '-'}</TableCell>
                                        <TableCell>
                                            <Tooltip title={u.address || '-'} placement="top" arrow>
                                                <Typography variant="body2" noWrap sx={{ maxWidth: 320 }}>
                                                    {u.address || '-'}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                                <Button
                                                    component={Link as any}
                                                    href={`/uwong/${u.uuid}/edit`}
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={<EditIcon fontSize="small" />}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    color="error"
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<DeleteIcon fontSize="small" />}
                                                    onClick={() => setDeleteTarget(u)}
                                                >
                                                    Hapus
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination (server-side) */}
                        <TablePagination
                            component="div"
                            count={total}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Paper>
            </Box>

            {/* Konfirmasi Hapus */}
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <DialogTitle>Hapus Uwong</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Apakah kamu yakin ingin menghapus <b>{deleteTarget?.name}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
                        Batal
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
                        {deleting ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
}
