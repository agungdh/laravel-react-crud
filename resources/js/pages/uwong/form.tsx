import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import TextField from '@mui/material/TextField';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Uwong',
        href: '/uwong/create',
    },
];

export default function Index() {
    const {
        register,
        handleSubmit,
    } = useForm()
    const [errors, setErrors] = useState([]);

    async function onSubmit(data) {
        try {
            const response = await fetch("/uwong", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                if (response.status === 422) {
                    const data = await response.json();
                    setErrors(data.errors);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            const result = await response.json(); // parsing response JSON
            console.log("Berhasil:", result);
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Uwong" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField {...register("name")} label="Name" variant="outlined" />
                        <br/>
                        {errors.name?.[0]}
                        <br/>

                        <TextField {...register("gender")} label="Gender" variant="outlined" />
                        <br/>
                        {errors.gender?.[0]}
                        <br/>

                        <Button type="submit" variant="contained">Tambah</Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
