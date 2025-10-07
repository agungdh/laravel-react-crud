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

// Ambil type dari form (phone tetap ada)
type Uwong = UwongFormValues & { uuid: string };

// Bentuk respons paginator Laravel
type UwongPaginator = {
    data: Uwong[];
    current_page: number;
    per_page: number;
    total: number;
};

export default function UwongIndex() {
    // data & ui state
    const [rows, setRows] = useState<Uwong[]>([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(0); // MUI 0-based
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // delete state
    const [deleteTarget, setDeleteTarget] = useState<Uwong | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch data dari server (server-side search + pagination)
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
                    page: page + 1, // Laravel paginator expects 1-based
                }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: UwongPaginator = await res.json();
            setRows(data.data || []);
            setTotal(data.total ?? 0);
            // optionally: setRowsPerPage(data.per_page ?? rowsPerPage);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [q, page, rowsPerPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // actions
    const onRefresh = () => fetchData();

    const onChangeQuery = (val: string) => {
        setQ(val);
        setPage(0); // reset ke halaman 1 saat ganti query
    };

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

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
            fetchData(); // refresh data
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    // nomor urut tabel
    const startIndex = useMemo(() => page * rowsPerPage, [page, rowsPerPage]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Uwong" />
            <Box className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Paper className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {/* Toolbar */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ p: 2 }}
                    >
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
                            <Button
                                component={Link as any}
                                href="/uwong/create"
                                variant="contained"
                                startIcon={<AddIcon />}
                            >
                                Tambah
                            </Button>
                        </Stack>
                    </Stack>

                    {loading && <LinearProgress />}

                    {/* Tabel */}
                    <TableContainer>
                        <Table sx={{ minWidth: 760 }} aria-label="tabel-uwong">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={48}>#</TableCell>
                                    <TableCell>Nama</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Tgl Lahir</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Alamat</TableCell>
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
                                                    <Button
                                                        component={Link as any}
                                                        href="/uwong/create"
                                                        variant="outlined"
                                                        startIcon={<AddIcon />}
                                                    >
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

                        {/* Pagination server-side */}
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
                    {/* kirim DELETE */}
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
                        {deleting ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
}
