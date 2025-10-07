import AppLayout from '@/layouts/app-layout';
import { formatTanggalIndo } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import type { FormValues as UwongFormValues } from './form';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Uwong', href: '/uwong' }];

type Uwong = UwongFormValues & { uuid: string };
type UwongPaginator = {
    data: Uwong[];
    current_page: number;
    per_page: number;
    total: number;
};
type SortBy =
    | 'id'
    | 'name'
    | 'gender'
    | 'birthday'
    | 'phone'
    | 'address'
    | 'created_at';
type SortDir = 'asc' | 'desc';

export default function UwongIndex() {
    const [rows, setRows] = useState<Uwong[]>([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState<SortBy>('id');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [deleteTarget, setDeleteTarget] = useState<Uwong | null>(null);
    const [deleting, setDeleting] = useState(false);

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
                    page: page + 1,
                    sort_by: sortBy,
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

    const handleSort = (column: SortBy) => () => {
        if (sortBy === column) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDir('asc');
        }
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
            fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

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
                        <Typography variant="h6" fontWeight={600}>
                            Daftar Uwong
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ width: '100%', maxWidth: 520 }}
                        >
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Cari nama / phone / alamat / tanggal lahir"
                                value={q}
                                onChange={(e) => {
                                    setQ(e.target.value);
                                    setPage(0);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Tooltip title="Refresh">
                                <IconButton onClick={fetchData}>
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

                    {/* Table */}
                    <TableContainer>
                        <Table sx={{ minWidth: 820 }} aria-label="tabel-uwong">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortBy === 'name'}
                                            direction={sortDir}
                                            onClick={handleSort('name')}
                                        >
                                            Nama
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortBy === 'gender'}
                                            direction={sortDir}
                                            onClick={handleSort('gender')}
                                        >
                                            Gender
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortBy === 'birthday'}
                                            direction={sortDir}
                                            onClick={handleSort('birthday')}
                                        >
                                            Tgl Lahir
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortBy === 'phone'}
                                            direction={sortDir}
                                            onClick={handleSort('phone')}
                                        >
                                            Phone
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortBy === 'address'}
                                            direction={sortDir}
                                            onClick={handleSort('address')}
                                        >
                                            Alamat
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">Aksi</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {!loading && rows.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            align="center"
                                            sx={{ py: 6 }}
                                        >
                                            <Typography>
                                                Belum ada data
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {rows.map((u) => (
                                    <TableRow key={u.uuid} hover>
                                        <TableCell>
                                            <Typography fontWeight={600}>
                                                {u.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={
                                                    u.gender ? 'Male' : 'Female'
                                                }
                                                color={
                                                    u.gender
                                                        ? 'primary'
                                                        : 'secondary'
                                                }
                                                variant="outlined"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {u.birthday
                                                ? formatTanggalIndo(u.birthday)
                                                : '-'}
                                        </TableCell>
                                        <TableCell>{u.phone}</TableCell>
                                        <TableCell>{u.address}</TableCell>
                                        <TableCell align="right">
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                justifyContent="flex-end"
                                            >
                                                <Button
                                                    component={Link as any}
                                                    href={`/uwong/${u.uuid}/edit`}
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={
                                                        <EditIcon fontSize="small" />
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    color="error"
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={
                                                        <DeleteIcon fontSize="small" />
                                                    }
                                                    onClick={() =>
                                                        setDeleteTarget(u)
                                                    }
                                                >
                                                    Hapus
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <TablePagination
                            component="div"
                            count={total}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </TableContainer>
                </Paper>
            </Box>

            {/* Konfirmasi Hapus */}
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <DialogTitle>Hapus Uwong</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Yakin ingin menghapus <b>{deleteTarget?.name}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteTarget(null)}
                        disabled={deleting}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
}
