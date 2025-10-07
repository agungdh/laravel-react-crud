import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Stack,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Alert,
} from '@mui/material';

type FormValues = {
    name: string;
    gender: boolean;
    birthday: string;
    phone: string;
    address: string;
};

export default function CreateUwong() {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>({});

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { isDirty },
    } = useForm<FormValues>({
        defaultValues: {
            name: '',
            gender: true,
            birthday: '',
            phone: '',
            address: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        setServerError(null);
        setBackendErrors({});

        const payload = { ...data };

        try {
            const res = await fetch('/uwong', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(payload),
                credentials: 'same-origin',
            });

            if (!res.ok) {
                if (res.status === 422) {
                    const j = await res.json();
                    setBackendErrors(j.errors || {});
                    setServerError('Periksa kembali isian Anda.');
                } else {
                    throw new Error(`HTTP ${res.status}`);
                }
            } else {
                reset({ name: '', gender: true, birthday: '', phone: '', address: '' });
                router.visit('/uwong');
            }
        } catch (e: any) {
            setServerError(e?.message || 'Terjadi kesalahan tak terduga.');
        } finally {
            setLoading(false);
        }
    };

    const nameValue = watch('name');

    return (
        <AppLayout breadcrumbs={[{ title: 'Uwong', href: '/uwong' }, { title: 'Create', href: '/uwong/create' }]}>
            <Head title="Create Uwong" />
            <Box className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border border-sidebar-border/70 dark:border-sidebar-border rounded-xl">
                    <CardHeader
                        title={
                            <Box className="flex items-center justify-between">
                                <Typography variant="h5" className="font-semibold">
                                    Tambah Uwong
                                </Typography>
                                <Box className="flex items-center gap-2">
                                    <Button component={Link as any} href="/uwong" variant="text">
                                        Kembali
                                    </Button>
                                    <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={18} /> : null}>
                                        Simpan
                                    </Button>
                                </Box>
                            </Box>
                        }
                        subheader={nameValue ? `Sedang menambahkan: ${nameValue}` : 'Lengkapi data berikut dengan benar.'}
                    />
                    <Divider />
                    <CardContent>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Stack spacing={3}>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        label="Nama Lengkap"
                                        placeholder="cth. Budi Santoso"
                                        {...register('name')}
                                        error={!!backendErrors.name}
                                        helperText={backendErrors.name?.[0]}
                                    />
                                </FormControl>

                                <FormControl error={!!backendErrors.gender}>
                                    <Typography variant="subtitle2" className="mb-2">
                                        Jenis Kelamin
                                    </Typography>
                                    <RadioGroup
                                        row
                                        {...register('gender')}
                                        onChange={(e) => {
                                            const value = e.target.value === 'true';
                                            setValue('gender', value);
                                        }}
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="Laki-laki" />
                                        <FormControlLabel value="false" control={<Radio />} label="Perempuan" />
                                    </RadioGroup>
                                    <FormHelperText>{backendErrors.gender?.[0]}</FormHelperText>
                                </FormControl>

                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Tanggal Lahir"
                                        InputLabelProps={{ shrink: true }}
                                        {...register('birthday')}
                                        error={!!backendErrors.birthday}
                                        helperText={backendErrors.birthday?.[0]}
                                    />
                                </FormControl>

                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        label="Nomor HP"
                                        placeholder="08xxxxxxxxxx"
                                        {...register('phone')}
                                        InputProps={{ startAdornment: <InputAdornment position="start">HP</InputAdornment> }}
                                        error={!!backendErrors.phone}
                                        helperText={backendErrors.phone?.[0]}
                                    />
                                </FormControl>

                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        label="Alamat"
                                        placeholder="Nama jalan, RT/RW, kelurahan/kecamatan, kota"
                                        multiline
                                        minRows={4}
                                        {...register('address')}
                                        error={!!backendErrors.address}
                                        helperText={backendErrors.address?.[0]}
                                    />
                                </FormControl>

                                <Box className="flex items-center gap-2">
                                    <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={18} /> : null}>
                                        Simpan Data
                                    </Button>
                                    <Button type="button" variant="outlined" disabled={loading || !isDirty} onClick={() => reset()}>
                                        Reset
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>

                        {serverError && (
                            <Box className="mt-4">
                                <Alert severity="error">{serverError}</Alert>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Box className="text-sm text-muted-foreground mt-2">
                    <Typography variant="body2">
                        Tip: pastikan format tanggal benar dan nomor HP aktif. Semua kolom wajib diisi.
                    </Typography>
                </Box>
            </Box>
        </AppLayout>
    );
}
