// components/I18nProvider.tsx
'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import { getMessages, defaultLocale } from '@/i18n/config';

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState(defaultLocale);
    const [messages, setMessages] = useState<any>(null);

    useEffect(() => {
        const lang = localStorage.getItem('lang') || defaultLocale;
        setLocale(lang);
        getMessages(lang).then(setMessages);
    }, []);

    if (!messages) return null; // hoặc loading...

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
