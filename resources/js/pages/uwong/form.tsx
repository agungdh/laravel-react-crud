import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
    gender: boolean | null;
    birthday: string;
    phone: string;
    address: string;
};

export default function UwongForm() {
    const { props } = usePage<{ uwong_uuid?: string }>();
    const uwongUuid = props.uwong_uuid ?? null;

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>({});
    const [isEdit, setIsEdit] = useState<boolean>(!!uwongUuid);

    const {
        register,
        handleSubmit,
        reset,
        control,
    } = useForm<FormValues>({
        defaultValues: {
            name: '',
            gender: null,
            birthday: '',
            phone: '',
            address: '',
        },
    });

    // 🔹 Ambil data existing kalau mode edit
    useEffect(() => {
        const fetchData = async () => {
            if (!uwongUuid) return;

            try {
                const res = await fetch(`/uwong/${uwongUuid}`);
                if (!res.ok) throw new Error(`Gagal ambil data Uwong`);
                const data = await res.json();

                reset({
                    name: data.name || '',
                    gender: data.gender === null ? null : !!data.gender,
                    birthday: data.birthday || '',
                    phone: data.phone || '',
                    address: data.address || '',
                });
            } catch (e: any) {
                setServerError(e?.message || 'Gagal memuat data Uwong.');
            }
        };

        fetchData();
    }, [uwongUuid, reset]);

    const onSubmit = async (formData: FormValues) => {
        setLoading(true);
        setServerError(null);
        setBackendErrors({});

        try {
            const url = uwongUuid ? `/uwong/${uwongUuid}` : '/uwong';
            const method = uwongUuid ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(formData),
                credentials: 'same-origin',
            });

            if (!res.ok) {
                if (res.status === 422) {
                    const j = await res.json();
                    setBackendErrors(j.errors || {});
                } else {
                    throw new Error(`HTTP ${res.status}`);
                }
            } else {
                router.visit('/uwong');
            }
        } catch (e: any) {
            setServerError(e?.message || 'Terjadi kesalahan tak terduga.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Uwong', href: '/uwong' }, { title: isEdit ? 'Edit' : 'Create', href: `/uwong/${isEdit ? uwongUuid + '/edit' : 'create'}` }]}>
            <Head title={isEdit ? 'Edit Uwong' : 'Create Uwong'} />
            <Box className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border border-sidebar-border/70 dark:border-sidebar-border rounded-xl">
                    <CardHeader title={<Typography variant="h5" className="font-semibold">{isEdit ? 'Edit Uwong' : 'Tambah Uwong'}</Typography>} />
                    <Divider />
                    <CardContent>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Stack spacing={3}>
                                {/* Nama */}
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

                                {/* Gender */}
                                <FormControl error={!!backendErrors.gender}>
                                    <Typography variant="subtitle2" className="mb-2">Jenis Kelamin</Typography>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <RadioGroup
                                                row
                                                value={field.value === null ? '' : field.value ? 'true' : 'false'}
                                                onChange={(e) => field.onChange(e.target.value === 'true')}
                                            >
                                                <FormControlLabel value="true" control={<Radio />} label="Laki-laki" />
                                                <FormControlLabel value="false" control={<Radio />} label="Perempuan" />
                                            </RadioGroup>
                                        )}
                                    />
                                    <FormHelperText>{backendErrors.gender?.[0]}</FormHelperText>
                                </FormControl>

                                {/* Tanggal Lahir */}
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

                                {/* Nomor HP */}
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

                                {/* Alamat */}
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

                                {/* Actions */}
                                <Box className="flex items-center justify-end gap-2">
                                    <Button component={Link as any} href="/uwong" variant="text">
                                        Kembali
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={18} /> : null}
                                    >
                                        {isEdit ? 'Update' : 'Simpan'}
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
            </Box>
        </AppLayout>
    );
}
