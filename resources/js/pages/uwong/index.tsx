import AppLayout from '@/layouts/app-layout';
import { formatTanggalIndo } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Uwong',
        href: '/uwong',
    },
];

export default function Index() {
    const [uwongs, setUwongs] = useState([]);

    async function getData() {
        const res = await fetch('/uwong', {
            method: 'PATCH',
        });
        const data = await res.json();
        setUwongs(data);
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Uwong" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Birthday</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {uwongs.map((uwong) => (
                                    <TableRow
                                        key={uwong.uuid}
                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell>{uwong.name}</TableCell>
                                        <TableCell>
                                            {uwong.gender ? 'Male' : 'Female'}
                                        </TableCell>
                                        <TableCell>
                                            {formatTanggalIndo(uwong.birthday)}
                                        </TableCell>
                                        <TableCell>{uwong.phone}</TableCell>
                                        <TableCell>{uwong.address}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </AppLayout>
    );
}
