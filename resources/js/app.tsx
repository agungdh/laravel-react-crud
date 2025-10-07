import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/* -----------------------------------------------------------
   🔒 CSRF HELPERS
----------------------------------------------------------- */
function getMetaCsrf(): string {
    return (
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
}

function setMetaCsrf(token: string) {
    const el = document.querySelector('meta[name="csrf-token"]');
    if (el) el.setAttribute('content', token);
}

/**
 * Ambil token CSRF baru dari backend dan update meta tag + cache JS
 */
async function refreshCsrfToken() {
    try {
        const res = await fetch('/csrf-token', {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (res.ok) {
            const { token } = await res.json();
            setMetaCsrf(token);
            (window as any).__CSRF_TOKEN__ = token;
            console.info('[CSRF] token updated');
        } else {
            console.warn('[CSRF] failed to refresh token', res.status);
        }
    } catch (err) {
        console.error('[CSRF] error refreshing token', err);
    }
}

/* -----------------------------------------------------------
   🌐 PATCH GLOBAL FETCH
----------------------------------------------------------- */
(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
        const token = (window as any).__CSRF_TOKEN__ ?? getMetaCsrf();

        const headers = new Headers(init.headers || {});
        headers.set('X-Requested-With', 'XMLHttpRequest');
        headers.set('X-CSRF-TOKEN', token);

        const credentials = init.credentials ?? 'same-origin';

        return originalFetch(input, { ...init, headers, credentials });
    };
})();

/* -----------------------------------------------------------
   ⚡ REFRESH CSRF SETELAH LOGIN
----------------------------------------------------------- */
router.on('finish', (event: any) => {
    const visit = event?.detail?.visit;
    if (
        visit?.method?.toLowerCase() === 'post' &&
        String(visit?.url || '').includes('/login')
    ) {
        refreshCsrfToken();
    }
});

// Jalankan sekali saat pertama load
refreshCsrfToken();

/* -----------------------------------------------------------
   🚀 INERTIA APP
----------------------------------------------------------- */
createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: { color: '#4B5563' },
});

// Set tema light/dark saat load
initializeTheme();
